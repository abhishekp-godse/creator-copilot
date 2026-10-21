import React from 'react';
import { X, Clock, Flame, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProactiveAlert } from '../types';
import { TabKey } from './BottomTabBar';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: ProactiveAlert[];
  onMarkRead: (id: string) => void;
  onNavigate: (tab: TabKey) => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkRead,
  onNavigate
}) => {
  if (!isOpen) return null;

  const getAlertIcon = (type: ProactiveAlert['type']) => {
    switch (type) {
      case 'upload_gap':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'best_time':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'streak_risk':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'burnout_warning':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleAction = (alert: ProactiveAlert) => {
    onMarkRead(alert.id);
    if (alert.actionTarget === 'weekly_plan' || alert.actionTarget === 'idea_vault') {
      onNavigate('growth_lab');
    } else if (alert.actionTarget === 'trends') {
      onNavigate('trends');
    } else if (alert.actionTarget === 'coach') {
      onNavigate('coach');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/70">
          <div>
            <h3 className="text-sm font-semibold text-white">Smart Activity & Alerts</h3>
            <p className="text-xs text-slate-400">Proactive client presence notifications</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of alerts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                alert.read
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                  : alert.severity === 'high'
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : 'bg-slate-800/50 border-slate-700/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-white truncate">{alert.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>

                  <div className="flex items-center gap-2 mt-3">
                    {alert.actionText && (
                      <button
                        onClick={() => handleAction(alert)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11px] font-medium transition-colors"
                      >
                        {alert.actionText}
                      </button>
                    )}
                    {!alert.read && (
                      <button
                        onClick={() => onMarkRead(alert.id)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-center">
          <p className="text-[11px] text-slate-400">
            Alerts are evaluated continuously from real-time API feeds and audience engagement velocity.
          </p>
        </div>
      </div>
    </div>
  );
};
