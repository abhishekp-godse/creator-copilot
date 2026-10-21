import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Sparkles,
  Copy,
  Check,
  PlusCircle,
  TrendingUp,
  Music2,
  BookmarkCheck
} from 'lucide-react';
import { CreatorClient, TrendItem, SocialPlatform } from '../../types';
import { TabKey } from '../BottomTabBar';

interface TrendsTabProps {
  client: CreatorClient;
  trends: TrendItem[];
  onAddToVault: (trend: TrendItem) => void;
  onAskCoachAboutTrend: (trend: TrendItem) => void;
  onNavigate: (tab: TabKey) => void;
}

export const TrendsTab: React.FC<TrendsTabProps> = ({
  client,
  trends,
  onAddToVault,
  onAskCoachAboutTrend,
  onNavigate
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedTrendIds, setSavedTrendIds] = useState<Set<string>>(new Set());

  const filteredTrends = trends.filter(trend => {
    if (selectedPlatform === 'all') return true;
    return trend.platform === selectedPlatform;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToVault = (trend: TrendItem) => {
    onAddToVault(trend);
    setSavedTrendIds(prev => new Set(prev).add(trend.id));
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Engine Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Trend Intelligence Engine</h2>
              <p className="text-xs text-slate-400">
                Grounded in {client.niche} audience signals
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            {trends.length} Hot Waves
          </span>
        </div>
      </div>

      {/* Segmented Platform Filter */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
        {(['all', 'youtube', 'instagram', 'tiktok'] as const).map(plat => (
          <button
            key={plat}
            onClick={() => setSelectedPlatform(plat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap shrink-0 min-h-[36px] ${
              selectedPlatform === plat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {plat === 'all' ? 'All Platforms' : plat}
          </button>
        ))}
      </div>

      {/* Trends List */}
      <div className="space-y-3.5">
        {filteredTrends.map(trend => {
          const isSaved = savedTrendIds.has(trend.id);

          return (
            <div
              key={trend.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
            >
              {/* Header info */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {trend.platform}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400">{trend.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{trend.topic}</h3>
                </div>

                {/* Trend Fit Score Badge */}
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1 text-emerald-400 font-mono font-bold text-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{trend.trendFitScore}% Fit</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Audience affinity</span>
                </div>
              </div>

              {/* Fit reason */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed mb-3">
                <span className="font-semibold text-indigo-400">Why it matches: </span>
                {trend.fitReason}
              </div>

              {/* Expiry Timer & Velocity Row */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">Expiry Window</span>
                    <span className="font-mono text-amber-400 font-semibold">
                      {trend.expiryHoursRemaining} Hours Left
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">Velocity & Reach</span>
                    <span className="font-mono text-white capitalize font-semibold">
                      {trend.velocity} ({trend.estimatedReachMultiplier})
                    </span>
                  </div>
                </div>
              </div>

              {/* Viral Sound if present */}
              {trend.viralSound && (
                <div className="flex items-center gap-2 mb-3 text-xs text-purple-300 bg-purple-950/20 border border-purple-500/20 px-3 py-1.5 rounded-xl">
                  <Music2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">Audio Track: {trend.viralSound}</span>
                </div>
              )}

              {/* Recommended Hook */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Recommended Hook Script</span>
                  <button
                    onClick={() => handleCopy(`hook_${trend.id}`, trend.recommendedHook)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {copiedId === `hook_${trend.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === `hook_${trend.id}` ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs italic text-slate-200">
                  {trend.recommendedHook}
                </div>
              </div>

              {/* Hashtags */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {trend.targetHashtags.map(tag => (
                    <span key={tag} className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleCopy(`tags_${trend.id}`, trend.targetHashtags.join(' '))}
                  className="text-[11px] text-slate-400 hover:text-white shrink-0 p-1"
                  title="Copy hashtags"
                >
                  {copiedId === `tags_${trend.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Actions Bottom Bar */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleSaveToVault(trend)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isSaved
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Saved in Idea Vault' : 'Save to Idea Vault'}</span>
                </button>

                <button
                  onClick={() => onAskCoachAboutTrend(trend)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Draft Script</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
