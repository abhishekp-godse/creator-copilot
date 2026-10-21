import {
  CreatorClient,
  TrendItem,
  RetentionAnalysisData,
  CommentSentimentData,
  GrowthPredictionData,
  IdeaVaultItem,
  WeeklyScheduleItem,
  CompetitorBenchmarkItem,
  CollabCreatorItem,
  ProactiveAlert,
  CreatorRevenueMetrics
} from '../types';

export const INITIAL_CLIENTS: CreatorClient[] = [
  {
    id: 'client_sarah',
    name: 'Sarah Chen',
    handle: '@sarahchentech',
    role: 'Lead Creator',
    niche: 'AI Tools & Hardware Engineering',
    avatarColor: 'from-cyan-500 to-blue-600',
    primaryPlatform: 'youtube',
    totalFollowers: 384200,
    subscriberVelocity24h: 1240,
    overallEngagementRate: 6.8,
    avgViewsPerPost: 84500,
    lastPostHoursAgo: 142, // ~5.9 days ago (nearing 7 day drop-off threshold)
    uploadGapLimitDays: 7,
    currentStreakDays: 14,
    bestStreakDays: 22,
    streakAtRisk: true,
    burnoutRisk: 'moderate',
    burnoutMessage: 'Late night uploads detected (3:00 AM) and gap widening. Recommend scheduling 1 lightweight Short instead of long-form.',
    bestPostingTime: 'Today at 7:00 PM EDT (Peak viewer concurrency)',
    growthHealthScore: {
      total: 82,
      consistency: 74,
      engagement: 89,
      trendAlignment: 84
    },
    monetization: {
      status: 'monetized',
      currentWatchHours: 194800,
      goalWatchHours: 250000,
      currentSubs: 384200,
      goalSubs: 500000,
      estimatedMonthlyRevenue: 9420,
      nextMilestone: '500K Silver Club & Brand Sponsorship Tier 1'
    },
    platforms: {
      youtube: {
        platform: 'youtube',
        handle: '@sarahchentech',
        followers: 248000,
        followerGrowth7d: 3820,
        views30d: 1420000,
        engagementRate: 7.2,
        postsThisMonth: 6,
        connected: true,
        liveStatus: 'synced',
        topPost: {
          title: 'I Built an Autonomous AI Lab in My Room (Full Breakdown)',
          views: 312000,
          engagement: 9.4,
          postedAgo: '6 days ago'
        }
      },
      instagram: {
        platform: 'instagram',
        handle: '@sarah.chen.tech',
        followers: 86400,
        followerGrowth7d: 1420,
        views30d: 580000,
        engagementRate: 5.6,
        postsThisMonth: 12,
        connected: true,
        liveStatus: 'synced',
        topPost: {
          title: 'Reel: 3 Open-Source Models Beating GPT-4o on Local M3 Mac',
          views: 194000,
          engagement: 8.1,
          postedAgo: '3 days ago'
        }
      },
      tiktok: {
        platform: 'tiktok',
        handle: '@sarahchentok',
        followers: 38900,
        followerGrowth7d: 910,
        views30d: 290000,
        engagementRate: 6.9,
        postsThisMonth: 8,
        connected: true,
        liveStatus: 'synced',
        topPost: {
          title: 'Desk setup for 120-hour AI training cycles',
          views: 89000,
          engagement: 7.5,
          postedAgo: '5 days ago'
        }
      },
      x: {
        platform: 'x',
        handle: '@sarahchen_dev',
        followers: 10900,
        followerGrowth7d: 410,
        views30d: 340000,
        engagementRate: 4.8,
        postsThisMonth: 24,
        connected: true,
        liveStatus: 'synced',
        topPost: {
          title: 'Deep dive breakdown on local LLM quantization memory leaks (Thread)',
          views: 45000,
          engagement: 6.2,
          postedAgo: '2 days ago'
        }
      }
    }
  },
  {
    id: 'client_marcus',
    name: 'Marcus Vance',
    handle: '@marcusvancefit',
    role: 'Coaching Client',
    niche: 'High-Performance Functional Fitness & Longevity',
    avatarColor: 'from-amber-500 to-red-600',
    primaryPlatform: 'tiktok',
    totalFollowers: 215600,
    subscriberVelocity24h: 890,
    overallEngagementRate: 8.4,
    avgViewsPerPost: 62000,
    lastPostHoursAgo: 38,
    uploadGapLimitDays: 4,
    currentStreakDays: 28,
    bestStreakDays: 35,
    streakAtRisk: false,
    burnoutRisk: 'low',
    burnoutMessage: 'Pacing is healthy. 4 posts/week maintained with strong weekend viewer retention.',
    bestPostingTime: 'Tomorrow at 6:30 AM EDT (Morning routine workout rush)',
    growthHealthScore: {
      total: 91,
      consistency: 94,
      engagement: 92,
      trendAlignment: 88
    },
    monetization: {
      status: 'monetized',
      currentWatchHours: 88000,
      goalWatchHours: 120000,
      currentSubs: 215600,
      goalSubs: 250000,
      estimatedMonthlyRevenue: 5800,
      nextMilestone: 'Fitness App Subscription Partner Threshold'
    },
    platforms: {
      youtube: {
        platform: 'youtube',
        handle: '@marcusvancefit',
        followers: 52000,
        followerGrowth7d: 1200,
        views30d: 410000,
        engagementRate: 7.8,
        postsThisMonth: 4,
        connected: true,
        liveStatus: 'synced',
        topPost: {
          title: 'The Only 3 Mobility Drills You Need for Lower Back Pain',
          views: 145000,
          engagement: 9.1,
          postedAgo: '4 days ago'
        }
      },
      instagram: {
        platform: 'instagram',
        handle: '@marcusvance.fit',
        followers: 74200,
        followerGrowth7d: 1850,
        views30d: 620000,
        engagementRate: 8.9,
        postsThisMonth: 16,
        connected: true,
        liveStatus: 'synced',
        topPost: {
          title: 'Stop Doing Sit-Ups: Do This 3-Minute Hollow Body Series',
          views: 310000,
          engagement: 11.2,
          postedAgo: '2 days ago'
        }
      },
      tiktok: {
        platform: 'tiktok',
        handle: '@marcusvancetok',
        followers: 84100,
        followerGrowth7d: 2900,
        views30d: 980000,
        engagementRate: 8.6,
        postsThisMonth: 18,
        connected: true,
        liveStatus: 'synced',
        topPost: {
          title: '5 Posture hacks tech workers need right now',
          views: 420000,
          engagement: 9.8,
          postedAgo: '1 day ago'
        }
      },
      x: {
        platform: 'x',
        handle: '@marcusvance',
        followers: 5300,
        followerGrowth7d: 120,
        views30d: 85000,
        engagementRate: 3.4,
        postsThisMonth: 10,
        connected: true,
        liveStatus: 'synced',
        topPost: {
          title: 'Zone 2 Cardio protocol for busy entrepreneurs',
          views: 18000,
          engagement: 4.1,
          postedAgo: '5 days ago'
        }
      }
    }
  },
  {
    id: 'client_aria',
    name: 'Aria Silva',
    handle: '@ariasflavor',
    role: 'Agency Talent',
    niche: 'Global Artisan Street Food & Recipe Science',
    avatarColor: 'from-emerald-500 to-teal-700',
    primaryPlatform: 'instagram',
    totalFollowers: 746000,
    subscriberVelocity24h: 3120,
    overallEngagementRate: 9.1,
    avgViewsPerPost: 198000,
    lastPostHoursAgo: 76,
    uploadGapLimitDays: 5,
    currentStreakDays: 8,
    bestStreakDays: 42,
    streakAtRisk: true,
    burnoutRisk: 'moderate',
    burnoutMessage: 'Production heavy videos causing post fatigue. Suggest quick 30s pantry hack reel.',
    bestPostingTime: 'Friday at 5:00 PM EDT (Weekend meal prep planning)',
    growthHealthScore: {
      total: 88,
      consistency: 80,
      engagement: 96,
      trendAlignment: 89
    },
    monetization: {
      status: 'monetized',
      currentWatchHours: 640000,
      goalWatchHours: 1000000,
      currentSubs: 746000,
      goalSubs: 1000000,
      estimatedMonthlyRevenue: 24500,
      nextMilestone: '1M Gold Play Button & Cookware Brand Collab'
    },
    platforms: {
      youtube: {
        platform: 'youtube',
        handle: '@ariasflavor',
        followers: 295000,
        followerGrowth7d: 4600,
        views30d: 2100000,
        engagementRate: 8.8,
        postsThisMonth: 3,
        connected: true,
        liveStatus: 'synced',
        topPost: {
          title: 'I Spent 48 Hours Perfecting the 100-Hour Focaccia',
          views: 890000,
          engagement: 10.4,
          postedAgo: '1 week ago'
        }
      },
      instagram: {
        platform: 'instagram',
        handle: '@ariasflavor',
        followers: 320000,
        followerGrowth7d: 8900,
        views30d: 3400000,
        engagementRate: 9.8,
        postsThisMonth: 14,
        connected: true,
        liveStatus: 'synced',
        topPost: {
          title: 'Crispy Garlic Confit Butter Board with Sound ASMR',
          views: 1200000,
          engagement: 12.6,
          postedAgo: '3 days ago'
        }
      },
      tiktok: {
        platform: 'tiktok',
        handle: '@ariasflavor_tok',
        followers: 124000,
        followerGrowth7d: 3800,
        views30d: 1100000,
        engagementRate: 8.7,
        postsThisMonth: 10,
        connected: true,
        liveStatus: 'synced',
        topPost: {
          title: 'The secret acid ratio restaurants never tell you',
          views: 640000,
          engagement: 9.3,
          postedAgo: '4 days ago'
        }
      },
      x: {
        platform: 'x',
        handle: '@ariasflavor',
        followers: 7000,
        followerGrowth7d: 220,
        views30d: 92000,
        engagementRate: 3.9,
        postsThisMonth: 6,
        connected: false,
        liveStatus: 'action_required',
        topPost: {
          title: 'Why flaky salt on chocolate chip cookies activates dopamine',
          views: 31000,
          engagement: 5.1,
          postedAgo: '2 weeks ago'
        }
      }
    }
  }
];

