import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, Radio, AlertCircle } from 'lucide-react';
import { LiveVoiceClient, LiveVoiceStatus } from '../services/liveVoiceClient';
import { CreatorClient } from '../types';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: CreatorClient;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ isOpen, onClose, client }) => {
  const [voiceClient, setVoiceClient] = useState<LiveVoiceClient | null>(null);
  const [status, setStatus] = useState<LiveVoiceStatus>({
    isConnected: false,
    isListening: false,
    isModelSpeaking: false,
    error: null,
  });
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      if (voiceClient) {
        voiceClient.disconnect();
        setVoiceClient(null);
      }
      return;
    }

    const clientInstance = new LiveVoiceClient((newStatus) => {
      setStatus(newStatus);
    });

    setVoiceClient(clientInstance);
    setConnecting(true);

    clientInstance.connect().finally(() => {
      setConnecting(false);
    });

    return () => {
      clientInstance.disconnect();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center overflow-hidden">
        
        {/* Glow ambient background effects */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="w-full flex items-center justify-between mb-4 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>gemini-3.8-live</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Visualizer Sphere */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Animated concentric rings */}
          <div className={`absolute w-44 h-44 rounded-full transition-all duration-700 ${
            status.isModelSpeaking
              ? 'bg-gradient-to-tr from-emerald-500/30 to-indigo-500/30 animate-ping opacity-60'
              : status.isListening
              ? 'bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 animate-pulse'
              : 'bg-slate-800/40'
          }`} />

          <div className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            status.isModelSpeaking
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 ring-8 ring-emerald-500/30 scale-105'
              : status.isListening
              ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 ring-8 ring-indigo-500/30'
              : 'bg-slate-800 border border-slate-700'
          }`}>
            {status.isModelSpeaking ? (
              <Volume2 className="w-12 h-12 text-white animate-bounce" />
            ) : status.isListening ? (
              <Mic className="w-12 h-12 text-white animate-pulse" />
            ) : (
              <Sparkles className="w-10 h-10 text-indigo-400" />
            )}
          </div>
        </div>

        {/* State status text */}
        <div className="z-10 mb-4">
          <h3 className="text-base font-bold text-white tracking-tight">
            {connecting
              ? 'Connecting Live Voice Session...'
              : status.isModelSpeaking
              ? 'Gemini Live is speaking...'
              : status.isListening
              ? 'Listening to you... Speak freely!'
              : 'Ready to converse'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {status.isModelSpeaking
              ? 'Direct low-latency 24kHz audio synthesis'
              : status.isListening
              ? `Real-time bidirectional 16kHz audio streaming for ${client.name}`
              : 'Bidirectional audio powered by Gemini 3.8 Live API'}
          </p>
        </div>

        {/* Error notification banner if any */}
        {status.error && (
          <div className="w-full p-3 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 mb-4 text-left z-10">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{status.error}</span>
          </div>
        )}

        {/* Suggested conversational prompts */}
        <div className="w-full space-y-1.5 mb-5 z-10 text-left">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
            Try saying:
          </span>
          <div className="space-y-1">
            {[
              `"Hey coach, should I upload my video right now or wait for 7 PM?"`,
              `"Why did my last video flop at the 18-second mark?"`,
              `"Give me 2 viral hooks for my upcoming AI hardware video."`
            ].map((prompt, i) => (
              <div
                key={i}
                className="text-[11px] p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 italic truncate"
              >
                {prompt}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="w-full flex items-center justify-center gap-3 z-10 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            End Conversation
          </button>
        </div>
      </div>
    </div>
  );
};
