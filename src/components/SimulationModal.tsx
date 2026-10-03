import React, { useState } from 'react';
import { HealthReading } from '../types/telemetry';
import { Zap, X, RefreshCw, AlertTriangle, AlertCircle, CheckCircle2, Sliders } from 'lucide-react';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentReading: HealthReading;
  onApplyCustomValues: (values: Partial<HealthReading>) => void;
  onResetBaseline: () => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  currentReading,
  onApplyCustomValues,
  onResetBaseline,
}) => {
  if (!isOpen) return null;

  const [hr, setHr] = useState<number>(currentReading.heartRate);
  const [o2, setO2] = useState<number>(currentReading.oxygenLevel);
  const [temp, setTemp] = useState<number>(currentReading.bodyTemp);

  const handleApplyPreset = (preset: Partial<HealthReading>) => {
    if (preset.heartRate !== undefined) setHr(preset.heartRate);
    if (preset.oxygenLevel !== undefined) setO2(preset.oxygenLevel);
    if (preset.bodyTemp !== undefined) setTemp(preset.bodyTemp);
    onApplyCustomValues(preset);
  };

  const handleApplyManualSliders = () => {
    onApplyCustomValues({
      heartRate: Number(hr),
      oxygenLevel: Number(o2),
      bodyTemp: Number(temp)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="bg-[#0e1428] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide font-mono">
                TELEM-SIMULATOR
              </h3>
              <p className="text-xs text-slate-400">
                Trigger health parameters into warning/critical states for demonstration.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Anomaly Presets */}
        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-2 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            One-Click Critical Presets (🔴 CRITICAL)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleApplyPreset({ oxygenLevel: 87.5 })}
              className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/25 text-rose-200 text-left font-medium transition-all"
            >
              <div className="font-bold flex items-center justify-between">
                <span>📉 Oxygen Drop (Hypoxia)</span>
                <span className="text-[10px] font-mono bg-rose-500/30 px-1.5 py-0.5 rounded">87.5%</span>
              </div>
              <p className="text-[11px] text-rose-300/80 mt-0.5">Triggers CRITICAL status alert (&lt; 90%)</p>
            </button>

            <button
              onClick={() => handleApplyPreset({ heartRate: 128 })}
              className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/25 text-rose-200 text-left font-medium transition-all"
            >
              <div className="font-bold flex items-center justify-between">
                <span>📈 Heart Rate Spike</span>
                <span className="text-[10px] font-mono bg-rose-500/30 px-1.5 py-0.5 rounded">128 bpm</span>
              </div>
              <p className="text-[11px] text-rose-300/80 mt-0.5">Triggers CRITICAL Tachycardia (&gt; 120 bpm)</p>
            </button>

            <button
              onClick={() => handleApplyPreset({ bodyTemp: 38.4 })}
              className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/25 text-rose-200 text-left font-medium transition-all"
            >
              <div className="font-bold flex items-center justify-between">
                <span>🔥 Severe High Fever</span>
                <span className="text-[10px] font-mono bg-rose-500/30 px-1.5 py-0.5 rounded">38.4 °C</span>
              </div>
              <p className="text-[11px] text-rose-300/80 mt-0.5">Triggers CRITICAL Hyperthermia (&gt; 38.0°C)</p>
            </button>

            <button
              onClick={() => handleApplyPreset({ heartRate: 44 })}
              className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/25 text-rose-200 text-left font-medium transition-all"
            >
              <div className="font-bold flex items-center justify-between">
                <span>📉 Heart Rate Drop</span>
                <span className="text-[10px] font-mono bg-rose-500/30 px-1.5 py-0.5 rounded">44 bpm</span>
              </div>
              <p className="text-[11px] text-rose-300/80 mt-0.5">Triggers CRITICAL Bradycardia (&lt; 50 bpm)</p>
            </button>
          </div>
        </div>

        {/* Warning Presets */}
        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-2 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Warning Level Presets (🟡 WARNING)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleApplyPreset({ oxygenLevel: 92.0 })}
              className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-amber-200 text-left font-medium transition-all"
            >
              <div className="font-bold flex items-center justify-between">
                <span>⚠️ Moderate Oxygen Drop</span>
                <span className="text-[10px] font-mono bg-amber-500/30 px-1.5 py-0.5 rounded">92.0%</span>
              </div>
              <p className="text-[11px] text-amber-300/80 mt-0.5">Triggers WARNING state (90–94%)</p>
            </button>

            <button
              onClick={() => handleApplyPreset({ heartRate: 108 })}
              className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-amber-200 text-left font-medium transition-all"
            >
              <div className="font-bold flex items-center justify-between">
                <span>⚠️ Elevated Heart Rate</span>
                <span className="text-[10px] font-mono bg-amber-500/30 px-1.5 py-0.5 rounded">108 bpm</span>
              </div>
              <p className="text-[11px] text-amber-300/80 mt-0.5">Triggers WARNING state (101–120 bpm)</p>
            </button>
          </div>
        </div>

        {/* Manual Sliders */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <span className="text-xs font-semibold text-slate-300 block font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Custom Parameter Fine-Tuning
          </span>

          <div className="space-y-3 bg-[#11172d] p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
            {/* Heart rate slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Heart Rate (bpm)</span>
                <span className="font-bold text-rose-400">{hr} bpm</span>
              </div>
              <input
                type="range"
                min="40"
                max="140"
                value={hr}
                onChange={e => setHr(Number(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Oxygen slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Oxygen Level (%)</span>
                <span className="font-bold text-cyan-400">{o2}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="100"
                step="0.5"
                value={o2}
                onChange={e => setO2(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Body Temp slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Body Temperature (°C)</span>
                <span className="font-bold text-amber-400">{temp} °C</span>
              </div>
              <input
                type="range"
                min="34.5"
                max="39.5"
                step="0.1"
                value={temp}
                onChange={e => setTemp(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={handleApplyManualSliders}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold rounded-lg shadow transition-colors mt-2"
            >
              Apply Slider Readings Now
            </button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              onResetBaseline();
              setHr(74);
              setO2(98.5);
              setTemp(36.6);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Restore Normal Vitals</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