export const MOCK_TRENDS: Record<string, TrendItem[]> = {
  client_sarah: [
    {
      id: 'trend_1',
      topic: 'Local AI Agents on Raspberry Pi 5 & M4 Chips',
      category: 'AI Hardware',
      platform: 'youtube',
      trendFitScore: 94,
      fitReason: 'Direct overlap with your 380K tech audience. 68% of your top commenters requested local LLM demos.',
      expiryHoursRemaining: 32,
      velocity: 'exploding',
      recommendedHook: '"Everyone is paying $20/month for cloud AI, but here is what happens when you run a 14B model locally on a $60 chip."',
      targetHashtags: ['#LocalLLM', '#AIHardware', '#RaspberryPi', '#TechReview'],
      viralSound: 'Original Audio / Tech Ambient Beat #14',
      estimatedReachMultiplier: '2.8x'
    },
    {
      id: 'trend_2',
      topic: 'Agentic Coding: Cursor vs Claude Code Benchmarks',
      category: 'Software Engineering',
      platform: 'youtube',
      trendFitScore: 89,
      fitReason: 'High developer engagement surge across YouTube & X. Search volume spiked +310% in last 4 days.',
      expiryHoursRemaining: 54,
      velocity: 'surging',
      recommendedHook: '"I gave the exact same 500-line full-stack challenge to 3 AI coders. Only one didn\'t hallucinate."',
      targetHashtags: ['#AIDeveloper', '#CursorIDE', '#CodingChallenge', '#TechSetup'],
      estimatedReachMultiplier: '2.2x'
    },
    {
      id: 'trend_3',
      topic: 'Spatial Computing Desk Setups & AR Glasses Daily Driver',
      category: 'Workstation Aesthetic',
      platform: 'instagram',
      trendFitScore: 78,
      fitReason: 'Strong visual appeal for Instagram Reels & TikTok carousel formats.',
      expiryHoursRemaining: 96,
      velocity: 'steady',
      recommendedHook: '"30 days with no monitors—just AR glasses and a split mechanical keyboard. Is it actually productive?"',
      targetHashtags: ['#DeskSetup', '#SpatialAudio', '#MinimalTech', '#DeveloperLife'],
      viralSound: 'Synthwave Glitch Echo - 15s Cut',
      estimatedReachMultiplier: '1.7x'
    }
  ],
  client_marcus: [
    {
      id: 'trend_m1',
      topic: 'Zone 2 Heart Rate Rucking vs High-Incline Treadmill',
      category: 'Cardio & Longevity',
      platform: 'tiktok',
      trendFitScore: 96,
      fitReason: 'Longevity fitness search volume peaked +410% this week. Matches your functional fitness niche perfectly.',
      expiryHoursRemaining: 28,
      velocity: 'exploding',
      recommendedHook: '"If you want to live to 90 without wrecking your knees, stop running 10Ks and start doing this 20-minute carry."',
      targetHashtags: ['#Zone2Cardio', '#LongevityTips', '#FunctionalFitness', '#KneeHealth'],
      viralSound: 'High Energy Phonk Workout Drop #7',
      estimatedReachMultiplier: '3.1x'
    },
    {
      id: 'trend_m2',
      topic: 'Thoracic Spine Decompression for Desk Workers',
      category: 'Mobility & Posture',
      platform: 'instagram',
      trendFitScore: 91,
      fitReason: 'Audience saves on mobility reels are 3.4x higher than standard gym lifting content.',
      expiryHoursRemaining: 44,
      velocity: 'surging',
      recommendedHook: '"Your upper back pain isn\'t from your chair—it\'s this one frozen joint. Test it right now in 10 seconds."',
      targetHashtags: ['#MobilityRoutine', '#BackPainRelief', '#PostureFix', '#PhysioHacks'],
      estimatedReachMultiplier: '2.5x'
    }
  ],
  client_aria: [
    {
      id: 'trend_a1',
      topic: 'Cold Fermented Focaccia Dimple ASMR with Chili Crisp',
      category: 'Artisan Baking',
      platform: 'instagram',
      trendFitScore: 98,
      fitReason: 'ASMR food triggers generated your top 3 videos last quarter. Dimpling sound trend is at peak saturation window.',
      expiryHoursRemaining: 24,
      velocity: 'exploding',
      recommendedHook: '"The loudest focaccia crunch in the world took me 72 hours of cold fermentation. Listen to this crust."',
      targetHashtags: ['#FocacciaASMR', '#BakingScience', '#StreetFoodArtisan', '#BreadTok'],
      viralSound: 'Crisp Kitchen Audio (Pure ASMR)',
      estimatedReachMultiplier: '3.4x'
    }
  ]
};

