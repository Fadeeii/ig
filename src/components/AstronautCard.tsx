import React, { useState } from 'react';
import { AstronautProfile } from '../types/telemetry';
import { MapPin, Rocket, Shield, Eye, Maximize2, Sparkles, HeartPulse, HardHat } from 'lucide-react';

interface AstronautCardProps {
  profile: AstronautProfile;
}

export const AstronautCard: React.FC<AstronautCardProps> = ({ profile }) => {
  const [showFullWindowView, setShowFullWindowView] = useState(false);

  return (
    <>
      <div className="space-card rounded-2xl p-5 relative overflow-hidden group">
        {/* Background Subtle Star Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
          {/* Avatar with Glow Ring */}
          <div className="relative group/avatar cursor-pointer" onClick={() => setShowFullWindowView(true)}>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/30 p-0.5 bg-slate-900 shadow-xl shadow-indigo-950/50">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover rounded-[14px] transform transition-transform duration-300 group-hover/avatar:scale-105"
              />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-slate-950 p-1 rounded-lg border-2 border-[#0c1021] text-[10px] font-bold shadow">
              <Sparkles className="w-3 h-3 fill-current" />
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                {profile.callsign}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Suit: {profile.suitId}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              {profile.name}
            </h2>

            <div className="mt-2 space-y-1 text-xs text-slate-300">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-300">
                <Rocket className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="text-slate-400">Mission:</span>
                <span className="font-semibold text-slate-100">{profile.mission}</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-cyan-300">{profile.location}</span>
              </div>
            </div>

            {/* Quick Suit Status Badges */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="bg-[#12182e] p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[9px] uppercase font-mono">Pressure</span>
                <span className="font-mono font-semibold text-slate-200">101.3 kPa</span>
              </div>
              <div className="bg-[#12182e] p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[9px] uppercase font-mono">O₂ Reserve</span>
                <span className="font-mono font-semibold text-emerald-400">8.4 hrs</span>
              </div>
              <div className="bg-[#12182e] p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[9px] uppercase font-mono">Suit Temp</span>
                <span className="font-mono font-semibold text-amber-300">21.5 °C</span>
              </div>
            </div>
          </div>
        </div>

        {/* Porthole View Preview Trigger */}
        <div 
          onClick={() => setShowFullWindowView(true)}
          className="mt-4 rounded-xl overflow-hidden border border-slate-800/80 relative cursor-pointer group/window shadow-inner"
        >
          <img 
            src={profile.portholeImage} 
            alt="Spacecraft Window View" 
            className="w-full h-28 object-cover object-center transform transition-transform duration-500 group-hover/window:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e1b] via-[#0b0e1b]/40 to-transparent flex items-end justify-between p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Lunar Orbit Deck Window</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/80 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-mono">
              <Maximize2 className="w-3 h-3" /> Expand View
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Porthole Modal */}
      {showFullWindowView && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowFullWindowView(false)}>
          <div className="bg-[#0e1428] border border-slate-700 rounded-2xl max-w-4xl w-full p-4 overflow-hidden relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Lunar Orbit Porthole — Crew Cabin 04
                </h3>
              </div>
              <button 
                onClick={() => setShowFullWindowView(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg"
              >
                ✕ Close
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-800">
              <img src={profile.portholeImage} alt="Window view" className="w-full h-auto max-h-[70vh] object-cover" />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Coordinates: 0.6740° N, 23.4720° E</span>
              <span className="text-emerald-400">Cabin Atmosphere: 78% N₂ / 21% O₂</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
