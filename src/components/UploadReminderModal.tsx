import React, { useState, useEffect } from 'react';
import {
  Clock,
  Bell,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Volume2,
  X,
  Send,
  Zap
} from 'lucide-react';
import { CreatorClient, SocialPlatform } from '../types';

interface UploadReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: CreatorClient;
  onConfirmUpload: (videoTitle: string, platform: SocialPlatform) => void;
  targetDeadline: Date;
  onUpdateDeadline: (newDate: Date) => void;
}

export const UploadReminderModal: React.FC<UploadReminderModalProps> = ({
  isOpen,
  onClose,
  client,
  onConfirmUpload,
  targetDeadline,
  onUpdateDeadline
}) => {
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [urgency, setUrgency] = useState<'safe' | 'approaching' | 'urgent' | 'overdue'>('safe');
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const [reminderSoundEnabled, setReminderSoundEnabled] = useState(true);

  // Form states
  const [customHours, setCustomHours] = useState('2');
  const [uploadedTitle, setUploadedTitle] = useState('Local AI Agents Benchmark on $60 Hardware');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('youtube');
  const [celebrationSuccess, setCelebrationSuccess] = useState(false);

  // Check notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsGranted(Notification.permission === 'granted');
    }
  }, []);

  // Update countdown clock every second
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDeadline.getTime() - now;

      if (diff <= 0) {
        setUrgency('overdue');
        const overdueMinutes = Math.abs(Math.floor(diff / 60000));
        setTimeLeftStr(`Overdue by ${Math.floor(overdueMinutes / 60)}h ${overdueMinutes % 60}m`);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeftStr(
        `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
      );

      if (hours === 0 && minutes < 30) {
        setUrgency('urgent');
      } else if (hours < 2) {
        setUrgency('approaching');
      } else {
        setUrgency('safe');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDeadline]);

  if (!isOpen) return null;

  const requestBrowserNotification = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser notifications not supported.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotificationsGranted(true);
        new Notification('CreatorPilot Alert Active ⏰', {
          body: `Upload reminder set for ${client.name}. We will ping you before your 7:00 PM prime window!`,
          icon: '/favicon.ico'
        });
      }
    } catch (err) {
      console.warn('Notification permission error:', err);
    }
  };

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  const handleMarkUploaded = () => {
    if (reminderSoundEnabled) playChime();
    setCelebrationSuccess(true);
    onConfirmUpload(uploadedTitle, selectedPlatform);

    setTimeout(() => {
      setCelebrationSuccess(false);
      onClose();
    }, 1800);
  };

  const handleSetCustomTimer = (hoursToAdd: number) => {
    const newTarget = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000);
    onUpdateDeadline(newTarget);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              urgency === 'overdue' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
              urgency === 'urgent' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
              'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Upload Deadline & Notifications</h3>
              <p className="text-[11px] text-slate-400">Timely publishing protects algorithmic reach</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Countdown Display */}
        <div className={`my-4 p-4 rounded-2xl border text-center transition-all ${
          urgency === 'overdue' ? 'bg-rose-950/30 border-rose-500/40' :
          urgency === 'urgent' ? 'bg-amber-950/30 border-amber-500/40' :
          'bg-slate-950/80 border-slate-800'
        }`}>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            {urgency === 'overdue' ? '⚠️ Deadline Exceeded' : 'Remaining Publishing Window'}
          </span>
          <div className={`text-2xl font-mono font-bold tracking-tight tabular-nums ${
            urgency === 'overdue' ? 'text-rose-400' :
            urgency === 'urgent' ? 'text-amber-400 animate-pulse' :
            'text-emerald-400'
          }`}>
            {timeLeftStr}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Target: {client.bestPostingTime}
          </p>
        </div>

        {/* Notification Permission & Settings */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">Push Notifications</span>
            </div>
            {notificationsGranted ? (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Enabled
              </span>
            ) : (
              <button
                onClick={requestBrowserNotification}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
              >
                Enable Alerts
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Notification Audio Chime</span>
            </span>
            <input
              type="checkbox"
              checked={reminderSoundEnabled}
              onChange={e => setReminderSoundEnabled(e.target.checked)}
              className="accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Adjust Target Deadline Quick Buttons */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Reschedule Target Window:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '+1 Hour', val: 1 },
              { label: '+3 Hours', val: 3 },
              { label: 'Tomorrow', val: 24 }
            ].map(b => (
              <button
                key={b.val}
                onClick={() => handleSetCustomTimer(b.val)}
                className="py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mark as Uploaded Section */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/20 to-indigo-950/20 border border-emerald-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Video Published?</span>
            <span className="text-[10px] font-mono text-emerald-400">+1 Day Streak Boost</span>
          </div>

          <input
            type="text"
            value={uploadedTitle}
            onChange={e => setUploadedTitle(e.target.value)}
            placeholder="Published video title..."
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <button
            onClick={handleMarkUploaded}
            disabled={celebrationSuccess}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-emerald-600/20 min-h-[44px]"
          >
            {celebrationSuccess ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>Streak Protected! (+1 Day)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Uploaded & Reset Timer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