export const MOCK_RETENTION: Record<string, RetentionAnalysisData> = {
  client_sarah: {
    videoTitle: 'I Built an Autonomous AI Lab in My Room (Full Breakdown)',
    durationSeconds: 740,
    hookStrengthScore: 71,
    averageViewDuration: '5m 12s',
    avgRetentionPct: 56.4,
    criticalDropOffSecond: 18,
    primaryDropReason: 'Intro title animation ran 6 seconds too long without showing the running hardware prototype.',
    coachFixAdvice: 'Show the physical Raspberry Pi robotic arm moving in the first 3 seconds before introducing yourself.',
    points: [
      { second: 0, timestamp: '0:00', retentionPct: 100, eventNote: 'Video begins' },
      { second: 5, timestamp: '0:05', retentionPct: 91, eventNote: 'Verbal teaser' },
      { second: 18, timestamp: '0:18', retentionPct: 76, issue: 'Critical Drop-off (-15%)', suggestion: 'Cut the branded motion logo here; jump straight to demo footage.' },
      { second: 60, timestamp: '1:00', retentionPct: 72, eventNote: 'Hardware overview begins' },
      { second: 140, timestamp: '2:20', retentionPct: 68, eventNote: 'Local benchmark results' },
      { second: 240, timestamp: '4:00', retentionPct: 62, issue: 'Minor dip (-6%)', suggestion: 'Code snippet on screen was too small on mobile screens.' },
      { second: 360, timestamp: '6:00', retentionPct: 58, eventNote: 'Robotic arm live test (Audience re-engagement surge)' },
      { second: 540, timestamp: '9:00', retentionPct: 52, eventNote: 'Cost breakdown comparison' },
      { second: 700, timestamp: '11:40', retentionPct: 44, eventNote: 'Call to subscribe & GitHub repo' },
      { second: 740, timestamp: '12:20', retentionPct: 38, eventNote: 'End screen' }
    ]
  },
  client_marcus: {
    videoTitle: 'The Only 3 Mobility Drills You Need for Lower Back Pain',
    durationSeconds: 420,
    hookStrengthScore: 88,
    averageViewDuration: '4m 02s',
    avgRetentionPct: 64.2,
    criticalDropOffSecond: 25,
    primaryDropReason: 'Explaining anatomy diagram instead of doing the drill movement.',
    coachFixAdvice: 'Perform drill 1 while speaking voiceover; keep text overlay brief.',
    points: [
      { second: 0, timestamp: '0:00', retentionPct: 100 },
      { second: 10, timestamp: '0:10', retentionPct: 94 },
      { second: 25, timestamp: '0:25', retentionPct: 84, issue: 'Drop-off (-10%)', suggestion: 'Don\'t stand still talking; demonstrate the hip hinge right away.' },
      { second: 90, timestamp: '1:30', retentionPct: 81 },
      { second: 200, timestamp: '3:20', retentionPct: 74 },
      { second: 350, timestamp: '5:50', retentionPct: 62 },
      { second: 420, timestamp: '7:00', retentionPct: 54 }
    ]
  },
  client_aria: {
    videoTitle: 'I Spent 48 Hours Perfecting the 100-Hour Focaccia',
    durationSeconds: 610,
    hookStrengthScore: 92,
    averageViewDuration: '5m 18s',
    avgRetentionPct: 68.0,
    criticalDropOffSecond: 45,
    primaryDropReason: 'Weighing flour in slow motion with no music.',
    coachFixAdvice: 'Add sizzling ASMR tease or ambient lo-fi sound.',
    points: [
      { second: 0, timestamp: '0:00', retentionPct: 100 },
      { second: 5, timestamp: '0:05', retentionPct: 98, eventNote: 'Crunch ASMR hook' },
      { second: 45, timestamp: '0:45', retentionPct: 85, issue: 'Pacing dip' },
      { second: 180, timestamp: '3:00', retentionPct: 80 },
      { second: 380, timestamp: '6:20', retentionPct: 72 },
      { second: 610, timestamp: '10:10', retentionPct: 58 }
    ]
  }
};

