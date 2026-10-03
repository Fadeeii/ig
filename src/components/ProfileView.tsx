import React from 'react';
import { AstronautProfile, HealthReading } from '../types/telemetry';
import { User, Shield, Award, Heart, Activity, FileText, Cpu, Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface ProfileViewProps {
  profile: AstronautProfile;
  currentReading: HealthReading;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, currentReading }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner & Header */}
      <div className="space-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-2xl shadow-indigo-950/60"
            />
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full text-xs font-extrabold border-2 border-[#0c1021] font-mono">
              ACTIVE EVA
            </span>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs border border-indigo-500/30 font-semibold">
                {profile.callsign}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs border border-purple-500/30">
                Blood: {profile.bloodType}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30">
                Age: {profile.age}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {profile.name}
            </h2>

            <p className="text-sm text-slate-300 font-medium max-w-xl">
              Chief Mission Specialist & Astro-Botanist assigned to the Lunar Orbit Gateway. Specializing in long-duration physiological adaptions in zero-gravity environments.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-slate-400">
              <span>Mission: <strong className="text-slate-200">{profile.mission}</strong></span>
              <span>•</span>
              <span>Spacecraft: <strong className="text-cyan-300">{profile.spacecraft}</strong></span>
              <span>•</span>
              <span>Suit ID: <strong className="text-purple-300">{profile.suitId}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Medical History & Telemetry Baseline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Physiological Profile Card */}
        <div className="space-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Heart className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Biometric Baseline Parameters
            </h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#12182e] border border-slate-800">
              <span className="text-slate-400">Resting Heart Rate</span>
              <span className="font-bold text-rose-300">68 bpm (Normal)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#12182e] border border-slate-800">
              <span className="text-slate-400">VO2 Max Capacity</span>
              <span className="font-bold text-cyan-300">54.2 mL/kg/min</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#12182e] border border-slate-800">
              <span className="text-slate-400">Baseline Core Temp</span>
              <span className="font-bold text-amber-300">36.6 °C</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#12182e] border border-slate-800">
              <span className="text-slate-400">Blood Pressure Baseline</span>
              <span className="font-bold text-emerald-300">118 / 76 mmHg</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#12182e] border border-slate-800">
              <span className="text-slate-400">Bone Density Retention</span>
              <span className="font-bold text-purple-300">98.4% (Optimal)</span>
            </div>
          </div>
        </div>

        {/* EVA & Mission Log Summary */}
        <div className="space-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              EVA Suit Telemetry Overview
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#12182e] border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-200">Suit Model EVA-772 Mk IV</p>
                <p className="text-[11px] text-slate-400">Primary Oxygen Scrubber Active</p>
              </div>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[10px] font-bold">
                100% OPERATIONAL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="p-2.5 rounded-xl bg-[#12182e] border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">Total Spacewalks</span>
                <span className="text-lg font-bold text-white">4 EVAs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#12182e] border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">Cumulative EVA Time</span>
                <span className="text-lg font-bold text-cyan-300">26.4 hrs</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#12182e] border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-300 font-mono">
                <span>Suit Power Pack</span>
                <span className="font-bold text-emerald-400">94% (Li-Air)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[94%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
