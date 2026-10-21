import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Radio
} from 'lucide-react';
import { CreatorClient, ChatMessage, TrendItem, RetentionAnalysisData, CommentSentimentData } from '../../types';
import { askCreatorCoach, voiceService } from '../../services/geminiCoach';

interface CoachTabProps {
  client: CreatorClient;
  recentTrends: TrendItem[];
  retention: RetentionAnalysisData;
  sentiment: CommentSentimentData;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  onOpenLiveVoice?: () => void;
}

export const CoachTab: React.FC<CoachTabProps> = ({
  client,
  recentTrends,
  retention,
  sentiment,
  initialPrompt,
  onClearInitialPrompt,
  onOpenLiveVoice
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      sender: 'coach',
      text: `Hey ${client.name}! I'm your CreatorPilot AI growth coach. I've been monitoring your upload pacing (${(client.lastPostHoursAgo / 24).toFixed(1)} days since last upload) and audience engagement (${client.overallEngagementRate}%). What would you like to strategize today?`,
      timestamp: 'Just now',
      suggestedActions: [
        'Why did my last video flop?',
        'What should I post this week?',
        'How to fix the 0:18 retention drop?',
        'Analyze my burnout risk'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle triggered initial prompt from other tabs
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      onClearInitialPrompt?.();
    }
  }, [initialPrompt]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const coachReplyText = await askCreatorCoach(
        text,
        { client, recentTrends, retention, sentiment },
        messages.map(m => ({ sender: m.sender, text: m.text }))
      );

      const coachMsg: ChatMessage = {
        id: `coach_${Date.now()}`,
        sender: 'coach',
        text: coachReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'Give me 3 viral hooks for this',
          'Add this to Idea Vault',
          'Evaluate best posting time'
        ]
      };

      setMessages(prev => [...prev, coachMsg]);

      // If user was using voice mode, read it back aloud
      if (isListening) {
        speakResponse(coachReplyText);
      }
    } catch (err) {
      console.error('Coach response error:', err);
    } finally {
      setIsThinking(false);
    }
  };

  const speakResponse = (text: string) => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    voiceService.speak(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    const initialized = voiceService.initSpeechRecognition(
      (transcript) => {
        setIsListening(false);
        handleSendMessage(transcript);
      },
      (err) => {
        console.warn('Speech error:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (initialized) {
      setIsListening(true);
      voiceService.startListening();
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
    setMessages([
      {
        id: `reset_${Date.now()}`,
        sender: 'coach',
        text: `Session reset! I am ready to advise on ${client.name}'s next viral breakthrough. What's on your mind?`,
        timestamp: 'Just now',
        suggestedActions: [
          'Why did my last video flop?',
          'What should I post this week?',
          'How to fix the 0:18 retention drop?'
        ]
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[820px] pb-20">
      {/* Voice Status & Quick Bar */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isSpeaking
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
          }`}>
            {isSpeaking ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Bot className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>Siri for Creators</span>
              {isSpeaking && (
                <span className="text-[10px] text-emerald-400 font-mono animate-pulse">
                  Speaking...
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400">
              Niche memory: {client.niche}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenLiveVoice && (
            <button
              onClick={onOpenLiveVoice}
              className="px-2.5 py-1 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
              title="Launch bidirectional Live Voice conversation"
            >
              <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
              <span>Live API</span>
            </button>
          )}

          {isSpeaking && (
            <button
              onClick={() => {
                voiceService.stopSpeaking();
                setIsSpeaking(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] flex items-center gap-1"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Mute</span>
            </button>
          )}

          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 px-1 pr-1">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-end gap-2 max-w-[90%]">
              {msg.sender === 'coach' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mb-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-white/10 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'coach' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => speakResponse(msg.text)}
                        className="p-1 hover:text-indigo-400 transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="p-1 hover:text-indigo-400 transition-colors"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mb-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Suggested prompt chips below coach message */}
            {msg.sender === 'coach' && msg.suggestedActions && (
              <div className="flex flex-wrap gap-1.5 mt-2 pl-9">
                {msg.suggestedActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(action)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 pl-2 text-xs text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Analyzing real-time client metrics & retention curves...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar & Hands-Free Microphone */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-lg"
        >
          {/* Microphone button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all min-h-[44px] min-w-[44px] ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice mode (Talk to Siri-like Coach)'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-indigo-400" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? 'Listening to your voice...' : 'Ask your coach (e.g., Why did last video flop?)...'}
            className="flex-1 bg-transparent border-0 px-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