export const MOCK_SENTIMENT: Record<string, CommentSentimentData> = {
  client_sarah: {
    totalAnalyzed: 1840,
    positivePct: 79,
    neutralPct: 14,
    negativePct: 7,
    keyPraises: [
      'Appreciate showing actual raw error logs instead of edited magic',
      'The GitHub repository code was cleanest I have seen on tech YouTube',
      'Audio mixing is crisp and no annoying background music'
    ],
    keyComplaints: [
      'Text font on the terminal was too small to read on phone screen',
      'Didn\'t test 7B vs 14B parameter models side by side'
    ],
    audienceRequestedTopics: [
      {
        id: 'req_1',
        topic: 'How to setup DeepSeek R1 locally on a Mac Mini M4 without heating',
        requestCount: 342,
        sampleComment: '"Sarah please make a guide on running DeepSeek locally on a 16GB Mac Mini! Will it thermal throttle?"',
        addressed: false
      },
      {
        id: 'req_2',
        topic: 'Full wiring schematic and parts list for the robotic arm rig',
        requestCount: 188,
        sampleComment: '"Can you share the bill of materials for the 3D printed arm servo controller?"',
        addressed: false
      },
      {
        id: 'req_3',
        topic: 'Comparison between Ollama vs vLLM throughput latency',
        requestCount: 124,
        sampleComment: '"What was your tokens-per-second difference between Ollama and vLLM?"',
        addressed: true
      }
    ],
    sentimentKeywords: [
      { word: 'Genius', type: 'positive', frequency: 186 },
      { word: 'Clean code', type: 'positive', frequency: 142 },
      { word: 'Helpful', type: 'positive', frequency: 210 },
      { word: 'Font small', type: 'negative', frequency: 64 },
      { word: 'Too fast', type: 'negative', frequency: 38 },
      { word: 'Raspberry Pi', type: 'neutral', frequency: 290 }
    ]
  },
  client_marcus: {
    totalAnalyzed: 940,
    positivePct: 86,
    neutralPct: 11,
    negativePct: 3,
    keyPraises: [
      'Actually healed my lower back after 4 days of the hollow hold drill',
      'No BS supplements or pushy sales pitches'
    ],
    keyComplaints: [
      'Camera angle during movement 2 made foot placement hard to see'
    ],
    audienceRequestedTopics: [
      {
        id: 'req_m1',
        topic: 'Hip flexor release routine for runners with anterior pelvic tilt',
        requestCount: 210,
        sampleComment: '"Can you do a follow along for hip flexor tightness? Runners need this!"',
        addressed: false
      }
    ],
    sentimentKeywords: [
      { word: 'Relief', type: 'positive', frequency: 164 },
      { word: 'Follow along', type: 'positive', frequency: 112 },
      { word: 'Angle', type: 'negative', frequency: 22 }
    ]
  },
  client_aria: {
    totalAnalyzed: 3200,
    positivePct: 92,
    neutralPct: 6,
    negativePct: 2,
    keyPraises: [
      'The sound design on the bread slicing gave me chills',
      'The recipe card in the pinned comment was so easy to follow'
    ],
    keyComplaints: [
      'Grams vs cups measurements confusion for US home cooks'
    ],
    audienceRequestedTopics: [
      {
        id: 'req_a1',
        topic: 'Gluten-free focaccia that still has big air bubbles',
        requestCount: 412,
        sampleComment: '"Please Aria make a GF version that actually rises like that!!"',
        addressed: false
      }
    ],
    sentimentKeywords: [
      { word: 'Delicious', type: 'positive', frequency: 450 },
      { word: 'ASMR', type: 'positive', frequency: 390 },
      { word: 'Cups please', type: 'negative', frequency: 45 }
    ]
  }
};

