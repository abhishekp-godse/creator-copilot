import React, { useState } from 'react';
import {
  INITIAL_CLIENTS,
  MOCK_TRENDS,
  MOCK_RETENTION,
  MOCK_SENTIMENT,
  MOCK_GROWTH_PREDICTION,
  MOCK_IDEAS,
  MOCK_WEEKLY_SCHEDULE,
  MOCK_COMPETITORS,
  MOCK_COLLABS,
  MOCK_ALERTS,
  MOCK_REVENUE
} from './data/mockClients';
import { CreatorClient, TrendItem, IdeaVaultItem, ProactiveAlert, SocialPlatform } from './types';
import { MobileFrame } from './components/MobileFrame';
import { TopBar } from './components/TopBar';
import { BottomTabBar, TabKey } from './components/BottomTabBar';
import { AlertsDrawer } from './components/AlertsDrawer';
import { VSCodeModal } from './components/VSCodeModal';
import { UploadReminderModal } from './components/UploadReminderModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';

import { MonitorTab } from './components/tabs/MonitorTab';
import { CoachTab } from './components/tabs/CoachTab';
import { TrendsTab } from './components/tabs/TrendsTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { GrowthLabTab } from './components/tabs/GrowthLabTab';

export default function App() {
  const [clients, setClients] = useState<CreatorClient[]>(INITIAL_CLIENTS);
  const [activeClient, setActiveClient] = useState<CreatorClient>(INITIAL_CLIENTS[0]);
  const [activeTab, setActiveTab] = useState<TabKey>('monitor');
  const [alerts, setAlerts] = useState<ProactiveAlert[]>(MOCK_ALERTS);

  // Per client Idea Vault
  const [ideasByClient, setIdeasByClient] = useState<Record<string, IdeaVaultItem[]>>(MOCK_IDEAS);

  // Upload Reminder & Deadline state (target ~2 hours 15 mins from now, during peak window)
  const [targetUploadDeadline, setTargetUploadDeadline] = useState<Date>(
    new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000)
  );
  const [isUploadReminderOpen, setIsUploadReminderOpen] = useState(false);

  // Gemini Live API (gemini-3.8-live) Modal
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);

  // UI Modals & Views
  const [isVSCodeModalOpen, setIsVSCodeModalOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState(false);

  // Cross-tab coach prompt trigger
  const [coachInitialPrompt, setCoachInitialPrompt] = useState<string | undefined>(undefined);

  const clientTrends = MOCK_TRENDS[activeClient.id] || MOCK_TRENDS.client_sarah;
  const clientRetention = MOCK_RETENTION[activeClient.id] || MOCK_RETENTION.client_sarah;
  const clientSentiment = MOCK_SENTIMENT[activeClient.id] || MOCK_SENTIMENT.client_sarah;
  const clientPrediction = MOCK_GROWTH_PREDICTION[activeClient.id] || MOCK_GROWTH_PREDICTION.client_sarah;
  const clientSchedule = MOCK_WEEKLY_SCHEDULE[activeClient.id] || MOCK_WEEKLY_SCHEDULE.client_sarah;
  const clientCompetitors = MOCK_COMPETITORS[activeClient.id] || MOCK_COMPETITORS.client_sarah;
  const clientCollabs = MOCK_COLLABS[activeClient.id] || MOCK_COLLABS.client_sarah;
  const clientRevenue = MOCK_REVENUE[activeClient.id] || MOCK_REVENUE.client_sarah;
  const currentIdeas = ideasByClient[activeClient.id] || [];

  // Handlers
  const handleMarkAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const handleAddTrendToVault = (trend: TrendItem) => {
    const newVaultItem: IdeaVaultItem = {
      id: `trend_idea_${Date.now()}`,
      title: `${trend.topic} (${trend.recommendedHook.slice(0, 40)}...)`,
      niche: activeClient.niche,
      format: trend.platform === 'youtube' ? 'Long-form' : 'Short',
      targetPlatform: trend.platform,
      predictedScore: trend.trendFitScore,
      tags: trend.targetHashtags.map(t => t.replace('#', '')),
      status: 'ready',
      notes: `Trend Fit: ${trend.trendFitScore}%. Velocity: ${trend.velocity}. Hook: ${trend.recommendedHook}`,
      createdAt: 'Just now'
    };

    setIdeasByClient(prev => ({
      ...prev,
      [activeClient.id]: [newVaultItem, ...(prev[activeClient.id] || [])]
    }));
  };

  const handleAddCustomIdea = (idea: Omit<IdeaVaultItem, 'id' | 'createdAt'>) => {
    const newItem: IdeaVaultItem = {
      ...idea,
      id: `custom_idea_${Date.now()}`,
      createdAt: 'Just now'
    };

    setIdeasByClient(prev => ({
      ...prev,
      [activeClient.id]: [newItem, ...(prev[activeClient.id] || [])]
    }));
  };

  const handleTriggerCoach = (prompt: string) => {
    setCoachInitialPrompt(prompt);
    setActiveTab('coach');
  };

  // Confirm video upload on time: resets upload gap, boosts streak and health score
  const handleConfirmUpload = (videoTitle: string, platform: SocialPlatform) => {
    const updatedClient: CreatorClient = {
      ...activeClient,
      lastPostHoursAgo: 1, // just posted
      currentStreakDays: activeClient.currentStreakDays + 1,
      bestStreakDays: Math.max(activeClient.bestStreakDays, activeClient.currentStreakDays + 1),
      streakAtRisk: false,
      growthHealthScore: {
        ...activeClient.growthHealthScore,
        consistency: 98,
        total: 94
      }
    };

    setActiveClient(updatedClient);
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));

    // Schedule next deadline 48 hours later
    setTargetUploadDeadline(new Date(Date.now() + 48 * 60 * 60 * 1000));

    // Add proactive congratulations alert
    const newAlert: ProactiveAlert = {
      id: `alert_upload_${Date.now()}`,
      clientId: activeClient.id,
      type: 'best_time',
      title: `🎉 Upload Confirmed on ${platform.toUpperCase()}`,
      message: `"${videoTitle}" published! Your streak is now ${updatedClient.currentStreakDays} days and algorithmic momentum is secured.`,
      timestamp: 'Just now',
      severity: 'info',
      read: false
    };

    setAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <MobileFrame isDeviceFrame={isMobileDeviceFrame}>
      {/* Top Header */}
      <TopBar
        clients={clients}
        activeClient={activeClient}
        onSelectClient={setActiveClient}
        alerts={alerts.filter(a => a.clientId === activeClient.id)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenVSCodeModal={() => setIsVSCodeModalOpen(true)}
        isMobileDeviceFrame={isMobileDeviceFrame}
        onToggleDeviceFrame={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
        onOpenUploadReminder={() => setIsUploadReminderOpen(true)}
        onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
      />

      {/* Main Screen Content Viewport */}
      <main className="flex-1 pt-3">
        {activeTab === 'monitor' && (
          <MonitorTab
            client={activeClient}
            onNavigate={setActiveTab}
            onTriggerCoachPrompt={handleTriggerCoach}
            targetDeadline={targetUploadDeadline}
            onOpenUploadReminder={() => setIsUploadReminderOpen(true)}
            onQuickUpload={() => setIsUploadReminderOpen(true)}
            onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
          />
        )}

        {activeTab === 'coach' && (
          <CoachTab
            client={activeClient}
            recentTrends={clientTrends}
            retention={clientRetention}
            sentiment={clientSentiment}
            initialPrompt={coachInitialPrompt}
            onClearInitialPrompt={() => setCoachInitialPrompt(undefined)}
            onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
          />
        )}

        {activeTab === 'trends' && (
          <TrendsTab
            client={activeClient}
            trends={clientTrends}
            onAddToVault={handleAddTrendToVault}
            onAskCoachAboutTrend={(trend) => {
              handleTriggerCoach(`Draft a viral hook script and video structure for the trending topic: "${trend.topic}". Hook angle: ${trend.recommendedHook}`);
            }}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab
            client={activeClient}
            retention={clientRetention}
            sentiment={clientSentiment}
            prediction={clientPrediction}
            revenue={clientRevenue}
            onAskCoachAboutDropOff={() => {
              handleTriggerCoach(`My last video had a sharp drop-off at second 18: "${clientRetention.primaryDropReason}". How should I rewrite the first 15 seconds?`);
            }}
          />
        )}

        {activeTab === 'growth_lab' && (
          <GrowthLabTab
            client={activeClient}
            ideas={currentIdeas}
            weeklySchedule={clientSchedule}
            competitors={clientCompetitors}
            collabs={clientCollabs}
            sentiment={clientSentiment}
            onAddCustomIdea={handleAddCustomIdea}
            onAskCoachAboutCollab={(creatorName) => {
              handleTriggerCoach(`Draft a high-conversion DM collaboration pitch to ${creatorName} for ${activeClient.name} (${activeClient.niche})`);
            }}
          />
        )}
      </main>

      {/* Fixed Bottom Tab Bar */}
      <BottomTabBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Proactive Alerts Slide-over Drawer */}
      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts.filter(a => a.clientId === activeClient.id)}
        onMarkRead={handleMarkAlertRead}
        onNavigate={setActiveTab}
      />

      {/* Upload Deadline & Notification Reminder Modal */}
      <UploadReminderModal
        isOpen={isUploadReminderOpen}
        onClose={() => setIsUploadReminderOpen(false)}
        client={activeClient}
        targetDeadline={targetUploadDeadline}
        onUpdateDeadline={setTargetUploadDeadline}
        onConfirmUpload={handleConfirmUpload}
      />

      {/* Gemini Live API Real-Time Voice Conversation Modal (gemini-3.8-live) */}
      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
        client={activeClient}
      />

      {/* VS Code Automatic Connection & Code Export Modal */}
      <VSCodeModal
        isOpen={isVSCodeModalOpen}
        onClose={() => setIsVSCodeModalOpen(false)}
      />
    </MobileFrame>
  );
}
