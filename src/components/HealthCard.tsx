import React from 'react';
import { ParameterEvaluation } from '../types/telemetry';
import { Heart, Activity, Thermometer, Moon, Zap, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface HealthCardProps {
  type: 'heartRate' | 'oxygenLevel' | 'bodyTemp' | 'sleepDuration' | 'exerciseTime';
  title: string;
  value: number;
  unit: string;
  evaluation: ParameterEvaluation;
  rangeText: string;
  historyValues: number[];
}

export const HealthCard: React.FC<HealthCardProps> = ({
  type,
  title,
  value,
  unit,
  evaluation,
  rangeText,
  historyValues
}) => {
  // Styling maps based on parameter type
  const styleConfig = {
    heartRate: {
      icon: Heart,
      accentColor: '#f472b6', // Pink
      strokeColor: '#f43f5e',
      bgGlow: 'from-rose-500/10 to-pink-500/5',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      iconAnim: evaluation.status !== 'NORMAL' ? 'animate-bounce' : 'animate-heart-beat'
    },
    oxygenLevel: {
      icon: Activity,
      accentColor: '#38bdf8', // Cyan
      strokeColor: '#0284c7',
      bgGlow: 'from-sky-500/10 to-cyan-500/5',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      iconAnim: ''
    },
    bodyTemp: {
      icon: Thermometer,
      accentColor: '#fbbf24', // Amber
      strokeColor: '#d97706',
      bgGlow: 'from-amber-500/10 to-yellow-500/5',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      iconAnim: ''
    },
    sleepDuration: {
      icon: Moon,
      accentColor: '#c084fc', // Purple
      strokeColor: '#9333ea',
      bgGlow: 'from-purple-500/10 to-indigo-500/5',
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      iconAnim: ''
    },
    exerciseTime: {
      icon: Zap,
      accentColor: '#34d399', // Emerald
      strokeColor: '#059669',
      bgGlow: 'from-emerald-500/10 to-teal-500/5',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      iconAnim: ''
    }
  };

  const config = styleConfig[type];
  const IconComponent = config.icon;

  // Generate SVG Sparkline Path
  const generateSparklinePath = (vals: number[], width = 180, height = 36) => {
    if (!vals || vals.length === 0) return '';
    const min = Math.min(...vals) - 1;
    const max = Math.max(...vals) + 1;
    const range = max - min || 1;
    const step = width / Math.max(1, vals.length - 1);

    const points = vals.map((v, idx) => {
      const x = idx * step;
      const y = height - ((v - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const sparklinePath = generateSparklinePath(historyValues.slice(-15));

  // Status Badge formatting
  const getStatusBadge = () => {
    if (evaluation.status === 'CRITICAL') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
          <AlertCircle className="w-3 h-3 text-rose-400" />
          CRITICAL
        </span>
      );
    }
    if (evaluation.status === 'WARNING') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          WARNING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        NORMAL
      </span>
    );
  };

  return (
    <div className={`space-card space-card-hover rounded-2xl p-4.5 relative overflow-hidden flex flex-col justify-between ${
      evaluation.status === 'CRITICAL' ? 'border-rose-500/50 glow-critical' :
      evaluation.status === 'WARNING' ? 'border-amber-500/40 glow-warning' : ''
    }`}>
      {/* Background Accent Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.bgGlow} rounded-full blur-2xl pointer-events-none`} />

      <div>
        {/* Card Header: Icon, Title, Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner ${config.iconBg}`}>
              <IconComponent className={`w-5 h-5 ${config.iconAnim}`} />
            </div>
            <span className="text-xs lg:text-sm font-semibold text-slate-300">
              {title}
            </span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Value Display */}
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight transition-all duration-300">
            {typeof value === 'number' ? (type === 'bodyTemp' || type === 'sleepDuration' ? value.toFixed(1) : value) : value}
          </span>
          <span className="text-xs font-semibold text-slate-400 font-mono">
            {unit}
          </span>
        </div>
      </div>

      {/* Mini Trend Sparkline SVG */}
      <div className="my-3 py-1">
        <div className="w-full h-9 overflow-hidden flex items-center">
          <svg className="w-full h-9" viewBox="0 0 180 36" preserveAspectRatio="none">
            {/* Sparkline Gradient fill */}
            <defs>
              <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.accentColor} stopOpacity="0.35" />
                <stop offset="100%" stopColor={config.accentColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {sparklinePath && (
              <>
                <path
                  d={`${sparklinePath} L 180,36 L 0,36 Z`}
                  fill={`url(#grad-${type})`}
                />
                <path
                  d={sparklinePath}
                  fill="none"
                  stroke={config.accentColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Range Footnote */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>{rangeText}</span>
        {evaluation.status !== 'NORMAL' && (
          <span className="text-[10px] text-rose-400 font-mono truncate max-w-[120px]" title={evaluation.message}>
            {evaluation.status}
          </span>
        )}
      </div>
    </div>
  );
};