export const MOCK_GROWTH_PREDICTION: Record<string, GrowthPredictionData> = {
  client_sarah: {
    currentFollowers: 384200,
    predicted30d: 419800,
    lowerBound30d: 408000,
    upperBound30d: 435000,
    confidenceScore: 91,
    modelType: 'Prophet Time-Series with Velocity Decay & Trend Weighting',
    historical: [
      { day: 'Day -24', count: 358000 },
      { day: 'Day -18', count: 364000 },
      { day: 'Day -12', count: 371500 },
      { day: 'Day -6', count: 379200 },
      { day: 'Today', count: 384200 }
    ],
    forecast: [
      { day: 'Today', count: 384200, lower: 384200, upper: 384200 },
      { day: '+6 Days', count: 391200, lower: 389000, upper: 394000 },
      { day: '+12 Days', count: 398600, lower: 394800, upper: 403200 },
      { day: '+18 Days', count: 405900, lower: 400100, upper: 412500 },
      { day: '+24 Days', count: 412800, lower: 404500, upper: 423000 },
      { day: '+30 Days', count: 419800, lower: 408000, upper: 435000 }
    ],
    keyGrowthDrivers: [
      'Local AI benchmark topic has a +18% viral discovery coefficient',
      'Upload gap currently risking -3.2% decay if no post by day 7',
      'Shorts cross-pollination from Instagram Reels driving 280 subscribers/day'
    ]
  },
  client_marcus: {
    currentFollowers: 215600,
    predicted30d: 242000,
    lowerBound30d: 236000,
    upperBound30d: 251000,
    confidenceScore: 94,
    modelType: 'Exponential Moving Average with Weekend Seasonality',
    historical: [
      { day: 'Day -24', count: 198000 },
      { day: 'Day -18', count: 202500 },
      { day: 'Day -12', count: 207000 },
      { day: 'Day -6', count: 211800 },
      { day: 'Today', count: 215600 }
    ],
    forecast: [
      { day: 'Today', count: 215600, lower: 215600, upper: 215600 },
      { day: '+6 Days', count: 221000, lower: 219500, upper: 223000 },
      { day: '+12 Days', count: 226500, lower: 224000, upper: 229800 },
      { day: '+18 Days', count: 231800, lower: 228000, upper: 236200 },
      { day: '+24 Days', count: 237000, lower: 232000, upper: 243500 },
      { day: '+30 Days', count: 242000, lower: 236000, upper: 251000 }
    ],
    keyGrowthDrivers: [
      'Consistent 4 posts/week frequency rewards algorithm confidence',
      'Morning routine hooks hitting prime commuter engagement windows'
    ]
  },
  client_aria: {
    currentFollowers: 746000,
    predicted30d: 824000,
    lowerBound30d: 805000,
    upperBound30d: 855000,
    confidenceScore: 89,
    modelType: 'High-Volume Poisson Regression',
    historical: [
      { day: 'Day -24', count: 680000 },
      { day: 'Day -18', count: 698000 },
      { day: 'Day -12', count: 715000 },
      { day: 'Day -6', count: 732000 },
      { day: 'Today', count: 746000 }
    ],
    forecast: [
      { day: 'Today', count: 746000, lower: 746000, upper: 746000 },
      { day: '+6 Days', count: 761000, lower: 755000, upper: 768000 },
      { day: '+12 Days', count: 777000, lower: 769000, upper: 789000 },
      { day: '+18 Days', count: 792500, lower: 782000, upper: 810000 },
      { day: '+24 Days', count: 808000, lower: 794000, upper: 832000 },
      { day: '+30 Days', count: 824000, lower: 805000, upper: 855000 }
    ],
    keyGrowthDrivers: [
      'ASMR audio saves generating compounding organic explore feed placement'
    ]
  }
};

export const MOCK_IDEAS: Record<string, IdeaVaultItem[]> = {
  client_sarah: [
    {
      id: 'idea_1',
      title: 'Running DeepSeek R1 on $60 Raspberry Pi 5: Is it actually usable?',
      niche: 'AI Hardware',
      format: 'Long-form',
      targetPlatform: 'youtube',
      predictedScore: 94,
      tags: ['LocalAI', 'RaspberryPi', 'DeepSeek', 'Benchmark'],
      status: 'ready',
      notes: 'Audience asked 342 times in comments. Shoot hardware closeups and tokens/sec latency clock.',
      createdAt: 'Yesterday'
    },
    {
      id: 'idea_2',
      title: 'Top 5 AI tools that saved 10 hours of manual coding this week',
      niche: 'Dev Productivity',
      format: 'Reel',
      targetPlatform: 'instagram',
      predictedScore: 88,
      tags: ['AIDev', 'Reels', 'Productivity'],
      status: 'scripting',
      notes: 'Quick cuts, fast pace, screen recordings with clean dark-mode UI.',
      createdAt: '3 days ago'
    },
    {
      id: 'idea_3',
      title: 'The Truth About "100x AI Engineers" in 2026',
      niche: 'Tech Commentary',
      format: 'Thread',
      targetPlatform: 'x',
      predictedScore: 82,
      tags: ['SoftwareEngineering', 'AIEngineer', 'HotTake'],
      status: 'idea',
      notes: 'Contrast real architecture engineering vs prompt tweaking.',
      createdAt: '5 days ago'
    }
  ],
  client_marcus: [
    {
      id: 'idea_m1',
      title: 'The 3-Minute Hip Flexor Release Before Any Leg Day',
      niche: 'Mobility',
      format: 'Short',
      targetPlatform: 'tiktok',
      predictedScore: 92,
      tags: ['Mobility', 'HipFlexors', 'LegDay'],
      status: 'ready',
      notes: 'Direct answer to top requested comment with 210 upvotes.',
      createdAt: '2 days ago'
    }
  ],
  client_aria: [
    {
      id: 'idea_a1',
      title: 'Gluten-Free Focaccia with Real Bubbles (Scientifically Tested)',
      niche: 'Baking Science',
      format: 'Long-form',
      targetPlatform: 'youtube',
      predictedScore: 96,
      tags: ['GlutenFree', 'Focaccia', 'BakingASMR'],
      status: 'scripting',
      notes: 'Solves the #1 complaint from last video.',
      createdAt: '1 day ago'
    }
  ]
};

