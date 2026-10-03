import React from 'react';
import { HealthStatus, ParameterEvaluations } from '../types/telemetry';
import { ShieldCheck, AlertTriangle, AlertCircle, Sparkles, HeartHandshake } from 'lucide-react';

interface StatusCardProps {
  overallStatus: HealthStatus;
  evaluations: ParameterEvaluations;
}

export const StatusCard: React.FC<StatusCardProps> = ({ overallStatus, evaluations }) => {
  // Determine summary text
  const getSummaryText = () => {
    if (overallStatus === 'CRITICAL') {
      const criticals = Object.values(evaluations).filter(e => e.status === 'CRITICAL');
      return criticals.length > 0
        ? criticals[0].message
        : 'Critical biometric anomaly detected. Immediate review required.';
    }
    if (overallStatus === 'WARNING') {
      const warnings = Object.values(evaluations).filter(e => e.status === 'WARNING');
      return warnings.length > 0
        ? warnings[0].message
        : 'Elevated vitals detected. Monitoring parameter drift.';
    }
    return 'All vital signs are within normal range.';
  };

  return (
    <div className={`space-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
      overallStatus === 'CRITICAL' ? 'border-rose-500/60 bg-gradient-to-br from-[#1a1224] to-[#25121b]' :
      overallStatus === 'WARNING' ? 'border-amber-500/50 bg-gradient-to-br from-[#1b1926] to-[#241c14]' :
      'bg-gradient-to-br from-[#141b30] to-[#121929]'
    }`}>
      {/* Background Accent Glow */}
      <div className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
        overallStatus === 'CRITICAL' ? 'bg-rose-500/20' :
        overallStatus === 'WARNING' ? 'bg-amber-500/20' : 'bg-emerald-500/15'
      }`} />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-300">
              Overall Health Status
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
            AUTO EVALUATED
          </span>
        </div>

        {/* Big Pill Badge */}
        <div className="flex items-center gap-4 my-2">
          {overallStatus === 'NORMAL' && (
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-300 font-extrabold text-base tracking-wide shadow-lg shadow-emerald-950/40 glow-normal">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span>NORMAL</span>
            </div>
          )}

          {overallStatus === 'WARNING' && (
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-amber-500/25 border-2 border-amber-500/50 text-amber-300 font-extrabold text-base tracking-wide shadow-lg shadow-amber-950/40 glow-warning">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />
              <span>WARNING</span>
            </div>
          )}

          {overallStatus === 'CRITICAL' && (
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-rose-500/30 border-2 border-rose-500/60 text-rose-200 font-extrabold text-base tracking-wide shadow-lg shadow-rose-950/60 glow-critical animate-pulse">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>CRITICAL</span>
            </div>
          )}

          {/* Mini Cute Astro Mascot Icon */}
          <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-900/70 border border-slate-800 text-slate-300">
            <span className="text-xl">👩‍🚀</span>
          </div>
        </div>
      </div>

      {/* Subtext description */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
        <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {getSummaryText()}
        </p>
      </div>
    </div>
  );
};
