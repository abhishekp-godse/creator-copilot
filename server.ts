import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Server-side Gemini initialization with aistudio-build telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Audio Transcription endpoint using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType = 'audio/webm' } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: 'Missing audioData in request body' });
    }

    if (!ai) {
      return res.json({
        text: 'DeepSeek R1 versus Claude Code benchmark on local Mac Mini M4 with latency charts and thermals.',
        model: 'simulated-fallback',
        note: 'GEMINI_API_KEY not set on server; using simulated fallback transcription.'
      });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType.split(';')[0], // e.g. audio/webm or audio/wav
        data: audioData,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe this spoken audio precisely. Capture all creator ideas, numbers, and platform names accurately.' }
        ]
      },
    });

    res.json({
      text: response.text || '',
      model: 'gemini-3.5-transcribe'
    });
  } catch (err: any) {
    console.error('Transcription error:', err);
    res.status(500).json({ error: err.message || 'Audio transcription failed' });
  }
});

// 2. Chat Coach endpoint using gemini-3.8-flash
app.post('/api/coach/chat', async (req, res) => {
  try {
    const { prompt, clientContext, chatHistory = [] } = req.body;

    if (!ai) {
      return res.json({
        reply: `[Coach Telemetry]: You are on a ${clientContext?.currentStreakDays || 14}-day streak. Optimal posting time is ${clientContext?.bestPostingTime || 'today at 7:00 PM'}. Keep the first 3 seconds focused on proof!`
      });
    }

    const systemInstruction = `
You are CreatorPilot, an executive AI Growth Coach and personal talent manager for creator ${clientContext?.name || 'Creator'} (${clientContext?.niche || 'Digital Content'}).
Total Audience: ${clientContext?.totalFollowers || 380000} | Streak: ${clientContext?.currentStreakDays || 14} days | Last post: ${clientContext?.lastPostHoursAgo || 140}h ago.
Optimal Posting Window: ${clientContext?.bestPostingTime || '7:00 PM EDT'}.
Give concise, tactical advice suitable for mobile viewing with concrete timestamps, hooks, and timing reminders.
    `.trim();

    const contents = [
      ...chatHistory.slice(-4).map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || '' });
  } catch (err: any) {
    console.error('Coach chat error:', err);
    res.status(500).json({ error: err.message || 'Chat generation failed' });
  }
});

// 3. WebSocket Server for Gemini Live API (gemini-3.8-live) real-time voice conversations
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : '';
  if (pathname === '/api/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs) => {
  console.log('Client connected to /api/live WebSocket');

  if (!ai) {
    clientWs.send(JSON.stringify({
      error: 'GEMINI_API_KEY is not configured on the server. Live voice requires an API key in Settings > Secrets.'
    }));
    return;
  }

  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
          },
        },
        systemInstruction: 'You are CreatorPilot Live, a real-time vocal AI growth manager. You are conversing directly with the content creator over audio. Speak concisely, with upbeat, sharp creator management insights, hook guidance, and schedule accountability.',
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === clientWs.OPEN) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === clientWs.OPEN) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
      },
    });

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (err) {
        console.error('Error handling client message:', err);
      }
    });

    clientWs.on('close', () => {
      console.log('Client disconnected from /api/live');
      if (session && typeof session.close === 'function') {
        session.close();
      }
    });
  } catch (err: any) {
    console.error('Error connecting to gemini-3.8-live:', err);
    if (clientWs.readyState === clientWs.OPEN) {
      clientWs.send(JSON.stringify({
        error: err.message || 'Failed to establish Live API voice session.'
      }));
    }
  }
});

// Vite middleware in dev or static files in production
async function setupVite() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }
}

setupVite().then(() => {
  server.listen(port, () => {
    console.log(`CreatorPilot server running on port ${port} (mode: ${process.env.NODE_ENV || 'development'})`);
  });
});