export const MOCK_WEEKLY_SCHEDULE: Record<string, WeeklyScheduleItem[]> = {
  client_sarah: [
    {
      id: 'sched_1',
      day: 'Monday',
      dateStr: 'Oct 20',
      time: '7:00 PM EDT',
      platform: 'youtube',
      format: 'Main Video (12m)',
      titleConcept: 'Local AI on Mini Hardware (DeepSeek Pi 5 Benchmark)',
      hook: 'Don\'t buy a $2,000 GPU before you see what this $60 board can do.',
      hashtags: ['#LocalAI', '#Hardware', '#DevLife'],
      status: 'scheduled'
    },
    {
      id: 'sched_2',
      day: 'Wednesday',
      dateStr: 'Oct 22',
      time: '12:30 PM EDT',
      platform: 'instagram',
      format: 'Reel (45s)',
      titleConcept: 'Top 3 Terminal Shortcuts for AI Developers',
      hook: 'If you still type this command by hand, save this reel right now.',
      hashtags: ['#Terminal', '#CodingTips', '#Developer'],
      status: 'draft'
    },
    {
      id: 'sched_3',
      day: 'Friday',
      dateStr: 'Oct 24',
      time: '6:00 PM EDT',
      platform: 'tiktok',
      format: 'Short (30s)',
      titleConcept: 'My $200 Desk Cable Management Setup',
      hook: 'Zero visible wires with 3 monitors and 4 dev boards.',
      hashtags: ['#DeskSetup', '#TechTok', '#CableManagement'],
      status: 'draft'
    },
    {
      id: 'sched_4',
      day: 'Sunday',
      dateStr: 'Oct 26',
      time: '10:00 AM EDT',
      platform: 'x',
      format: 'Deep Dive Thread',
      titleConcept: 'What 100 Days of Building AI Agents Taught Me',
      hook: 'Most AI demos work in a tweet, but fail in production. Here is why.',
      hashtags: ['#BuildInPublic', '#TechFounders'],
      status: 'draft'
    }
  ],
  client_marcus: [
    {
      id: 'sched_m1',
      day: 'Tuesday',
      dateStr: 'Oct 21',
      time: '6:30 AM EDT',
      platform: 'tiktok',
      format: 'Follow-Along (60s)',
      titleConcept: 'Morning Spine Unlock',
      hook: 'Do this before your first cup of coffee.',
      hashtags: ['#MorningRoutine', '#SpineMobility'],
      status: 'scheduled'
    }
  ],
  client_aria: [
    {
      id: 'sched_a1',
      day: 'Friday',
      dateStr: 'Oct 24',
      time: '5:00 PM EDT',
      platform: 'instagram',
      format: 'Reel (60s)',
      titleConcept: 'Crispy Garlic Confit Focaccia',
      hook: 'Listen to this crust after 72 hours in the fridge.',
      hashtags: ['#Focaccia', '#ASMRBaking'],
      status: 'scheduled'
    }
  ]
};

export const MOCK_COMPETITORS: Record<string, CompetitorBenchmarkItem[]> = {
  client_sarah: [
    {
      id: 'comp_1',
      name: 'Alex Rivera Tech',
      handle: '@alexriveratech',
      followers: 412000,
      uploadFreqPerWeek: 2.1,
      avgViews: 92000,
      engagementRate: 5.4,
      topFormat: 'Studio Review / Talking Head',
      advantageOverClient: 'Slightly higher total subscribers (+28K) and polished studio lighting.',
      opportunityForClient: 'Sarah has 26% higher viewer comment rate and stronger technical credibility (raw code vs consumer gadget unboxing).'
    },
    {
      id: 'comp_2',
      name: 'ByteCraft Dev',
      handle: '@bytecraft_dev',
      followers: 340000,
      uploadFreqPerWeek: 1.4,
      avgViews: 71000,
      engagementRate: 6.1,
      topFormat: 'Tutorial Walkthroughs',
      advantageOverClient: 'Highly structured playlist courses that rank high in YouTube Search SEO.',
      opportunityForClient: 'Their videos are slower-paced; Sarah\'s snappy visual edits capture 18-24 age demographic much better.'
    }
  ],
  client_marcus: [
    {
      id: 'comp_m1',
      name: 'Dr. Dan Mobility',
      handle: '@drdanmobility',
      followers: 280000,
      uploadFreqPerWeek: 3.5,
      avgViews: 58000,
      engagementRate: 6.2,
      topFormat: 'Whiteboard Anatomy Breakdown',
      advantageOverClient: 'Medical credential in bio drives authority.',
      opportunityForClient: 'Marcus has more relatable physique and athletic practical routines.'
    }
  ],
  client_aria: [
    {
      id: 'comp_a1',
      name: 'Rustic Crust Co',
      handle: '@rusticcrust',
      followers: 810000,
      uploadFreqPerWeek: 4.0,
      avgViews: 175000,
      engagementRate: 7.9,
      topFormat: 'Quick 15s Sourdough Reels',
      advantageOverClient: 'High posting volume.',
      opportunityForClient: 'Aria\'s deep science explanations build much stronger loyalty and cookbook preorder conversion.'
    }
  ]
};

export const MOCK_COLLABS: Record<string, CollabCreatorItem[]> = {
  client_sarah: [
    {
      id: 'collab_1',
      name: 'Elena Rostova (Dev & Robotics)',
      handle: '@elenacodes',
      platform: 'youtube',
      followers: 320000,
      niche: 'Robotics & Embedded C++',
      matchScore: 94,
      synergyReason: 'Complementary skills: Sarah provides AI/ML model integration while Elena excels in physical CNC hardware.',
      suggestedCollabIdea: 'Building a Voice-Controlled Robotic Barista in 48 Hours'
    },
    {
      id: 'collab_2',
      name: 'Kavita Patel (AI Security)',
      handle: '@kavitasec',
      platform: 'youtube',
      followers: 240000,
      niche: 'Cybersecurity & LLM Jailbreaks',
      matchScore: 88,
      synergyReason: 'Both audiences love technical depth and dissecting real-world vulnerabilities.',
      suggestedCollabIdea: 'Can an AI Agent Hack My Smart Home Lab?'
    }
  ],
  client_marcus: [
    {
      id: 'collab_m1',
      name: 'Coach Maya Zen',
      handle: '@mayazenyoga',
      platform: 'instagram',
      followers: 190000,
      niche: 'Breathwork & Nervous System',
      matchScore: 91,
      synergyReason: 'Combines strength training with parasympathetic recovery.',
      suggestedCollabIdea: 'The Heavy Lifter\'s Guide to Nervous System Reset'
    }
  ],
  client_aria: [
    {
      id: 'collab_a1',
      name: 'Chef Julian K',
      handle: '@chefjulian',
      platform: 'youtube',
      followers: 920000,
      niche: 'French Culinary Fundamentals',
      matchScore: 96,
      synergyReason: 'Fusion of classic French technique with modern street food flair.',
      suggestedCollabIdea: 'Making a $100 Beef Bourguignon Sandwich'
    }
  ]
};

