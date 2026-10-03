import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Orbit, Zap, RefreshCw } from 'lucide-react';

interface HeaderProps {
  missionDay: number;
  onTriggerTimedAlert: () => void;
  onOpenSimulation: () => void;
  onResetBaseline: () => void;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  missionDay,
  onTriggerTimedAlert,
  onOpenSimulation,
  onResetBaseline,
  isSimulating
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dateFormatted = currentTime.toISOString().split('T')[0];
  const timeFormatted = currentTime.toTimeString().split(' ')[0];

  return (
    <header className="w-full bg-[#0c1021]/80 border-b border-slate-800/80 px-4 lg:px-6 py-4 backdrop-blur-md sticky top-0 z-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
              Astronaut Health Monitor
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs lg:text-sm text-slate-400 mt-0.5">
            Live health data for the ongoing space mission.
          </p>
        </div>

        {/* Dynamic Mission Indicators & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mission Day */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#141a33] border border-slate-800 text-xs">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">Mission Day</span>
              <span className="font-bold text-slate-100 font-mono text-sm">Day {String(missionDay).padStart(3, '0')}</span>
            </div>
          </div>

          {/* UTC Clock */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#141a33] border border-slate-800 text-xs">
            <Clock className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">Mission Time (UTC)</span>
              <span className="font-bold text-cyan-300 font-mono text-sm">{dateFormatted} {timeFormatted}</span>
            </div>
          </div>

          {/* Location Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141a33] border border-slate-800 text-xs text-slate-300">
            <Orbit className="w-4 h-4 text-purple-400 animate-spin-slow" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">Location</span>
              <span className="font-semibold text-purple-300">Lunar Orbit</span>
            </div>
          </div>

          {/* Simulation Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerTimedAlert}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white shadow-lg shadow-rose-500/25 transition-all transform active:scale-95 cursor-pointer"
              title="Click to trigger a 7-second critical alert simulation (Oxygen drop to 88%)"
            >
              <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
              <span>Simulate Alert</span>
            </button>

            <button
              onClick={onOpenSimulation}
              className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-1.5"
              title="Open full simulation controls & presets"
            >
              <span>Controls</span>
            </button>

            {isSimulating && (
              <button
                onClick={onResetBaseline}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all"
                title="Reset vitals to normal baseline"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
