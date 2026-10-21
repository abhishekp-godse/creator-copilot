import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  Smile,
  Frown,
  TrendingUp,
  AlertOctagon,
  ChevronRight,
  RotateCw,
  DollarSign,
  Youtube,
  Instagram,
  ArrowUpRight,
  Sliders,
  CalendarCheck2,
  PieChart,
  HelpCircle
} from 'lucide-react';
import {
  CreatorClient,
  RetentionAnalysisData,
  CommentSentimentData,
  GrowthPredictionData,
  TitleScorerResult,
  CreatorRevenueMetrics,
  SocialPlatform
} from '../../types';

interface AnalyticsTabProps {
  client: CreatorClient;
  retention: RetentionAnalysisData;
  sentiment: CommentSentimentData;
  prediction: GrowthPredictionData;
  revenue: CreatorRevenueMetrics;
  onAskCoachAboutDropOff: () => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  client,
  retention,
  sentiment,
  prediction,
  revenue,
  onAskCoachAboutDropOff
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'earnings' | 'dropoff' | 'title_scorer' | 'sentiment' | 'forecast'>('earnings');

  // Title Scorer interactive state
  const [testTitle, setTestTitle] = useState('I Tested DeepSeek R1 on a $60 Hardware Board');
  const [scorerResult, setScorerResult] = useState<TitleScorerResult | null>({
    title: 'I Tested DeepSeek R1 on a $60 Hardware Board',
    score: 87,
    ctrPotential: 'High (7.8% - 9.2% Predicted CTR)',
    emotionalTriggerScore: 84,
    keywordScore: 92,
    clarityScore: 88,
    curiosityGapScore: 85,
    critique: 'Strong price contrast ($60) and trending keyword (DeepSeek R1). The word "Tested" is slightly passive.',
    improvedVariants: [
      'I Ran DeepSeek R1 on a $60 Raspberry Pi (Does it Melt?)',
      'Don\'t Buy a $2,000 GPU: DeepSeek R1 on $60 Hardware',
      'I Replaced My Cloud AI With This $60 Local Board'
    ]
  });
  const [isScoring, setIsScoring] = useState(false);

  // RPM Calculator interactive simulator state
  const [calcMonthlyViews, setCalcMonthlyViews] = useState<number>(Math.round(revenue.totalMonetizedViews30d / 1000));
  const [calcRPM, setCalcRPM] = useState<number>(revenue.averageBlendedRPM);
  const [showRpmTooltip, setShowRpmTooltip] = useState(false);

  const calculatedMonthlyRevenue = Math.round((calcMonthlyViews * 1000 / 1000) * calcRPM);
  const calculatedAnnualRevenue = calculatedMonthlyRevenue * 12;