export const MOCK_ALERTS: ProactiveAlert[] = [
  {
    id: 'alert_1',
    clientId: 'client_sarah',
    type: 'upload_gap',
    title: 'Upload Gap Alert: 5.9 Days Since Last Post',
    message: 'You haven\'t posted in 5.9 days. Your audience engagement retention drops steeply after 7.0 days of inactivity.',
    timestamp: '12m ago',
    severity: 'high',
    read: false,
    actionText: 'Generate Weekly Post Now',
    actionTarget: 'weekly_plan'
  },
  {
    id: 'alert_2',
    clientId: 'client_sarah',
    type: 'best_time',
    title: 'Optimal Viewer Concurrency Today',
    message: 'Your core audience is projected to be most active at 7:00 PM EDT today. Schedule your draft video for this slot.',
    timestamp: '45m ago',
    severity: 'medium',
    read: false,
    actionText: 'View Schedule',
    actionTarget: 'weekly_plan'
  },
  {
    id: 'alert_3',
    clientId: 'client_sarah',
    type: 'streak_risk',
    title: '14-Day Consistency Streak at Risk',
    message: 'Your current streak is 14 days! Post before 11:59 PM tomorrow to maintain your consistency momentum bonus.',
    timestamp: '2h ago',
    severity: 'medium',
    read: false,
    actionText: 'Pick from Idea Vault',
    actionTarget: 'idea_vault'
  },
  {
    id: 'alert_4',
    clientId: 'client_sarah',
    type: 'trend_alert',
    title: 'High-Fit Trend Exploding (94% Match)',
    message: '"Local AI on Raspberry Pi" is trending with 32h remaining before saturation. 342 viewers asked for this!',
    timestamp: '4h ago',
    severity: 'high',
    read: true,
    actionText: 'View Trend Fit',
    actionTarget: 'trends'
  },
  {
    id: 'alert_5',
    clientId: 'client_sarah',
    type: 'burnout_warning',
    title: 'Burnout Early Warning Triggered',
    message: 'Upload timestamps over the past month shifted from 6:00 PM to 3:15 AM. Pace yourself with a lightweight short.',
    timestamp: '1d ago',
    severity: 'info',
    read: true,
    actionText: 'Ask Coach for Light Format',
    actionTarget: 'coach'
  }
];

