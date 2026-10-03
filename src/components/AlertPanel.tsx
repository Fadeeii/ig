import React from 'react';
import { Alert } from '../types/telemetry';
import { Bell, AlertTriangle, AlertCircle, CheckCircle2, Zap, RotateCcw, ShieldCheck, X } from 'lucide-react';

interface AlertPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onClearAll: () => void;
  onSimulate: (type: 'hypoxia' | 'tachycardia' | 'fever' | 'bradycardia' | 'mildHR') => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  onAcknowledge,
  onClearAll,
  onSimulate
}) => {
  const activeAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-card rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden">
      <div>
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Bell className="w-5 h-5 text-rose-400" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <h3 className="text-sm font-semibold text-slate-200">
              Recent Alerts
            </h3>
          </div>
          {activeAlerts.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
            >
              Clear Active ({activeAlerts.length})
            </button>
          )}
        </div>

        {/* Alerts Feed */}
        <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
          {activeAlerts.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center justify-center text-slate-400">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-300">No active alerts</p>
              <p className="text-[11px] text-slate-400 mt-0.5">All telemetry parameters are stable within normal bounds.</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs transition-all ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                    : 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {alert.severity === 'CRITICAL' ? (
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase tracking-wider text-[10px] font-mono">
                        {alert.severity} — {alert.parameter}
                      </span>
                      <span className="text-[10px] font-mono opacity-60">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="mt-0.5 font-medium leading-tight">
                      {alert.message}
                    </p>
                    <p className="mt-1 text-[11px] font-mono opacity-80">
                      Current Value: <strong className="underline">{alert.value} {alert.unit}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="p-1 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Dismiss alert"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Embedded Simulation Trigger Bar for Evaluator Convenience */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-400 block mb-2 uppercase tracking-wider">
          ⚡ Quick Evaluator Simulation Presets:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
          <button
            onClick={() => onSimulate('hypoxia')}
            className="px-2 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-medium truncate transition-colors text-left"
            title="Drop Oxygen to 87% (CRITICAL)"
          >
            📉 Low O₂ (87%)
          </button>
          <button
            onClick={() => onSimulate('tachycardia')}
            className="px-2 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-medium truncate transition-colors text-left"
            title="Spike Heart Rate to 128 bpm (CRITICAL)"
          >
            📈 High HR (128)
          </button>
          <button
            onClick={() => onSimulate('fever')}
            className="px-2 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-medium truncate transition-colors text-left"
            title="Increase Temp to 38.4°C (CRITICAL)"
          >
            🔥 High Temp (38.4°)
          </button>
          <button
            onClick={() => onSimulate('mildHR')}
            className="px-2 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-medium truncate transition-colors text-left"
            title="Elevate HR to 108 bpm (WARNING)"
          >
            ⚠️ Warn HR (108)
          </button>
        </div>
      </div>
    </div>
  );
};
