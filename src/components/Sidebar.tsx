import React from 'react';
import { Activity, User, ClipboardList, Settings, Rocket, Radio, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  overallStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  overallStatus,
  alertCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Health Monitor', icon: Activity },
    { id: 'profile', label: 'Astronaut Profile', icon: User },
    { id: 'log', label: 'Mission Log', icon: ClipboardList, badge: alertCount > 0 ? alertCount : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 bg-[#0c1021]/90 border-r border-slate-800/80 p-4 flex flex-col justify-between backdrop-blur-xl">
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0e1428] rounded-[11px] flex items-center justify-center">
              <Rocket className="w-5 h-5 text-indigo-400 transform -rotate-45" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-white font-mono">ASTROCARE</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">v2.4</span>
            </div>
            <p className="text-[11px] text-slate-400">Lunar Mission Telemetry</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Connection Status */}
      <div className="mt-8 pt-4 border-t border-slate-800/80 space-y-3">
        {/* System Health Summary pill */}
        <div className="p-3 rounded-xl bg-[#141a33] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300 font-medium">Link Status</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            LIVE 3.2 kb/s
          </span>
        </div>

        {/* Astronaut Avatar mini card */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/50 border border-slate-800/50">
          <img
            src="/assets/aisha_avatar.jpg"
            alt="Aisha Rahman"
            className="w-9 h-9 rounded-full object-cover border border-indigo-500/40"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">Aisha Rahman</p>
            <p className="text-[10px] text-slate-400 truncate">Lunar Orbit • Specialist</p>
          </div>
          <div className={`w-2 h-2 rounded-full ${
            overallStatus === 'CRITICAL' ? 'bg-rose-500 animate-ping' : 
            overallStatus === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-400'
          }`} />
        </div>
      </div>
    </aside>
  );
};
