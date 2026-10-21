import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Search,
  Bookmark,
  Users2,
  Handshake,
  Plus,
  Copy,
  Check,
  Sparkles,
  Tag,
  Mic,
  MicOff,
  Wand2,
  X,
  Radio,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import {
  CreatorClient,
  IdeaVaultItem,
  WeeklyScheduleItem,
  CompetitorBenchmarkItem,
  CollabCreatorItem,
  CommentSentimentData,
  SocialPlatform
} from '../../types';

interface GrowthLabTabProps {
  client: CreatorClient;
  ideas: IdeaVaultItem[];
  weeklySchedule: WeeklyScheduleItem[];
  competitors: CompetitorBenchmarkItem[];
  collabs: CollabCreatorItem[];
  sentiment: CommentSentimentData;
  onAddCustomIdea: (idea: Omit<IdeaVaultItem, 'id' | 'createdAt'>) => void;
  onAskCoachAboutCollab: (creatorName: string) => void;
}

export const GrowthLabTab: React.FC<GrowthLabTabProps> = ({
  client,
  ideas,
  weeklySchedule,
  competitors,
  collabs,
  sentiment,
  onAddCustomIdea,
  onAskCoachAboutCollab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'gap_finder' | 'idea_vault' | 'competitors' | 'collabs'>('schedule');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New idea form modal/toggle
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('youtube');
  const [newFormat, setNewFormat] = useState<IdeaVaultItem['format']>('Long-form');
  const [newNotes, setNewNotes] = useState('');

  // Voice Brain-Dump State
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [transcribeModelBadge, setTranscribeModelBadge] = useState<string>('gemini-3.5-transcribe');

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddCustomIdea({
      title: newTitle.trim(),
      niche: client.niche,
      format: newFormat,
      targetPlatform: newPlatform,
      predictedScore: Math.floor(Math.random() * 15) + 82, // 82-97
      tags: [client.primaryPlatform, 'GrowthIdea'],
      status: 'idea',
      notes: newNotes.trim() || 'Custom brainstormed concept'
    });

    setNewTitle('');
    setNewNotes('');
    setShowNewIdeaModal(false);
  };

  // Voice-to-Text Recording Handlers with MediaRecorder & SpeechRecognition
  const startRecording = () => {
    setVoiceTranscript('');
    setRecordingSeconds(0);
    setIsRecording(true);
    audioChunksRef.current = [];

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    // 1. Capture microphone audio for gemini-3.5-transcribe
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        try {
          const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
          mediaRecorderRef.current = recorder;
          recorder.start(200);
        } catch (recErr) {
          console.warn('MediaRecorder init fallback:', recErr);
        }
      }).catch((streamErr) => {
        console.warn('Microphone access:', streamErr);
      });
    }

    // 2. Initialize live client SpeechRecognition for instant UI feedback
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + ' ';
          }
          setVoiceTranscript(current.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition warning:', event.error);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
  };

  // Convert raw brain dump into a structured idea card with tags via gemini-3.5-transcribe
  const handleConvertAndSaveIdea = async (rawTextToConvert?: string) => {
    setIsConverting(true);
    stopRecording();

    let text = (rawTextToConvert || voiceTranscript).trim();

    // If we have recorded audio chunks, transcribe via server endpoint using gemini-3.5-transcribe
    if (!rawTextToConvert && audioChunksRef.current.length > 0) {
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1] || '');
          };
          reader.readAsDataURL(audioBlob);
        });

        const base64Audio = await base64Promise;
        if (base64Audio) {
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioData: base64Audio, mimeType: 'audio/webm' })
          });
          const json = await res.json();
          if (json.text) {
            text = json.text;
            setVoiceTranscript(json.text);
          }
        }
      } catch (err) {
        console.warn('Server gemini-3.5-transcribe fallback to local transcript:', err);
      }
    }

    if (!text) {
      setIsConverting(false);
      return;
    }

    setTimeout(() => {
      // Natural language parser & metadata extractor
      const lower = text.toLowerCase();

      // 1. Detect target platform
      let targetPlatform: SocialPlatform = client.primaryPlatform;
      if (lower.includes('youtube') || lower.includes('video') || lower.includes('long form')) {
        targetPlatform = 'youtube';
      } else if (lower.includes('instagram') || lower.includes('reel') || lower.includes('story')) {
        targetPlatform = 'instagram';
      } else if (lower.includes('tiktok') || lower.includes('sound') || lower.includes('tok')) {
        targetPlatform = 'tiktok';
      } else if (lower.includes('twitter') || lower.includes('x') || lower.includes('thread')) {
        targetPlatform = 'x';
      }

      // 2. Detect format
      let format: IdeaVaultItem['format'] = 'Long-form';
      if (lower.includes('short') || lower.includes('30s') || lower.includes('60s')) {
        format = 'Short';
      } else if (lower.includes('reel') || targetPlatform === 'instagram') {
        format = 'Reel';
      } else if (lower.includes('thread') || targetPlatform === 'x') {
        format = 'Thread';
      } else if (lower.includes('carousel')) {
        format = 'Carousel';
      }

      // 3. Generate high-converting Title
      let cleanTitle = text.replace(/^(i want to make a video about|let's do an idea about|hey coach|i think we should make|make a video on)/i, '').trim();
      if (cleanTitle.length > 70) {
        cleanTitle = cleanTitle.slice(0, 68) + '...';
      }
      // Capitalize first letter
      cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      if (!cleanTitle.includes('?') && !cleanTitle.includes(':') && cleanTitle.length < 50) {
        cleanTitle = `${cleanTitle} (Full Breakdown)`;
      }

      // 4. Extract smart tags
      const possibleTags = [
        'LocalAI', 'Hardware', 'Benchmark', 'DeepSeek', 'RaspberryPi',
        'Mobility', 'Recovery', 'Posture', 'Workout', 'Zone2',
        'ASMR', 'Focaccia', 'Baking', 'RecipeScience', 'Artisan',
        'TechReview', 'Productivity', 'ViralHook'
      ];
      const matchedTags = possibleTags.filter(tag => lower.includes(tag.toLowerCase()));
      if (matchedTags.length < 2) {
        matchedTags.push(client.primaryPlatform.toUpperCase(), 'GrowthIdea', 'BrainDump');
      }

      // 5. Structure notes & angles
      const structuredNotes = `🎙️ Voice Brain-Dump Transcript: "${text}"\n\n• Hook Angle: Lead with immediate high-stakes proof in first 3s\n• Target Audience: Core ${client.niche} followers\n• Action: Record raw B-roll and latency tests`;

      // 6. Save to Idea Vault
      const predictedScore = Math.floor(Math.random() * 8) + 89; // 89-96

      onAddCustomIdea({
        title: cleanTitle,
        niche: client.niche,
        format,
        targetPlatform,
        predictedScore,
        tags: matchedTags.slice(0, 4),
        status: 'idea',
        notes: structuredNotes
      });

      setIsConverting(false);
      setShowVoiceModal(false);
      setVoiceTranscript('');
      setActiveSubTab('idea_vault');

      // Trigger celebratory toast
      setToastNotification(`Voice idea converted into card: "${cleanTitle.slice(0, 32)}..." with ${matchedTags.length} tags!`);
      setTimeout(() => setToastNotification(null), 4000);
    }, 600);
  };

  // Preset sample voice prompts for quick testing or fallback
  const sampleVoicePrompts = [
    `I want to test DeepSeek R1 locally on a Mac Mini M4 versus RTX 4090 with latency benchmarks and thermal logs for YouTube.`,
    `Quick 45-second Instagram Reel showing 3 hip flexor stretches that fix anterior pelvic tilt for desk workers.`,
    `TikTok recipe idea: 72-hour cold fermented garlic confit focaccia with crisp ASMR sound cuts.`
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="p-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastNotification}</span>
          </div>
          <button onClick={() => setToastNotification(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Voice Brain-Dump Action Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowVoiceModal(true);
                startRecording();
              }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all active:scale-95 group shrink-0 min-h-[48px] min-w-[48px]"
              title="Record Voice Brain-Dump"
            >
              <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Voice Brain-Dump</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse" /> Mic API
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Speak raw thoughts; CreatorPilot converts them into structured idea cards with tags
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowVoiceModal(true);
              startRecording();
            }}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors shrink-0 whitespace-nowrap min-h-[40px]"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Record Idea</span>
          </button>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        {[
          { key: 'schedule', label: 'Weekly Plan', icon: Calendar },
          { key: 'gap_finder', label: 'Content Gaps', icon: Search },
          { key: 'idea_vault', label: 'Idea Vault', icon: Bookmark },
          { key: 'competitors', label: 'Competitors', icon: Users2 },
          { key: 'collabs', label: 'Collab Matcher', icon: Handshake }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActiveSubTab(item.key as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                activeSubTab === item.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Weekly Growth Plan */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-semibold text-white">Weekly Growth Plan Generator</h3>
                <p className="text-[11px] text-slate-400">Optimized for algorithm velocity & rest cycles</p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Auto-Scheduled
              </span>
            </div>

            <div className="space-y-2.5 mt-3">
              {weeklySchedule.map(slot => (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{slot.day}</span>
                      <span className="text-[11px] text-slate-400">· {slot.dateStr}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-400 uppercase">
                        {slot.platform}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">{slot.time}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{slot.titleConcept}</h4>
                    <p className="text-[11px] text-slate-400 italic mt-0.5">Hook: "{slot.hook}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Tag className="w-3 h-3 text-slate-500" />
                      <span>{slot.hashtags.join(' ')}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(`sched_${slot.id}`, `${slot.titleConcept}\nHook: ${slot.hook}\n${slot.hashtags.join(' ')}`)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 p-1"
                    >
                      {copiedId === `sched_${slot.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === `sched_${slot.id}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Content Gap Finder */}
      {activeSubTab === 'gap_finder' && (
        <div className="space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-semibold text-white">Content Gap Finder</h3>
                <p className="text-[11px] text-slate-400">High-demand audience questions unaddressed in past uploads</p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Audience Goldmines
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {sentiment.audienceRequestedTopics.map(gap => (
                <div
                  key={gap.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-white">{gap.topic}</h4>
                    <span className="text-xs font-mono font-bold text-indigo-400 tabular-nums shrink-0">
                      {gap.requestCount} Requests
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    {gap.sampleComment}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      gap.addressed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {gap.addressed ? 'Already Covered' : 'Unaddressed Content Gap'}
                    </span>

                    {!gap.addressed && (
                      <button
                        onClick={() => {
                          onAddCustomIdea({
                            title: gap.topic,
                            niche: client.niche,
                            format: 'Long-form',
                            targetPlatform: client.primaryPlatform,
                            predictedScore: 94,
                            tags: ['AudienceRequest', 'GapSolution'],
                            status: 'ready',
                            notes: `Direct response to ${gap.requestCount} comments: ${gap.sampleComment}`
                          });
                          setActiveSubTab('idea_vault');
                        }}
                        className="py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add to Vault</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Idea Vault */}
      {activeSubTab === 'idea_vault' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-white">Idea Vault</h3>
              <p className="text-[11px] text-slate-400">{ideas.length} concepts ranked by predicted score</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowVoiceModal(true);
                  startRecording();
                }}
                className="py-1.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice Dump</span>
              </button>

              <button
                onClick={() => setShowNewIdeaModal(true)}
                className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Idea</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {ideas.map(idea => (
              <div
                key={idea.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-semibold">
                        {idea.format}
                      </span>
                      <span className="text-[10px] uppercase font-mono text-slate-400">
                        {idea.targetPlatform}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[10px] text-slate-400 capitalize">{idea.status}</span>
                      {idea.notes.includes('🎙️ Voice') && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Voice Captured
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white">{idea.title}</h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                      {idea.predictedScore}/100
                    </span>
                    <span className="text-[9px] text-slate-500 block">Predicted Score</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{idea.notes}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {idea.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-500/20 px-2 py-0.5 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* New Idea Manual Modal */}
          {showNewIdeaModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
                <h4 className="text-sm font-bold text-white mb-3">Add Content Concept to Vault</h4>
                <form onSubmit={handleCreateIdea} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Video / Post Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g., I Replaced My Entire Studio With AI..."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Platform</label>
                      <select
                        value={newPlatform}
                        onChange={e => setNewPlatform(e.target.value as SocialPlatform)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="x">X</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Format</label>
                      <select
                        value={newFormat}
                        onChange={e => setNewFormat(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        <option value="Long-form">Long-form</option>
                        <option value="Short">Short</option>
                        <option value="Reel">Reel</option>
                        <option value="Carousel">Carousel</option>
                        <option value="Thread">Thread</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Concept Notes & Angles</label>
                    <textarea
                      rows={2}
                      value={newNotes}
                      onChange={e => setNewNotes(e.target.value)}
                      placeholder="Key hooks, visual props, guest, etc."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewIdeaModal(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
                    >
                      Save Concept
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Competitor Comparison */}
      {activeSubTab === 'competitors' && (
        <div className="space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xs font-semibold text-white mb-1">Similar-Sized Competitor Benchmarking</h3>
            <p className="text-[11px] text-slate-400 mb-3">Learn where your audience is migrating and exploit formatting gaps</p>

            <div className="space-y-3">
              {competitors.map(comp => (
                <div key={comp.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{comp.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{comp.handle}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-400 tabular-nums">
                      {(comp.followers / 1000).toFixed(0)}k Subs
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs p-2 rounded-lg bg-slate-900">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Frequency</span>
                      <span className="font-mono text-white font-semibold">{comp.uploadFreqPerWeek}/wk</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Avg Views</span>
                      <span className="font-mono text-white font-semibold">{(comp.avgViews / 1000).toFixed(0)}k</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Engagement</span>
                      <span className="font-mono text-emerald-400 font-semibold">{comp.engagementRate}%</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <div><span className="text-amber-400 font-semibold">Their Advantage: </span>{comp.advantageOverClient}</div>
                    <div><span className="text-emerald-400 font-semibold">Your Opportunity: </span>{comp.opportunityForClient}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Collab Matcher */}
      {activeSubTab === 'collabs' && (
        <div className="space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xs font-semibold text-white mb-1">AI Collab Matcher</h3>
            <p className="text-[11px] text-slate-400 mb-3">Vetted creators in adjacent niches for cross-pollination</p>

            <div className="space-y-3">
              {collabs.map(collab => (
                <div key={collab.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{collab.name}</h4>
                      <div className="text-[10px] text-slate-400 font-mono">{collab.handle} · {collab.niche}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                        {collab.matchScore}% Synergy
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300">
                    <span className="font-semibold text-indigo-400">Why collaborate: </span>
                    {collab.synergyReason}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                    <span className="font-semibold text-amber-400">Pitch Concept: </span>
                    "{collab.suggestedCollabIdea}"
                  </div>

                  <button
                    onClick={() => onAskCoachAboutCollab(collab.name)}
                    className="w-full py-1.5 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Generate DM Pitch Message with Coach</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Voice-to-Text Brain Dump Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isRecording ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-indigo-600/20 text-indigo-400'
                }`}>
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Voice Brain-Dump Recorder</span>
                    {isRecording && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                        LIVE REC {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      gemini-3.5-transcribe
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">Microphone speech transcribed via gemini-3.5-transcribe into structured cards</p>
                </div>
              </div>

              <button
                onClick={() => {
                  stopRecording();
                  setShowVoiceModal(false);
                }}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Waveform Visualizer */}
            {isRecording && (
              <div className="flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-950/80 rounded-2xl border border-rose-500/20">
                <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-6 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-8 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1.5 h-10 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '75ms' }} />
                <span className="w-1 h-6 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '225ms' }} />
                <span className="w-1.5 h-4 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '350ms' }} />
                <span className="w-1 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                <span className="text-xs font-mono text-rose-300 ml-2">Listening through microphone...</span>
              </div>
            )}

            {/* Live Transcript Display / Editable Area */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-semibold block">Spoken Transcript</label>
              <textarea
                rows={4}
                value={voiceTranscript}
                onChange={e => setVoiceTranscript(e.target.value)}
                placeholder={isRecording ? 'Start speaking into your mic... Words will stream in real-time.' : 'Speak using mic or type/paste your raw brain-dump here...'}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            {/* Quick Test Voice Prompts */}
            {!voiceTranscript && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Or Try Sample Spoken Prompt:</span>
                <div className="space-y-1">
                  {sampleVoicePrompts.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setVoiceTranscript(sample)}
                      className="w-full text-left p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 text-[11px] text-indigo-300 hover:text-white transition-colors truncate flex items-center gap-1.5"
                    >
                      <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">"{sample}"</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
              {isRecording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold flex items-center gap-2 transition-colors min-h-[44px]"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Pause Mic</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-colors min-h-[44px]"
                >
                  <Mic className="w-4 h-4 text-rose-400" />
                  <span>{voiceTranscript ? 'Resume Voice' : 'Start Mic'}</span>
                </button>
              )}

              <button
                type="button"
                disabled={!voiceTranscript.trim() || isConverting}
                onClick={() => handleConvertAndSaveIdea()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all min-h-[44px]"
              >
                {isConverting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Structuring Idea & Tags...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Convert to Structured Card</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
