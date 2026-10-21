import React from 'react';
import { Activity, MessageSquareQuote, Flame, LineChart, Sparkles } from 'lucide-react';

export type TabKey = 'monitor' | 'coach' | 'trends' | 'analytics' | 'growth_lab';

interface BottomTabBarProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
  isAiSpeaking?: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onChangeTab,
  isAiSpeaking = false
}) => {
  const tabs = [
    {
      key: 'monitor' as TabKey,
      label: 'Monitor',
      icon: Activity,
      badge: 'Live'
    },
    {
      key: 'coach' as TabKey,
      label: 'AI Coach',
      icon: MessageSquareQuote,
      isSpecial: true
    },
    {
      key: 'trends' as TabKey,
      label: 'Trends',
      icon: Flame,
      badge: 'New'
    },
    {
      key: 'analytics' as TabKey,
      label: 'Analytics',
      icon: LineChart
    },
    {
      key: 'growth_lab' as TabKey,
      label: 'Growth Lab',
      icon: Sparkles
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 pb-safe">
      <div className="max-w-md md:max-w-xl mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          if (tab.isSpecial) {
            return (
              <button
                key={tab.key}
                onClick={() => onChangeTab(tab.key)}
                className="relative flex flex-col items-center justify-center -top-3 focus:outline-none min-h-[48px] group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                    isActive
                      ? 'bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-indigo-500/30 ring-2 ring-indigo-400'
                      : 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-slate-900/40 group-hover:bg-slate-700'
                  } ${isAiSpeaking ? 'animate-pulse ring-2 ring-emerald-400' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-medium tracking-tight mt-1 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className="flex flex-col items-center justify-center h-full min-h-[44px] py-1 text-slate-400 hover:text-slate-200 transition-colors relative"
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-indigo-400 scale-110' : 'text-slate-400'}`} />
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-2 text-[8px] font-bold px-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-tight mt-1 ${isActive ? 'text-white font-semibold' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
