import { GoogleGenAI } from '@google/genai';
import { CreatorClient, TrendItem, RetentionAnalysisData, CommentSentimentData } from '../types';

interface CoachQueryContext {
  client: CreatorClient;
  recentTrends: TrendItem[];
  retention: RetentionAnalysisData;
  sentiment: CommentSentimentData;
}

export async function askCreatorCoach(
  userPrompt: string,
  context: CoachQueryContext,
  chatHistory: { sender: 'user' | 'coach'; text: string }[]
): Promise<string> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
                 (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || '';

  const { client, recentTrends, retention, sentiment } = context;

  const systemInstruction = `
You are CreatorPilot, an elite executive AI Growth Coach and personal talent manager for content creators.
You are talking directly to creator ${client.name} (${client.handle}), who creates content in the "${client.niche}" niche.

Current Creator Telemetry:
- Total Audience: ${client.totalFollowers.toLocaleString()} followers (${client.primaryPlatform.toUpperCase()} primary)
- 24h Subscriber Velocity: +${client.subscriberVelocity24h.toLocaleString()} / day
- Overall Engagement Rate: ${client.overallEngagementRate}%
- Consistency Streak: ${client.currentStreakDays} days (Streak at risk: ${client.streakAtRisk ? 'YES' : 'NO'})
- Last Post: ${client.lastPostHoursAgo} hours ago (Threshold limit is ${client.uploadGapLimitDays * 24} hours)
- Burnout Risk Level: ${client.burnoutRisk.toUpperCase()} - ${client.burnoutMessage}
- Optimal Posting Window: ${client.bestPostingTime}
- Growth Health Score: ${client.growthHealthScore.total}/100 (Consistency: ${client.growthHealthScore.consistency}, Engagement: ${client.growthHealthScore.engagement}, Trend: ${client.growthHealthScore.trendAlignment})
- Latest Video Drop-off Point: ${retention.criticalDropOffSecond}s (${retention.primaryDropReason})
- Audience Sentiment: ${sentiment.positivePct}% Positive, ${sentiment.negativePct}% Negative
- Top Requested Audience Topic: "${sentiment.audienceRequestedTopics[0]?.topic || 'None'}" (${sentiment.audienceRequestedTopics[0]?.requestCount || 0} requests)
- Top Trending Topic in Niche: "${recentTrends[0]?.topic || 'None'}" (Trend-Fit Score: ${recentTrends[0]?.trendFitScore}%, Expiry: ${recentTrends[0]?.expiryHoursRemaining}h)

Coaching Guidelines:
1. Speak with proactive energy, like a high-level manager who genuinely cares about their client's retention, algorithm standing, and mental well-being.
2. Be tactically precise: give concrete timestamps, hook scripts, title formulations, and upload times.
3. Keep responses structured and concise (max 3-4 punchy paragraphs or bullet points) suitable for mobile audio playback and reading on the go.
4. If they ask "Why did my last video flop?", cite the exact drop-off data (${retention.criticalDropOffSecond}s) and hook strength.
5. If they ask what to post, recommend their highest trend-fit opportunity (${recentTrends[0]?.topic}) or their top audience comment request.
`.trim();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents = [
        ...chatHistory.slice(-4).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('Gemini API call failed, switching to expert heuristic coach:', err);
    }
  }

  // Domain-expert fallback coach engine
  return generateExpertHeuristicResponse(userPrompt, context);
}

