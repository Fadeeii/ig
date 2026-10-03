import React, { useState } from 'react';
import { HealthReading } from '../types/telemetry';
import { Settings, Volume2, VolumeX, Download, Sliders, RefreshCw, Shield, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  updateIntervalSec: number;
  setUpdateIntervalSec: (sec: number) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  history: HealthReading[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  updateIntervalSec,
  setUpdateIntervalSec,
  audioEnabled,
  setAudioEnabled,
  history,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `telemetry_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Settings Header */}
      <div className="space-card rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide font-mono">
              Telemetry System Settings
            </h2>
            <p className="text-xs text-slate-400">
              Configure stream update intervals, sound notifications, and export telemetry logs.
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stream & Audio Controls */}
        <div className="space-card rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Live Data Stream Frequency
          </h3>

          <div className="space-y-3">
            <label className="text-xs text-slate-300 block">
              Telemetry Refresh Rate:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {[1, 3, 5].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setUpdateIntervalSec(sec)}
                  className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                    updateIntervalSec === sec
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                      : 'bg-[#12182e] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sec}s Interval
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Currently streaming new biometric reading every <strong className="text-indigo-300">{updateIntervalSec} seconds</strong>.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {audioEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <span className="text-xs font-semibold text-slate-200">
                  Audio Alert Beep
                </span>
              </div>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  audioEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    audioEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Play soft space telemetry tone when warning or critical parameter is detected.
            </p>
          </div>
        </div>

        {/* Data Export & Backup */}
        <div className="space-card rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <Download className="w-4 h-4 text-purple-400" />
              Telemetry Export & Backup
            </h3>

            <p className="text-xs text-slate-300 mt-3">
              Export recorded telemetry buffer ({history.length} data points) for mission analysis or medical review.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExportJSON}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Telemetry (JSON)</span>
            </button>

            {downloadSuccess && (
              <p className="text-[11px] text-emerald-400 text-center font-mono flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Exported successfully!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Threshold Reference Rule Sheet */}
      <div className="space-card rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Configured Medical Evaluation Threshold Rules
        </h3>

        <div className="overflow-x-auto text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2 px-3">Parameter</th>
                <th className="py-2 px-3">Normal Bound (🟢)</th>
                <th className="py-2 px-3">Warning Bound (🟡)</th>
                <th className="py-2 px-3">Critical Threshold (🔴)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2 px-3 font-semibold text-rose-300">Heart Rate</td>
                <td className="py-2 px-3">60 – 100 bpm</td>
                <td className="py-2 px-3">50–59 or 101–120 bpm</td>
                <td className="py-2 px-3 text-rose-400 font-bold">&lt; 50 or &gt; 120 bpm</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-cyan-300">Oxygen Level</td>
                <td className="py-2 px-3">95 – 100 %</td>
                <td className="py-2 px-3">90 – 94 %</td>
                <td className="py-2 px-3 text-rose-400 font-bold">&lt; 90 %</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-amber-300">Body Temperature</td>
                <td className="py-2 px-3">36.1 – 37.2 °C</td>
                <td className="py-2 px-3">37.5 – 38.0 °C</td>
                <td className="py-2 px-3 text-rose-400 font-bold">&lt; 35.5 or &gt; 38.0 °C</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-purple-300">Sleep Duration</td>
                <td className="py-2 px-3">7.0 – 9.0 hrs</td>
                <td className="py-2 px-3">4.0 – 5.5 hrs</td>
                <td className="py-2 px-3 text-rose-400 font-bold">&lt; 4.0 hrs</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-emerald-300">Exercise Time</td>
                <td className="py-2 px-3">30 – 60 mins</td>
                <td className="py-2 px-3">&lt; 25 mins</td>
                <td className="py-2 px-3 text-rose-400 font-bold">&lt; 15 mins</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