export const MOCK_REVENUE: Record<string, CreatorRevenueMetrics> = {
  client_sarah: {
    totalEstimatedMonthly: 9420,
    averageBlendedRPM: 4.85,
    totalMonetizedViews30d: 1942000,
    payoutCurrency: 'USD ($)',
    historicalEarnings: [
      { month: 'Jun', amount: 6850 },
      { month: 'Jul', amount: 7420 },
      { month: 'Aug', amount: 8100 },
      { month: 'Sep', amount: 8750 },
      { month: 'Oct (Est.)', amount: 9420 }
    ],
    platformBreakdown: {
      youtube: {
        platform: 'youtube',
        rpm: 5.80,
        cpmAverage: 11.40,
        estimatedMonthlyEarnings: 6960,
        monthlyMonetizedViews: 1200000,
        topEarningCategory: 'Long-form AI Tutorials & Dev Tool AdSense',
        monthOverMonthGrowthPct: 14.2,
        payoutStatus: 'scheduled',
        nextPayoutDate: 'Nov 21, 2026'
      },
      instagram: {
        platform: 'instagram',
        rpm: 2.60,
        cpmAverage: 5.20,
        estimatedMonthlyEarnings: 1430,
        monthlyMonetizedViews: 550000,
        topEarningCategory: 'Reels Performance Bonus & Tech Setup Integrations',
        monthOverMonthGrowthPct: 8.4,
        payoutStatus: 'scheduled',
        nextPayoutDate: 'Nov 15, 2026'
      },
      tiktok: {
        platform: 'tiktok',
        rpm: 1.85,
        cpmAverage: 3.90,
        estimatedMonthlyEarnings: 536,
        monthlyMonetizedViews: 290000,
        topEarningCategory: 'Creator Rewards Program (1m+ Videos)',
        monthOverMonthGrowthPct: 18.6,
        payoutStatus: 'paid',
        nextPayoutDate: 'Nov 15, 2026'
      },
      x: {
        platform: 'x',
        rpm: 1.45,
        cpmAverage: 2.80,
        estimatedMonthlyEarnings: 494,
        monthlyMonetizedViews: 340000,
        topEarningCategory: 'Ads Revenue Share for Verified Organic Impressions',
        monthOverMonthGrowthPct: 22.1,
        payoutStatus: 'processing',
        nextPayoutDate: 'Oct 31, 2026'
      }
    },
    revenueStreams: [
      { name: 'AdSense & In-Stream Ads', sharePct: 52, amount: 4898, color: 'bg-indigo-500' },
      { name: 'Direct Brand Sponsorships', sharePct: 32, amount: 3014, color: 'bg-emerald-500' },
      { name: 'Affiliate Hardware Links', sharePct: 11, amount: 1036, color: 'bg-amber-500' },
      { name: 'Creator Platform Rewards', sharePct: 5, amount: 472, color: 'bg-cyan-500' }
    ],
    monetizationTips: [
      'Your YouTube Tech Hardware RPM ($5.80) is 64% above industry median ($3.54). Keep video durations above 8 minutes for mid-roll placement.',
      'Instagram Reels bonus tier unlocked: adding 2 weekly software tool carousels can increase monthly affiliate commissions by an estimated +$620.',
      'X Threads on coding architecture have an unusually high organic bookmark rate—include your GitHub sponsor link in the second tweet.'
    ]
  },
  client_marcus: {
    totalEstimatedMonthly: 5800,
    averageBlendedRPM: 2.95,
    totalMonetizedViews30d: 1966000,
    payoutCurrency: 'USD ($)',
    historicalEarnings: [
      { month: 'Jun', amount: 4100 },
      { month: 'Jul', amount: 4600 },
      { month: 'Aug', amount: 5120 },
      { month: 'Sep', amount: 5450 },
      { month: 'Oct (Est.)', amount: 5800 }
    ],
    platformBreakdown: {
      youtube: {
        platform: 'youtube',
        rpm: 4.20,
        cpmAverage: 8.90,
        estimatedMonthlyEarnings: 1722,
        monthlyMonetizedViews: 410000,
        topEarningCategory: 'Mobility Routine Follow-Alongs',
        monthOverMonthGrowthPct: 9.8,
        payoutStatus: 'scheduled',
        nextPayoutDate: 'Nov 21, 2026'
      },
      instagram: {
        platform: 'instagram',
        rpm: 3.10,
        cpmAverage: 6.40,
        estimatedMonthlyEarnings: 1922,
        monthlyMonetizedViews: 620000,
        topEarningCategory: 'Supplement & Recovery Brand Partnerships',
        monthOverMonthGrowthPct: 12.1,
        payoutStatus: 'scheduled',
        nextPayoutDate: 'Nov 15, 2026'
      },
      tiktok: {
        platform: 'tiktok',
        rpm: 2.10,
        cpmAverage: 4.10,
        estimatedMonthlyEarnings: 1890,
        monthlyMonetizedViews: 900000,
        topEarningCategory: 'TikTok Shop Showcase & Creator Rewards',
        monthOverMonthGrowthPct: 16.5,
        payoutStatus: 'paid',
        nextPayoutDate: 'Nov 15, 2026'
      },
      x: {
        platform: 'x',
        rpm: 0.90,
        cpmAverage: 1.80,
        estimatedMonthlyEarnings: 266,
        monthlyMonetizedViews: 295000,
        topEarningCategory: 'Longevity Protocol Threads',
        monthOverMonthGrowthPct: 4.2,
        payoutStatus: 'processing',
        nextPayoutDate: 'Oct 31, 2026'
      }
    },
    revenueStreams: [
      { name: 'Brand Sponsorships (Supplements)', sharePct: 42, amount: 2436, color: 'bg-emerald-500' },
      { name: 'AdSense & Creator Programs', sharePct: 36, amount: 2088, color: 'bg-indigo-500' },
      { name: 'Coaching App Subscriptions', sharePct: 16, amount: 928, color: 'bg-amber-500' },
      { name: 'Affiliate Equipment Links', sharePct: 6, amount: 348, color: 'bg-cyan-500' }
    ],
    monetizationTips: [
      'TikTok 60-second follow-alongs have high watch completion, boosting your Creator Rewards RPM to $2.10.',
      'Consider launching a dedicated 30-Day Mobility Challenge newsletter to convert social viewers into recurring $19/mo members.'
    ]
  },
  client_aria: {
    totalEstimatedMonthly: 24500,
    averageBlendedRPM: 3.80,
    totalMonetizedViews30d: 6447000,
    payoutCurrency: 'USD ($)',
    historicalEarnings: [
      { month: 'Jun', amount: 17200 },
      { month: 'Jul', amount: 19400 },
      { month: 'Aug', amount: 21100 },
      { month: 'Sep', amount: 23200 },
      { month: 'Oct (Est.)', amount: 24500 }
    ],
    platformBreakdown: {
      youtube: {
        platform: 'youtube',
        rpm: 4.60,
        cpmAverage: 9.80,
        estimatedMonthlyEarnings: 9660,
        monthlyMonetizedViews: 2100000,
        topEarningCategory: '48-Hour Recipe Science & ASMR AdSense',
        monthOverMonthGrowthPct: 11.2,
        payoutStatus: 'scheduled',
        nextPayoutDate: 'Nov 21, 2026'
      },
      instagram: {
        platform: 'instagram',
        rpm: 4.10,
        cpmAverage: 8.20,
        estimatedMonthlyEarnings: 10250,
        monthlyMonetizedViews: 2500000,
        topEarningCategory: 'Premium Cookware & Olive Oil Sponsorships',
        monthOverMonthGrowthPct: 15.6,
        payoutStatus: 'scheduled',
        nextPayoutDate: 'Nov 15, 2026'
      },
      tiktok: {
        platform: 'tiktok',
        rpm: 2.40,
        cpmAverage: 4.90,
        estimatedMonthlyEarnings: 3960,
        monthlyMonetizedViews: 1650000,
        topEarningCategory: 'Sound ASMR Creator Rewards & TikTok Shop Cookware',
        monthOverMonthGrowthPct: 8.9,
        payoutStatus: 'paid',
        nextPayoutDate: 'Nov 15, 2026'
      },
      x: {
        platform: 'x',
        rpm: 1.10,
        cpmAverage: 2.20,
        estimatedMonthlyEarnings: 630,
        monthlyMonetizedViews: 572000,
        topEarningCategory: 'Culinary Chemistry Threads',
        monthOverMonthGrowthPct: 19.4,
        payoutStatus: 'processing',
        nextPayoutDate: 'Oct 31, 2026'
      }
    },
    revenueStreams: [
      { name: 'Brand Partnerships & Integrations', sharePct: 48, amount: 11760, color: 'bg-emerald-500' },
      { name: 'AdSense & Creator Fund', sharePct: 38, amount: 9310, color: 'bg-indigo-500' },
      { name: 'Cookbook Pre-Orders & Guides', sharePct: 10, amount: 2450, color: 'bg-amber-500' },
      { name: 'Affiliate Culinary Equipment', sharePct: 4, amount: 980, color: 'bg-cyan-500' }
    ],
    monetizationTips: [
      'Your Instagram Brand Integration rate card is currently estimated at $4,500/Reel. With 9.8% engagement, you can command $6,000.',
      'Sourdough and focaccia long-form videos retain viewers through the 8-minute mark, doubling mid-roll ad opportunities.'
    ]
  }
};

