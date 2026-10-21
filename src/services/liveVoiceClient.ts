// Client-side service for Gemini Live API (gemini-3.8-live) real-time voice conversations

export interface LiveVoiceStatus {
  isConnected: boolean;
  isListening: boolean;
  isModelSpeaking: boolean;
  error: string | null;
}

export class LiveVoiceClient {
  private ws: WebSocket | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private nextPlayTime: number = 0;
  private activeSources: AudioBufferSourceNode[] = [];

  private onStatusChange: (status: LiveVoiceStatus) => void = () => {};

  public status: LiveVoiceStatus = {
    isConnected: false,
    isListening: false,
    isModelSpeaking: false,
    error: null,
  };

  constructor(onStatusChange?: (status: LiveVoiceStatus) => void) {
    if (onStatusChange) {
      this.onStatusChange = onStatusChange;
    }
  }

  private updateStatus(newPartial: Partial<LiveVoiceStatus>) {
    this.status = { ...this.status, ...newPartial };
    this.onStatusChange(this.status);
  }

  public async connect(): Promise<boolean> {
    try {
      this.updateStatus({ error: null });

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;

      this.ws = new WebSocket(wsUrl);

      return new Promise((resolve) => {
        if (!this.ws) return resolve(false);

        this.ws.onopen = async () => {
          this.updateStatus({ isConnected: true });
          await this.startAudioStreaming();
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.error) {
              this.updateStatus({ error: data.error });
            }
            if (data.interrupted) {
              this.stopAllAudio();
              this.updateStatus({ isModelSpeaking: false });
            }
            if (data.audio) {
              this.playAudioChunk(data.audio);
            }
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        };

        this.ws.onerror = (err) => {
          console.error('WebSocket Live error:', err);
          this.updateStatus({ error: 'Connection to Live API voice session failed.' });
          resolve(false);
        };

        this.ws.onclose = () => {
          this.cleanup();
          this.updateStatus({ isConnected: false, isListening: false, isModelSpeaking: false });
        };
      });
    } catch (err: any) {
      this.updateStatus({ error: err.message || 'Failed to initialize Live voice session' });
      return false;
    }
  }

  private async startAudioStreaming() {
    try {
      // Input: 16kHz for mic capture as required by Live API
      this.inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });

      // Output: 24kHz for Live API model voice playback
      this.outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const source = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
      this.processor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);

      source.connect(this.processor);
      this.processor.connect(this.inputAudioCtx.destination);

      this.processor.onaudioprocess = (e) => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const inputChannel = e.inputBuffer.getChannelData(0);
        // Convert Float32 to 16-bit PCM little-endian
        const pcmBuffer = new ArrayBuffer(inputChannel.length * 2);
        const pcmView = new DataView(pcmBuffer);

        for (let i = 0; i < inputChannel.length; i++) {
          const s = Math.max(-1, Math.min(1, inputChannel[i]));
          const val = s < 0 ? s * 0x8000 : s * 0x7fff;
          pcmView.setInt16(i * 2, val, true);
        }

        const base64Audio = this.arrayBufferToBase64(pcmBuffer);
        this.ws.send(JSON.stringify({ audio: base64Audio }));
      };

      this.updateStatus({ isListening: true });
    } catch (err: any) {
      console.error('Audio capture error:', err);
      this.updateStatus({ error: 'Microphone permission denied or audio device unavailable.' });
    }
  }

  private playAudioChunk(base64Audio: string) {
    if (!this.outputAudioCtx) return;

    try {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert 16-bit PCM (24kHz) to Float32 AudioBuffer
      const int16View = new Int16Array(bytes.buffer);
      const audioBuffer = this.outputAudioCtx.createBuffer(1, int16View.length, 24000);
      const channelData = audioBuffer.getChannelData(0);

      for (let i = 0; i < int16View.length; i++) {
        channelData[i] = int16View[i] / 32768.0;
      }

      const sourceNode = this.outputAudioCtx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(this.outputAudioCtx.destination);

      const currentTime = this.outputAudioCtx.currentTime;
      if (this.nextPlayTime < currentTime) {
        this.nextPlayTime = currentTime;
      }

      sourceNode.start(this.nextPlayTime);
      this.nextPlayTime += audioBuffer.duration;

      this.activeSources.push(sourceNode);
      this.updateStatus({ isModelSpeaking: true });

      sourceNode.onended = () => {
        this.activeSources = this.activeSources.filter(s => s !== sourceNode);
        if (this.activeSources.length === 0) {
          this.updateStatus({ isModelSpeaking: false });
        }
      };
    } catch (err) {
      console.error('Error playing audio chunk:', err);
    }
  }

  private stopAllAudio() {
    this.activeSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    this.activeSources = [];
    if (this.outputAudioCtx) {
      this.nextPlayTime = this.outputAudioCtx.currentTime;
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  public disconnect() {
    this.cleanup();
    this.updateStatus({ isConnected: false, isListening: false, isModelSpeaking: false });
  }

  private cleanup() {
    this.stopAllAudio();

    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.inputAudioCtx) {
      this.inputAudioCtx.close();
      this.inputAudioCtx = null;
    }
    if (this.outputAudioCtx) {
      this.outputAudioCtx.close();
      this.outputAudioCtx = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
