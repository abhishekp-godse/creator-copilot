import React, { useState } from 'react';
import { Bell, Code2, Smartphone, Monitor as MonitorIcon, ChevronDown, Radio, Clock } from 'lucide-react';
import { CreatorClient, ProactiveAlert } from '../types';

interface TopBarProps {
  clients: CreatorClient[];
  activeClient: CreatorClient;
  onSelectClient: (client: CreatorClient) => void;
  alerts: ProactiveAlert[];
  onOpenAlerts: () => void;
  onOpenVSCodeModal: () => void;
  isMobileDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onOpenUploadReminder: () => void;
  onOpenLiveVoice: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  clients,
  activeClient,
  onSelectClient,
  alerts,
  onOpenAlerts,
  onOpenVSCodeModal,
  isMobileDeviceFrame,
  onToggleDeviceFrame,
  onOpenUploadReminder,
  onOpenLiveVoice
}) => {
  const [clientMenuOpen, setClientMenuOpen] = useState(false);
  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="flex items-center justify-between gap-3 max-w-6xl mx-auto">
        {/* Left: Brand & Client Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
              CP
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-tight text-white">CreatorPilot</span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse" /> Live
                </span>
                <span>·</span>
                <span>AI Growth Coach</span>
              </div>
            </div>
          </div>

          {/* Client Selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setClientMenuOpen(!clientMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors min-h-[40px]"
            >
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${activeClient.avatarColor} text-white text-[11px] font-bold flex items-center justify-center shrink-0`}>
                {activeClient.name.charAt(0)}
              </div>
              <div className="truncate max-w-[110px] sm:max-w-[140px]">
                <div className="text-xs font-semibold text-white truncate">{activeClient.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{activeClient.handle}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {clientMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setClientMenuOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[11px] font-medium text-slate-400 border-b border-slate-800 mb-1">
                    Managed Creator Clients
                  </div>
                  {clients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => {
                        onSelectClient(client);
                        setClientMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                        activeClient.id === client.id
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${client.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {client.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">{client.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{client.niche}</div>
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-slate-400">
                        {(client.totalFollowers / 1000).toFixed(0)}k
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Frame Toggle (hidden on mobile, useful on desktop) */}
          <button
            onClick={onToggleDeviceFrame}
            title={isMobileDeviceFrame ? "Switch to Responsive View" : "Switch to Mobile Device Frame"}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
          >
            {isMobileDeviceFrame ? (
              <>
                <MonitorIcon className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px]">Expanded</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">Mobile Frame</span>
              </>
            )}
          </button>

          {/* Upload Deadline Reminder Quick Trigger */}
          <button
            onClick={onOpenUploadReminder}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-all active:scale-95"
            title="Upload Deadline & Notification Reminder"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Upload Alert</span>
          </button>

          {/* Live Voice Coach Quick Trigger (gemini-3.8-live) */}
          <button
            onClick={onOpenLiveVoice}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-all active:scale-95"
            title="Launch Gemini 3.8 Live Voice Conversation"
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="hidden sm:inline">Live API</span>
          </button>

          {/* VS Code Bridge Button */}
          <button
            onClick={onOpenVSCodeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-300 text-xs font-medium transition-all active:scale-95"
            title="Connect automatically to VS Code & Export"
          >
            <Code2 className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">VS Code</span>
          </button>

          {/* Proactive Notification Bell */}
          <button
            onClick={onOpenAlerts}
            className="relative w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
