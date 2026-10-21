export type SocialPlatform = 'youtube' | 'instagram' | 'tiktok' | 'x';

export interface PlatformMetricDetail {
  platform: SocialPlatform;
  handle: string;
  followers: number;
  followerGrowth7d: number;
  views30d: number;
  engagementRate: number;
  postsThisMonth: number;
  connected: boolean;
  liveStatus: 'synced' | 'updating' | 'action_required';
  topPost: {
    title: string;
    views: number;
    engagement: number;
    postedAgo: string;
  };
}

export interface CreatorClient {
  id: string;
  name: string;
  handle: string;
  role: string;
  niche: string;
  avatarColor: string;
  primaryPlatform: SocialPlatform;
  totalFollowers: number;
  subscriberVelocity24h: number;
  overallEngagementRate: number;
  avgViewsPerPost: number;
  lastPostHoursAgo: number;
  uploadGapLimitDays: number;
  currentStreakDays: number;
  bestStreakDays: number;
  streakAtRisk: boolean;
  burnoutRisk: 'low' | 'moderate' | 'high';
  burnoutMessage: string;
  bestPostingTime: string;
  growthHealthScore: {
    total: number;
    consistency: number;
    engagement: number;
    trendAlignment: number;
  };
  monetization: {
    status: 'partner_ready' | 'monetized' | 'tier2';
    currentWatchHours: number;
    goalWatchHours: number;
    currentSubs: number;
    goalSubs: number;
    estimatedMonthlyRevenue: number;
    nextMilestone: string;
  };
  platforms: Record<SocialPlatform, PlatformMetricDetail>;
}

export interface TrendItem {
  id: string;
  topic: string;
  category: string;
  platform: SocialPlatform;
  trendFitScore: number;
  fitReason: string;
  expiryHoursRemaining: number;
  velocity: 'exploding' | 'surging' | 'steady';
  recommendedHook: string;
  targetHashtags: string[];
  viralSound?: string;
  estimatedReachMultiplier: string;
}

export interface RetentionPoint {
  second: number;
  timestamp: string;
  retentionPct: number;
  eventNote?: string;
  issue?: string;
  suggestion?: string;
}

export interface RetentionAnalysisData {
  videoTitle: string;
  durationSeconds: number;
  hookStrengthScore: number;
  averageViewDuration: string;
  avgRetentionPct: number;
  criticalDropOffSecond: number;
  primaryDropReason: string;
  coachFixAdvice: string;
  points: RetentionPoint[];
}

export interface CommentSentimentData {
  totalAnalyzed: number;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  keyPraises: string[];
  keyComplaints: string[];
  audienceRequestedTopics: {
    id: string;
    topic: string;
    requestCount: number;
    sampleComment: string;
    addressed: boolean;
  }[];
  sentimentKeywords: {
    word: string;
    type: 'positive' | 'negative' | 'neutral';
    frequency: number;
  }[];
}

export interface GrowthPredictionData {
  currentFollowers: number;
  predicted30d: number;
  lowerBound30d: number;
  upperBound30d: number;
  confidenceScore: number;
  modelType: string;
  historical: { day: string; count: number }[];
  forecast: { day: string; count: number; lower: number; upper: number }[];
  keyGrowthDrivers: string[];
}

export interface TitleScorerResult {
  title: string;
  score: number;
  ctrPotential: string;
  emotionalTriggerScore: number;
  keywordScore: number;
  clarityScore: number;
  curiosityGapScore: number;
  critique: string;
  improvedVariants: string[];
}

export interface IdeaVaultItem {
  id: string;
  title: string;
  niche: string;
  format: 'Short' | 'Long-form' | 'Reel' | 'Carousel' | 'Thread';
  targetPlatform: SocialPlatform;
  predictedScore: number;
  tags: string[];
  status: 'idea' | 'scripting' | 'ready' | 'recorded';
  notes: string;
  createdAt: string;
}

export interface WeeklyScheduleItem {
  id: string;
  day: string;
  dateStr: string;
  time: string;
  platform: SocialPlatform;
  format: string;
  titleConcept: string;
  hook: string;
  hashtags: string[];
  status: 'scheduled' | 'draft' | 'posted';
}

export interface CompetitorBenchmarkItem {
  id: string;
  name: string;
  handle: string;
  followers: number;
  uploadFreqPerWeek: number;
  avgViews: number;
  engagementRate: number;
  topFormat: string;
  advantageOverClient: string;
  opportunityForClient: string;
}

export interface CollabCreatorItem {
  id: string;
  name: string;
  handle: string;
  platform: SocialPlatform;
  followers: number;
  niche: string;
  matchScore: number;
  synergyReason: string;
  suggestedCollabIdea: string;
}

export interface ProactiveAlert {
  id: string;
  clientId: string;
  type: 'upload_gap' | 'best_time' | 'streak_risk' | 'burnout_warning' | 'trend_alert' | 'retention_drop';
  title: string;
  message: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'info';
  read: boolean;
  actionText?: string;
  actionTarget?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  metricsContext?: string;
}

export interface PlatformRPMDetail {
  platform: SocialPlatform;
  rpm: number;
  cpmAverage: number;
  estimatedMonthlyEarnings: number;
  monthlyMonetizedViews: number;
  topEarningCategory: string;
  monthOverMonthGrowthPct: number;
  payoutStatus: 'scheduled' | 'processing' | 'paid';
  nextPayoutDate: string;
}

export interface CreatorRevenueMetrics {
  totalEstimatedMonthly: number;
  averageBlendedRPM: number;
  totalMonetizedViews30d: number;
  payoutCurrency: string;
  historicalEarnings: { month: string; amount: number }[];
  platformBreakdown: Record<SocialPlatform, PlatformRPMDetail>;
  revenueStreams: {
    name: string;
    sharePct: number;
    amount: number;
    color: string;
  }[];
  monetizationTips: string[];
}