  const handleScoreTitle = (titleToScore: string) => {
    setIsScoring(true);
    setTimeout(() => {
      const length = titleToScore.trim().length;
      const hasNumber = /\d/.test(titleToScore);
      const hasBrackets = /[\(\[\{]/.test(titleToScore);
      const isShort = length > 25 && length < 65;

      const baseScore = 65 + (hasNumber ? 12 : 0) + (hasBrackets ? 8 : 0) + (isShort ? 10 : 0);
      const finalScore = Math.min(97, Math.max(52, baseScore));

      setScorerResult({
        title: titleToScore,
        score: finalScore,
        ctrPotential: finalScore > 80 ? 'High (8.0% - 10.4% CTR)' : 'Moderate (4.5% - 6.8% CTR)',
        emotionalTriggerScore: Math.round(finalScore * 0.95),
        keywordScore: Math.round(finalScore * 0.98),
        clarityScore: Math.round(finalScore * 0.92),
        curiosityGapScore: Math.round(finalScore * 0.94),
        critique: finalScore > 80
          ? 'Exceptional tension and high-interest mobile hook. Numbers and concrete constraints will stand out in notifications.'
          : 'Title is informative but lacks high-stakes curiosity or contrast. Add an extreme price, time constraint, or emotional payoff.',
        improvedVariants: [
          `What Happens When You ${titleToScore.slice(0, 35)}?`,
          `I Spent 48 Hours with ${titleToScore.slice(0, 30)} (Shocking Result)`,
          `Stop Doing This: ${titleToScore.slice(0, 35)}`
        ]
      });
      setIsScoring(false);
    }, 450);
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-rose-500" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'tiktok':
        return <span className="w-4 h-4 text-cyan-400 font-bold text-xs flex items-center justify-center">TT</span>;
      case 'x':
        return <span className="w-4 h-4 text-slate-300 font-bold text-xs flex items-center justify-center">𝕏</span>;
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Sub-navigation tabs with Revenue & RPM */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        {[
          { key: 'earnings', label: 'Revenue & RPM', isHero: true },
          { key: 'dropoff', label: 'Drop-off Retention' },
          { key: 'title_scorer', label: 'Title & Hook Scorer' },
          { key: 'sentiment', label: 'Comment Sentiment' },
          { key: 'forecast', label: '30-Day Growth ML' }
        ].map(sub => (
          <button
            key={sub.key}
            onClick={() => setActiveSubTab(sub.key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] flex items-center gap-1.5 ${
              activeSubTab === sub.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {sub.key === 'earnings' && <DollarSign className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{sub.label}</span>
          </button>
        ))}
      </div>

      {/* 1. NEW: Revenue & RPM Multi-Platform Analytics View */}
      {activeSubTab === 'earnings' && (
        <div className="space-y-4">
          {/* Top Revenue Summary Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Estimated Monthly Earnings</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Cross-platform monetization</span>
                    <button
                      onClick={() => setShowRpmTooltip(!showRpmTooltip)}
                      className="text-slate-500 hover:text-slate-300"
                      title="What is RPM?"
                    >
                      <HelpCircle className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center justify-end gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +14.2% MoM
                </span>
                <span className="text-xl font-mono font-bold text-white tabular-nums">
                  ${revenue.totalEstimatedMonthly.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Explanation banner if clicked */}
            {showRpmTooltip && (
              <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed mb-3">
                <span className="font-semibold text-emerald-400">RPM (Revenue Per Mille): </span>
                Earnings generated per 1,000 monetized impressions after platform revenue splits. Unlike CPM (advertiser spend), RPM represents creator take-home pay.
              </div>
            )}

            {/* 3 High-Density Metric Pillars */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center">
              <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
                <span className="text-[10px] text-slate-400 block">Blended RPM</span>
                <span className="text-sm font-mono font-bold text-emerald-400 tabular-nums">
                  ${revenue.averageBlendedRPM.toFixed(2)}
                </span>
                <span className="text-[9px] text-slate-500 block">/ 1,000 views</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
                <span className="text-[10px] text-slate-400 block">Monetized Views</span>
                <span className="text-sm font-mono font-bold text-white tabular-nums">
                  {(revenue.totalMonetizedViews30d / 1000000).toFixed(2)}M
                </span>
                <span className="text-[9px] text-slate-500 block">Last 30 days</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
                <span className="text-[10px] text-slate-400 block">Next Payout</span>
                <span className="text-sm font-mono font-semibold text-indigo-400 tabular-nums">
                  Nov 21
                </span>
                <span className="text-[9px] text-emerald-400 block">Scheduled</span>
              </div>
            </div>
          </div>

          {/* Platform RPM & Earnings Grid */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-semibold text-white">Platform RPM & Revenue Breakdown</h4>
              <span className="text-[11px] text-slate-400 font-mono">4 Accounts Linked</span>
            </div>

            <div className="space-y-3">
              {(Object.keys(revenue.platformBreakdown) as SocialPlatform[]).map(platformKey => {
                const detail = revenue.platformBreakdown[platformKey];
                return (
                  <div
                    key={platformKey}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                          {getPlatformIcon(platformKey)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white capitalize">{platformKey}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              RPM ${detail.rpm.toFixed(2)}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 truncate block max-w-[200px]">
                            {detail.topEarningCategory}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-mono font-bold text-white tabular-nums">
                          ${detail.estimatedMonthlyEarnings.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500 block">/ month est.</span>
                      </div>
                    </div>

                    {/* Stats strip */}
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Avg CPM</span>
                        <span className="font-mono text-slate-300 font-semibold tabular-nums">
                          ${detail.cpmAverage.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Monetized Views</span>
                        <span className="font-mono text-slate-300 font-semibold tabular-nums">
                          {(detail.monthlyMonetizedViews / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">MoM Growth</span>
                        <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                          +{detail.monthOverMonthGrowthPct}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/40 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarCheck2 className="w-3 h-3 text-slate-500" />
                        <span>Payout: {detail.nextPayoutDate}</span>
                      </span>
                      <span className={`capitalize font-mono ${
                        detail.payoutStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        ● {detail.payoutStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue Stream Diversification Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-semibold text-white">Revenue Stream Diversification</h4>
              </div>
              <span className="text-[11px] text-slate-400">4 Income Streams</span>
            </div>

            {/* Segmented multi-color progress bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800 my-2">
              {revenue.revenueStreams.map((stream, idx) => (
                <div
                  key={idx}
                  style={{ width: `${stream.sharePct}%` }}
                  className={`${stream.color} h-full`}
                  title={`${stream.name}: ${stream.sharePct}%`}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {revenue.revenueStreams.map((stream, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full ${stream.color}`} />
                    <span className="text-slate-300 font-medium truncate">{stream.name}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-400">{stream.sharePct}%</span>
                    <span className="font-bold text-white tabular-nums">${stream.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Month Revenue Trend Visualizer */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-semibold text-white">5-Month Earnings Growth Trajectory</h4>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">+37.5% Since Jun</span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center items-end h-28 pt-4 pb-1">
              {revenue.historicalEarnings.map((item, idx) => {
                const maxAmount = 10000;
                const heightPct = Math.round((item.amount / maxAmount) * 100);
                const isCurrent = idx === revenue.historicalEarnings.length - 1;

                return (
                  <div key={item.month} className="flex flex-col items-center justify-end h-full">
                    <span className="text-[10px] font-mono text-slate-300 tabular-nums mb-1 font-semibold">
                      ${(item.amount / 1000).toFixed(1)}k
                    </span>
                    <div className="w-full bg-slate-800 rounded-t-lg h-full flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isCurrent ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' : 'bg-indigo-600/70'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-1.5">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive RPM & Earnings Simulator */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-semibold text-white">Interactive RPM & Earnings Simulator</h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                Calculator
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Model your income if you negotiate sponsorships or increase upload velocity:
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Monthly Monetized Views:</span>
                  <span className="font-mono text-white font-bold">{calcMonthlyViews.toLocaleString()}k views</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={calcMonthlyViews}
                  onChange={e => setCalcMonthlyViews(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Target Blended RPM:</span>
                  <span className="font-mono text-emerald-400 font-bold">${calcRPM.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="12.0"
                  step="0.25"
                  value={calcRPM}
                  onChange={e => setCalcRPM(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-2 text-center mt-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">Simulated Monthly</span>
                  <span className="text-base font-mono font-bold text-emerald-400 tabular-nums">
                    ${calculatedMonthlyRevenue.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Simulated Annualized</span>
                  <span className="text-base font-mono font-bold text-white tabular-nums">
                    ${calculatedAnnualRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Coach RPM Optimization Tips */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Coach RPM Optimization Action Plan:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {revenue.monetizationTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">→</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 2. Video Drop-Off Retention Analysis */}
      {activeSubTab === 'dropoff' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  Latest Video Retention Curve
                </span>
                <h3 className="text-sm font-bold text-white mt-1">{retention.videoTitle}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Hook Strength</span>
                <span className="text-sm font-mono font-bold text-emerald-400 tabular-nums">
                  {retention.hookStrengthScore}/100
                </span>
              </div>
            </div>

            {/* Retention SVG Graph */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 mb-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span>Audience Retention (%)</span>
                <span className="text-amber-400 font-mono">Critical Cliff: 0:{retention.criticalDropOffSecond}</span>
              </div>

              <div className="h-44 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 320 120" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="320" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="320" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="320" y2="100" stroke="#1e293b" strokeDasharray="3 3" />

                  {/* Shaded area */}
                  <path
                    d={`M 0,0 L 20,${120 - 91 * 1.2} L 45,${120 - 76 * 1.2} L 100,${120 - 72 * 1.2} L 160,${120 - 68 * 1.2} L 220,${120 - 58 * 1.2} L 280,${120 - 52 * 1.2} L 320,${120 - 38 * 1.2} L 320,120 L 0,120 Z`}
                    fill="url(#retentionGradient)"
                    opacity="0.25"
                  />
                  <defs>
                    <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Retention line */}
                  <path
                    d={`M 0,0 L 20,${120 - 91 * 1.2} L 45,${120 - 76 * 1.2} L 100,${120 - 72 * 1.2} L 160,${120 - 68 * 1.2} L 220,${120 - 58 * 1.2} L 280,${120 - 52 * 1.2} L 320,${120 - 38 * 1.2}`}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                  />

                  {/* Marker for critical drop at second 18 */}
                  <circle cx="45" cy={120 - 76 * 1.2} r="4" fill="#f43f5e" />
                  <line x1="45" y1="0" x2="45" y2="120" stroke="#f43f5e" strokeDasharray="2 2" />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0:00 (100%)</span>
                <span className="text-rose-400">0:18 (-15% Cliff)</span>
                <span>6:00 (58%)</span>
                <span>12:20 (38%)</span>
              </div>
            </div>

            {/* Critical drop reason & AI coach recommendation */}
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 mb-3">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold mb-1">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Critical Drop-off at 0:{retention.criticalDropOffSecond}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                {retention.primaryDropReason}
              </p>
              <div className="p-2.5 rounded-lg bg-black/40 border border-rose-500/20 text-xs text-rose-200">
                <span className="font-bold text-white">AI Coach Recommendation: </span>
                {retention.coachFixAdvice}
              </div>
            </div>

            <button
              onClick={onAskCoachAboutDropOff}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Coach to Rewrite Opening 15 Seconds</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Title & Thumbnail Scorer */}
      {activeSubTab === 'title_scorer' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-semibold text-white">Title & Click Potential Predictor</h3>
              </div>
              <span className="text-[11px] text-slate-400">ML Click Prediction Model</span>
            </div>

            {/* Input Box */}
            <div className="space-y-2 mb-3">
              <textarea
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                rows={2}
                placeholder="Enter candidate title to score..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={() => handleScoreTitle(testTitle)}
                disabled={isScoring || !testTitle.trim()}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
              >
                {isScoring ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isScoring ? 'Analyzing Click Signals...' : 'Score Title Potential'}</span>
              </button>
            </div>

            {/* Score Result Card */}
            {scorerResult && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-400">Predictive Click Potential</span>
                    <div className="text-sm font-semibold text-indigo-400">{scorerResult.ctrPotential}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                      {scorerResult.score}/100
                    </span>
                  </div>
                </div>

                {/* Breakdown metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Emotional Trigger</span>
                    <span className="font-mono text-white font-bold">{scorerResult.emotionalTriggerScore}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Curiosity Gap</span>
                    <span className="font-mono text-white font-bold">{scorerResult.curiosityGapScore}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Keyword Pull</span>
                    <span className="font-mono text-white font-bold">{scorerResult.keywordScore}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Mobile Clarity</span>
                    <span className="font-mono text-white font-bold">{scorerResult.clarityScore}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {scorerResult.critique}
                </p>

                {/* AI Improved Title Variations */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                    High-Converting Title Variations (1-Click Apply)
                  </div>
                  <div className="space-y-1.5">
                    {scorerResult.improvedVariants.map((variant, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setTestTitle(variant);
                          handleScoreTitle(variant);
                        }}
                        className="w-full p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left text-xs text-indigo-300 hover:text-white flex items-center justify-between group transition-colors"
                      >
                        <span className="truncate">{variant}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Sentiment Analysis of Comments */}
      {activeSubTab === 'sentiment' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-semibold text-white">Comment Sentiment Engine</h3>
                <p className="text-[11px] text-slate-400">{sentiment.totalAnalyzed.toLocaleString()} recent comments analyzed</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                {sentiment.positivePct}% Positive
              </span>
            </div>

            {/* Sentiment split bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800 mb-3">
              <div style={{ width: `${sentiment.positivePct}%` }} className="bg-emerald-500 h-full" title="Positive" />
              <div style={{ width: `${sentiment.neutralPct}%` }} className="bg-slate-500 h-full" title="Neutral" />
              <div style={{ width: `${sentiment.negativePct}%` }} className="bg-rose-500 h-full" title="Negative" />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
              <span className="flex items-center gap-1 text-emerald-400">
                <Smile className="w-3.5 h-3.5" /> {sentiment.positivePct}% Positive
              </span>
              <span>{sentiment.neutralPct}% Neutral</span>
              <span className="flex items-center gap-1 text-rose-400">
                <Frown className="w-3.5 h-3.5" /> {sentiment.negativePct}% Negative
              </span>
            </div>

            {/* What audience loves */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-semibold text-emerald-400 mb-1.5">What the Audience Loves:</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {sentiment.keyPraises.map((praise, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{praise}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What audience wants fixed */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-semibold text-rose-400 mb-1.5">Audience Pain Points:</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {sentiment.keyComplaints.map((complaint, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400">✗</span>
                      <span>{complaint}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keyword frequency cloud */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Top Sentiment Keywords</div>
                <div className="flex flex-wrap gap-1.5">
                  {sentiment.sentimentKeywords.map(item => (
                    <span
                      key={item.word}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-mono ${
                        item.type === 'positive'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : item.type === 'negative'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.word} ({item.frequency})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. 30-Day Growth Forecast ML */}
      {activeSubTab === 'forecast' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-semibold text-white">30-Day Growth Prediction Model</h3>
                <p className="text-[11px] text-slate-400">{prediction.modelType}</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                {prediction.confidenceScore}% Confidence
              </span>
            </div>

            {/* Projection Summary Card */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 mb-3 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">Current Followers</span>
                <span className="text-base font-mono font-bold text-white tabular-nums">
                  {prediction.currentFollowers.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">30-Day Forecast Target</span>
                <span className="text-base font-mono font-bold text-emerald-400 tabular-nums">
                  +{ (prediction.predicted30d - prediction.currentFollowers).toLocaleString() }
                </span>
              </div>
            </div>

            {/* Forecast Range */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span>Expected Range:</span>
                <span className="font-mono text-white">
                  {(prediction.lowerBound30d / 1000).toFixed(1)}k — {(prediction.upperBound30d / 1000).toFixed(1)}k
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-3/4 rounded-full" />
              </div>
            </div>

            {/* Key Growth Drivers */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-white">Key Algorithmic Drivers:</div>
              {prediction.keyGrowthDrivers.map((driver, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