function generateExpertHeuristicResponse(prompt: string, context: CoachQueryContext): string {
  const lower = prompt.toLowerCase();
  const { client, recentTrends, retention, sentiment } = context;

  if (lower.includes('flop') || lower.includes('drop') || lower.includes('last video') || lower.includes('retention')) {
    const dropPoint = retention.points.find(p => p.second === retention.criticalDropOffSecond);
    const dropLostPct = dropPoint ? Math.round(100 - dropPoint.retentionPct) : 15;
    return `Looking at the telemetry for "${retention.videoTitle}", here is exactly why the video plateaued:

1. **The 0:${retention.criticalDropOffSecond < 10 ? '0' : ''}${retention.criticalDropOffSecond} Drop-off Cliff**: You lost ${dropLostPct}% of your viewers in the opening seconds. ${retention.primaryDropReason}

2. **The Fix for Next Video**: ${retention.coachFixAdvice}

3. **Algorithm Rebound Plan**: Your audience retention averaged ${retention.avgRetentionPct}%, which is still respectable. Post a 30-second Short teasing the most exciting part of this project with the hook: "${recentTrends[0]?.recommendedHook || 'Watch what happens next'}" to send an algorithmic discovery signal!`;
  }

  if (lower.includes('post this week') || lower.includes('what should i post') || lower.includes('ideas') || lower.includes('content idea')) {
    const topTrend = recentTrends[0];
    const topReq = sentiment.audienceRequestedTopics[0];
    return `Here is your high-impact publishing plan for this week to maintain your ${client.currentStreakDays}-day streak:

• **Post #1 (High Velocity Trend)**: "${topTrend.topic}"
  - **Trend-Fit**: ${topTrend.trendFitScore}% match (${topTrend.expiryHoursRemaining}h remaining before saturation)
  - **Hook Script**: ${topTrend.recommendedHook}
  - **Optimal Window**: ${client.bestPostingTime}

• **Post #2 (Audience Demand Goldmine)**: "${topReq?.topic || 'Behind the scenes'}"
  - You have ${topReq?.requestCount || 150} direct comments begging for this. Commenters are already primed to watch and share!

• **Pacing Note**: Your burnout indicator is currently ${client.burnoutRisk}. Don't over-edit Post #2; prioritize crisp audio and immediate visual payoff in the first 3 seconds.`;
  }

  if (lower.includes('streak') || lower.includes('gap') || lower.includes('consistency')) {
    return `Consistency Check: You are currently on a **${client.currentStreakDays}-day streak** (Personal Best: ${client.bestStreakDays} days).

⚠️ **Alert**: It has been ${Math.round(client.lastPostHoursAgo / 24)} days since your last upload. Historical data shows your average viewer return rate dips by 24% once a gap exceeds ${client.uploadGapLimitDays} days.

**Action item**: Record a 45-second raw update or short form piece today before ${client.bestPostingTime}. Consistency beats perfection right now!`;
  }

  if (lower.includes('burnout') || lower.includes('tired') || lower.includes('rest') || lower.includes('break')) {
    return `I've been monitoring your schedule carefully:
- Your upload times recently slipped to late night hours.
- You've pushed out ${client.platforms.youtube.postsThisMonth + client.platforms.instagram.postsThisMonth} pieces of content across platforms this month.

**Coach Prescription**: Take a 48-hour production blackout. We have 3 high-scoring drafts in your Idea Vault ready to go. I will protect your streak by scheduling a pre-recorded community poll and an automated cross-platform clip. Your creative energy is the channel's single most valuable asset.`;
  }

  if (lower.includes('title') || lower.includes('thumbnail') || lower.includes('hook') || lower.includes('ctr')) {
    return `For titles in the "${client.niche}" niche, high CTR comes from three specific ingredients:
1. **Curiosity Gap without Clickbait**: State an unexpected outcome or extreme constraint.
2. **First 4 Words Impact**: On mobile, viewers only read the first 32 characters before scrolling.
3. **Number Anchors**: Specific numbers (e.g. "$60", "48 Hours", "3 Drills") boost CTR by +38% on ${client.primaryPlatform}.

Try running your title through our Title Scorer in the Analytics tab, or share a draft right now and I'll generate 3 high-retention variations for you!`;
  }

  // Default smart guidance
  return `Analyzing ${client.name}'s performance right now:
- **Growth Health**: ${client.growthHealthScore.total}/100. Your engagement is solid at ${client.overallEngagementRate}%, but watch the ${Math.round(client.lastPostHoursAgo / 24)}-day upload gap.
- **Top Opportunity**: The "${recentTrends[0]?.topic}" wave has a ${recentTrends[0]?.trendFitScore}% fit with your subscribers and is projected to bring +${Math.round(client.subscriberVelocity24h * 1.8)} subs over 48 hours.
- **Recommended Action**: Schedule your next post for ${client.bestPostingTime}.

What would you like me to analyze next? I can diagnose your drop-off curves, score a title, or generate collaboration pitches!`;
}

// Voice synthesis and Speech recognition services
export class VoiceAssistant {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (!this.synth) return;
    this.stopSpeaking();

    // Clean markdown asterisks and formatting for natural speech
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/`.*?`/g, '')
      .slice(0, 400); // punchy mobile speech

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick warm natural voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.lang.startsWith('en')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  initSpeechRecognition(
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError('Speech recognition not supported in this browser.');
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        onError(event.error || 'Speech capture failed');
      };

      this.recognition.onend = () => {
        onEnd();
      };

      return true;
    } catch (e: any) {
      onError(e.message || 'Failed to initialize speech recognition');
      return false;
    }
  }

  startListening() {
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Recognition already started or error:', err);
      }
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Recognition stop error:', err);
      }
    }
  }
}

export const voiceService = new VoiceAssistant();
