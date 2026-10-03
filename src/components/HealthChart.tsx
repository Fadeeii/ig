import React, { useState } from 'react';
import { HealthReading } from '../types/telemetry';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { LineChart as ChartIcon, Filter, Layers } from 'lucide-react';

interface HealthChartProps {
  history: HealthReading[];
}

export const HealthChart: React.FC<HealthChartProps> = ({ history }) => {
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'heartRate' | 'oxygenLevel' | 'bodyTemp' | 'activity'>('all');

  // Colors for parameters matching reference aesthetic
  const COLOR_MAP = {
    heartRate: '#f472b6',    // Pink / Coral
    oxygenLevel: '#38bdf8',  // Cyan
    bodyTemp: '#fbbf24',     // Amber
    sleepDuration: '#c084fc',// Purple
    exerciseTime: '#34d399'  // Mint Green
  };

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0e1428]/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono">
          <p className="text-slate-400 font-semibold mb-1.5 pb-1 border-b border-slate-800">
            Time: {label} UTC
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-bold text-slate-100">
                  {entry.value} {
                    entry.dataKey === 'heartRate' ? 'bpm' :
                    entry.dataKey === 'oxygenLevel' ? '%' :
                    entry.dataKey === 'bodyTemp' ? '°C' :
                    entry.dataKey === 'sleepDuration' ? 'hrs' : 'mins'
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-card rounded-2xl p-5 relative overflow-hidden">
      {/* Chart Section Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Health Parameters — Last 30 Minutes
            </h3>
            <p className="text-[11px] text-slate-400">
              Live biometric telemetry streams from suit sensors
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#10162a] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedMetric('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Vitals
          </button>
          <button
            onClick={() => setSelectedMetric('heartRate')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'heartRate'
                ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Heart Rate
          </button>
          <button
            onClick={() => setSelectedMetric('oxygenLevel')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'oxygenLevel'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Oxygen
          </button>
          <button
            onClick={() => setSelectedMetric('bodyTemp')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'bodyTemp'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Temp
          </button>
          <button
            onClick={() => setSelectedMetric('activity')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'activity'
                ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rest & Activity
          </button>
        </div>
      </div>

      {/* Main Responsive Recharts Container */}
      <div className="w-full h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis
              dataKey="timestamp"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingBottom: '10px' }}
            />

            {/* Threshold Reference Lines for Warning Bounds */}
            {selectedMetric === 'heartRate' && (
              <>
                <ReferenceLine y={120} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Critical High (120 bpm)', fill: '#f43f5e', fontSize: 10 }} />
                <ReferenceLine y={50} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Critical Low (50 bpm)', fill: '#f43f5e', fontSize: 10 }} />
              </>
            )}

            {selectedMetric === 'oxygenLevel' && (
              <ReferenceLine y={90} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Critical Low (<90%)', fill: '#f43f5e', fontSize: 10 }} />
            )}

            {selectedMetric === 'bodyTemp' && (
              <>
                <ReferenceLine y={38.0} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Fever Cutoff (38.0°C)', fill: '#f43f5e', fontSize: 10 }} />
                <ReferenceLine y={35.5} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Hypothermia (35.5°C)', fill: '#f43f5e', fontSize: 10 }} />
              </>
            )}

            {/* Lines rendering based on selectedMetric filter */}
            {(selectedMetric === 'all' || selectedMetric === 'heartRate') && (
              <Line
                type="monotone"
                dataKey="heartRate"
                name="Heart Rate (bpm)"
                stroke={COLOR_MAP.heartRate}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: COLOR_MAP.heartRate }}
                isAnimationActive={false}
              />
            )}

            {(selectedMetric === 'all' || selectedMetric === 'oxygenLevel') && (
              <Line
                type="monotone"
                dataKey="oxygenLevel"
                name="Oxygen Level (%)"
                stroke={COLOR_MAP.oxygenLevel}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: COLOR_MAP.oxygenLevel }}
                isAnimationActive={false}
              />
            )}

            {(selectedMetric === 'all' || selectedMetric === 'bodyTemp') && (
              <Line
                type="monotone"
                dataKey="bodyTemp"
                name="Temperature (°C)"
                stroke={COLOR_MAP.bodyTemp}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: COLOR_MAP.bodyTemp }}
                isAnimationActive={false}
              />
            )}

            {(selectedMetric === 'all' || selectedMetric === 'activity') && (
              <Line
                type="monotone"
                dataKey="sleepDuration"
                name="Sleep (hrs)"
                stroke={COLOR_MAP.sleepDuration}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: COLOR_MAP.sleepDuration }}
                isAnimationActive={false}
              />
            )}

            {(selectedMetric === 'all' || selectedMetric === 'activity') && (
              <Line
                type="monotone"
                dataKey="exerciseTime"
                name="Exercise (mins)"
                stroke={COLOR_MAP.exerciseTime}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: COLOR_MAP.exerciseTime }}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
