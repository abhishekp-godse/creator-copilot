import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  isDeviceFrame: boolean;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ isDeviceFrame, children }) => {
  if (!isDeviceFrame) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
        <div className="w-full max-w-2xl flex-1 flex flex-col relative px-3 sm:px-4">
          {children}
        </div>
      </div>
    );
  }

  // Mobile Device Frame Mode (Desktop Simulator)
  return (
    <div className="min-h-screen bg-slate-950 py-6 px-4 flex items-center justify-center">
      {/* Phone chassis */}
      <div className="relative w-full max-w-[420px] h-[880px] bg-slate-950 rounded-[50px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] flex flex-col overflow-hidden ring-1 ring-slate-700/60">
        
        {/* Dynamic Island / Hardware notch */}
        <div className="pt-3 px-6 flex items-center justify-between text-[11px] text-slate-400 font-semibold select-none bg-slate-950 z-30 shrink-0">
          <span>9:41</span>
          <div className="w-24 h-5 bg-black rounded-full mx-auto border border-slate-800/80 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* Screen inner viewport */}
        <div className="flex-1 flex flex-col overflow-y-auto relative bg-slate-950 px-3">
          {children}
        </div>

        {/* Home indicator bar */}
        <div className="py-2 flex items-center justify-center bg-slate-950/90 backdrop-blur shrink-0 z-30">
          <div className="w-32 h-1 bg-slate-600/70 rounded-full" />
        </div>
      </div>
    </div>
  );
};
