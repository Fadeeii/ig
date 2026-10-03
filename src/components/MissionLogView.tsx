import React, { useState } from 'react';
import { LogEntry } from '../types/telemetry';
import { ClipboardList, Filter, ShieldAlert, Info, AlertTriangle, CheckCircle, Radio } from 'lucide-react';

interface MissionLogViewProps {
  logs: LogEntry[];
}

export const MissionLogView: React.FC<MissionLogViewProps> = ({ logs }) => {
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'INFO' | 'WARN' | 'CRITICAL'>('ALL');

  const filteredLogs = logs.filter(log => filterLevel === 'ALL' || log.level === filterLevel);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Environmental Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-card rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Cabin Pressure</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-white font-mono">101.3 kPa</span>
            <span className="text-xs text-emerald-400 font-mono">Optimal</span>
          </div>
        </div>

        <div className="space-card rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Radiation Dose Rate</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-cyan-300 font-mono">0.12 mSv/h</span>
            <span className="text-xs text-cyan-400 font-mono">Safe Bounds</span>
          </div>
        </div>

        <div className="space-card rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">CO₂ Concentration</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-amber-300 font-mono">0.32 %</span>
            <span className="text-xs text-slate-400 font-mono">&lt; 0.50% Target</span>
          </div>
        </div>

        <div className="space-card rounded-2xl p-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Cabin Relative Humidity</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-purple-300 font-mono">44.5 %</span>
            <span className="text-xs text-purple-400 font-mono">Comfortable</span>
          </div>
        </div>
      </div>

      {/* Main Telemetry Event Feed */}
      <div className="space-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Mission Event Telemetry Log
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-[#10162a] p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterLevel('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium ${
                filterLevel === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              All Events ({logs.length})
            </button>
            <button
              onClick={() => setFilterLevel('CRITICAL')}
              className={`px-2.5 py-1 rounded-lg font-medium ${
                filterLevel === 'CRITICAL' ? 'bg-rose-500/30 text-rose-300' : 'text-slate-400'
              }`}
            >
              Critical Only
            </button>
            <button
              onClick={() => setFilterLevel('WARN')}
              className={`px-2.5 py-1 rounded-lg font-medium ${
                filterLevel === 'WARN' ? 'bg-amber-500/30 text-amber-300' : 'text-slate-400'
              }`}
            >
              Warnings
            </button>
          </div>
        </div>

        {/* Log Entries */}
        <div className="space-y-2 font-mono text-xs max-h-[450px] overflow-y-auto pr-1">
          {filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No telemetry events match selected filter criteria.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                  log.level === 'CRITICAL'
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                    : log.level === 'WARN'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-[#12172b] border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {log.level === 'CRITICAL' ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  ) : log.level === 'WARN' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[11px]">[{log.category}]</span>
                      <span className="text-slate-400 text-[10px]">{log.timestamp} UTC</span>
                    </div>
                    <p className="mt-0.5">{log.message}</p>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  log.level === 'CRITICAL' ? 'bg-rose-500/30 text-rose-200' :
                  log.level === 'WARN' ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-400'
                }`}>
                  {log.level}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
