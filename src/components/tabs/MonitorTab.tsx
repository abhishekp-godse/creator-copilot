import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  TrendingUp,
  AlertTriangle,
  Youtube,
  Instagram,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Target,
  BellRing,
  CheckCircle2,
  Calendar,
  Radio
} from 'lucide-react';
import { CreatorClient, SocialPlatform } from '../../types';
import { TabKey } from '../BottomTabBar';

interface MonitorTabProps {
  client: CreatorClient;
  onNavigate: (tab: TabKey) => void;
  onTriggerCoachPrompt: (prompt: string) => void;
  targetDeadline: Date;
  onOpenUploadReminder: () => void;
  onQuickUpload: () => void;
  onOpenLiveVoice: () => void;
}

export const MonitorTab: React.FC<MonitorTabProps> = ({
  client,
  onNavigate,
  onTriggerCoachPrompt,
  targetDeadline,
  onOpenUploadReminder,
  onQuickUpload,
  onOpenLiveVoice
}) => {
  const [countdownStr, setCountdownStr] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'safe' | 'approaching' | 'urgent' | 'overdue'>('safe');

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = targetDeadline.getTime() - now;

      if (diff <= 0) {
        setUrgencyLevel('overdue');
        const overdueMins = Math.abs(Math.floor(diff / 60000));
        setCountdownStr(`Overdue by ${Math.floor(overdueMins / 60)}h ${overdueMins % 60}m`);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdownStr(`${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`);

      if (hours === 0 && mins < 30) {
        setUrgencyLevel('urgent');
      } else if (hours < 2) {
        setUrgencyLevel('approaching');
      } else {
        setUrgencyLevel('safe');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDeadline]);

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-rose-500" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'tiktok':
        return (
          <span className="w-4 h-4 text-cyan-400 font-bold text-xs flex items-center justify-center">
            TT
          </span>
        );
      case 'x':
        return (
          <span className="w-4 h-4 text-slate-300 font-bold text-xs flex items-center justify-center">
            𝕏
          </span>
        );
    }
  };

  const uploadGapDays = (client.lastPostHoursAgo / 24).toFixed(1);
  const gapPercentage = Math.min(100, Math.round((client.lastPostHoursAgo / (client.uploadGapLimitDays * 24)) * 100));

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Proactive Upload Deadline & Reminder Banner */}
      <div className={`p-4 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        urgencyLevel === 'overdue' ? 'bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-900/30 border-rose-500/50' :
        urgencyLevel === 'urgent' ? 'bg-gradient-to-r from-amber-950/50 via-slate-900 to-orange-950/40 border-amber-500/50' :
        'bg-gradient-to-r from-indigo-950/50 via-slate-900 to-emerald-950/40 border-indigo-500/30'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              urgencyLevel === 'overdue' ? 'bg-rose-500/20 text-rose-400' :
              urgencyLevel === 'urgent' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
              'bg-emerald-500/20 text-emerald-400'
            }`}>
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Upload Reminder</h3>
                <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-semibold ${
                  urgencyLevel === 'overdue' ? 'bg-rose-500 text-white' :
                  urgencyLevel === 'urgent' ? 'bg-amber-500 text-black font-bold animate-pulse' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {urgencyLevel === 'overdue' ? 'Action Required' : urgencyLevel === 'urgent' ? 'Urgent Deadline' : 'On Track'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Audience activity peaks at {client.bestPostingTime}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block">Window Closes In</span>
            <div className={`text-base font-mono font-bold tabular-nums ${
              urgencyLevel === 'overdue' ? 'text-rose-400' :
              urgencyLevel === 'urgent' ? 'text-amber-400 animate-pulse' :
              'text-emerald-400'
            }`}>
              {countdownStr}
            </div>
          </div>
        </div>

        {/* Action buttons inside banner */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={onOpenUploadReminder}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Manage Notification & Timer</span>
          </button>

          <button
            onClick={onQuickUpload}
            className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-lg shadow-emerald-600/20 whitespace-nowrap"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Uploaded</span>
          </button>
        </div>
      </div>

      {/* 2. Top Hero: Real-time Presence Bar & Live API voice badge */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${client.avatarColor} text-white font-bold text-lg flex items-center justify-center shadow-lg`}>
              {client.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">{client.name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Real-time Active
                </span>
              </div>
              <p className="text-xs text-slate-400">{client.niche}</p>
            </div>
          </div>

          {/* 24h Velocity Pill */}
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">24h Velocity</span>
            <div className="flex items-center justify-end gap-1 text-emerald-400 font-mono text-sm font-bold tabular-nums">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{client.subscriberVelocity24h.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Live Voice API Quick Launcher */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="font-semibold text-white">Live Voice Coach (gemini-3.8-live)</span>
          </div>
          <button
            onClick={onOpenLiveVoice}
            className="py-1 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Talk Live</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* 4 Primary High-Density Numbers */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
          <div>
            <div className="text-xs text-slate-400">Total Audience</div>
            <div className="text-sm sm:text-base font-mono font-bold text-white tabular-nums mt-0.5">
              {(client.totalFollowers / 1000).toFixed(1)}k
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Avg Engagement</div>
            <div className="text-sm sm:text-base font-mono font-bold text-indigo-400 tabular-nums mt-0.5">
              {client.overallEngagementRate}%
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Avg Views</div>
            <div className="text-sm sm:text-base font-mono font-bold text-white tabular-nums mt-0.5">
              {(client.avgViewsPerPost / 1000).toFixed(0)}k
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Health Score</div>
            <div className="text-sm sm:text-base font-mono font-bold text-emerald-400 tabular-nums mt-0.5">
              {client.growthHealthScore.total}/100
            </div>
          </div>
        </div>
      </div>

      {/* Proactive Coaching Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Upload Gap Alert */}
        <div className={`p-4 rounded-2xl border transition-all ${
          gapPercentage >= 80
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
            : 'bg-slate-900 border-slate-800 text-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">Upload Gap Detector</span>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-bold tabular-nums">
              {uploadGapDays}d / {client.uploadGapLimitDays}d Limit
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                gapPercentage >= 85 ? 'bg-rose-500' : gapPercentage >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${gapPercentage}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {gapPercentage >= 80
              ? `You haven't posted in ${uploadGapDays} days. Audience retention drops significantly after day ${client.uploadGapLimitDays}.`
              : `Posting frequency is within optimal cadence. Next post advised in 24 hours.`}
          </p>

          <button
            onClick={() => onNavigate('growth_lab')}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Generate Schedule & Ideas</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Streak & Burnout Detector */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-semibold text-white">Streak & Consistency</span>
              </div>
              <span className="text-xs font-mono font-bold text-orange-400 tabular-nums">
                {client.currentStreakDays} Days 🔥
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400">Personal Best:</span>
              <span className="font-mono font-bold text-white">{client.bestStreakDays} Days</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Burnout Risk:</span>
              <span className={`capitalize font-semibold ${
                client.burnoutRisk === 'high' ? 'text-rose-400' : client.burnoutRisk === 'moderate' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {client.burnoutRisk}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              {client.burnoutMessage}
            </p>
          </div>

          <button
            onClick={() => onTriggerCoachPrompt('Analyze my burnout risk and suggest a light content schedule')}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium text-indigo-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Consult AI Coach on Pacing</span>
          </button>
        </div>
      </div>

      {/* Growth Health Score Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-white">Growth Health Score (0-100)</h3>
          </div>
          <span className="text-xs text-slate-400">Combined Algorithmic Index</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Consistency (30%)</div>
            <div className="text-base font-mono font-bold text-white tabular-nums mt-1">
              {client.growthHealthScore.consistency}/100
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div
                className="bg-indigo-500 h-1.5 rounded-full"
                style={{ width: `${client.growthHealthScore.consistency}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Engagement (35%)</div>
            <div className="text-base font-mono font-bold text-emerald-400 tabular-nums mt-1">
              {client.growthHealthScore.engagement}/100
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${client.growthHealthScore.engagement}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Trend Fit (35%)</div>
            <div className="text-base font-mono font-bold text-amber-400 tabular-nums mt-1">
              {client.growthHealthScore.trendAlignment}/100
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div
                className="bg-amber-500 h-1.5 rounded-full"
                style={{ width: `${client.growthHealthScore.trendAlignment}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Platform Real-time Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-white">Connected Platforms (Real-Time APIs)</h3>
          <span className="text-[11px] text-slate-400">4 Accounts Monitored</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(client.platforms) as SocialPlatform[]).map(key => {
            const platform = client.platforms[key];
            return (
              <div
                key={key}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(key)}
                    <div>
                      <div className="text-xs font-semibold text-white capitalize">{key}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{platform.handle}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    platform.connected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {platform.connected ? 'Connected' : 'Offline'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/60 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Followers</span>
                    <span className="text-xs font-mono font-bold text-white tabular-nums">
                      {(platform.followers / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">30d Views</span>
                    <span className="text-xs font-mono font-bold text-slate-300 tabular-nums">
                      {(platform.views30d / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Engagement</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                      {platform.engagementRate}%
                    </span>
                  </div>
                </div>

                {/* Top content preview */}
                <div className="mt-2.5 p-2 rounded-xl bg-slate-950/60 text-[11px] text-slate-300 flex items-center justify-between">
                  <span className="truncate pr-2">🏆 {platform.topPost.title}</span>
                  <span className="text-indigo-400 font-mono font-semibold shrink-0">
                    {(platform.topPost.views / 1000).toFixed(0)}k views
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monetization Readiness Tracker */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/20 border border-emerald-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-white">Monetization & Milestone Tracker</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
            ${client.monetization.estimatedMonthlyRevenue.toLocaleString()} / mo Est.
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Subscriber Milestone Progress</span>
              <span className="font-mono text-white tabular-nums">
                {client.monetization.currentSubs.toLocaleString()} / {client.monetization.goalSubs.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (client.monetization.currentSubs / client.monetization.goalSubs) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Watch Time Progress (Annualized)</span>
              <span className="font-mono text-white tabular-nums">
                {client.monetization.currentWatchHours.toLocaleString()} / {client.monetization.goalWatchHours.toLocaleString()} hrs
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (client.monetization.currentWatchHours / client.monetization.goalWatchHours) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Target: {client.monetization.nextMilestone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
