import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AstronautCard } from './components/AstronautCard';
import { HealthCard } from './components/HealthCard';
import { StatusCard } from './components/StatusCard';
import { AlertPanel } from './components/AlertPanel';
import { HealthChart } from './components/HealthChart';
import { SimulationModal } from './components/SimulationModal';
import { ProfileView } from './components/ProfileView';
import { MissionLogView } from './components/MissionLogView';
import { SettingsView } from './components/SettingsView';

import {
  HealthReading,
  AstronautProfile,
  Alert,
  LogEntry
} from './types/telemetry';

import {
  evaluateAllParameters,
  getOverallStatus,
  generateNextReading,
  generateInitialHistory,
  checkAndCreateAlerts,
  EVALUATION_RULES
} from './utils/healthLogic';

export function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Astronaut Profile Data
  const [profile] = useState<AstronautProfile>({
    name: 'Aisha Rahman',
    callsign: 'Starling-1',
    mission: 'Lunar Research Mission',
    location: 'Lunar Orbit',
    spacecraft: 'Artemis Gateway-IV',
    missionDay: 42,
    suitId: 'EVA-772',
    bloodType: 'O Negative',
    age: 31,
    avatar: '/assets/aisha_avatar.jpg',
    portholeImage: '/assets/astronaut_window.jpg'
  });

  // Current Health Telemetry Reading
  const [reading, setReading] = useState<HealthReading>({
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    heartRate: 74,
    oxygenLevel: 98.2,
    bodyTemp: 36.6,
    sleepDuration: 6.8,
    exerciseTime: 42
  });

  // Telemetry History Buffer (for Line Chart)
  const [history, setHistory] = useState<HealthReading[]>(() => generateInitialHistory(20));

  // Alerts state
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Telemetry event log
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '14:20:00', category: 'SYSTEM', level: 'INFO', message: 'Telemetry link established with Artemis Gateway-IV.' },
    { id: '2', timestamp: '14:22:15', category: 'SUIT', level: 'INFO', message: 'EVA-772 suit internal atmosphere pressurized to 101.3 kPa.' },
    { id: '3', timestamp: '14:25:30', category: 'TELEMETRY', level: 'INFO', message: 'Biometric telemetry stream initialized. All vital baseline optimal.' }
  ]);

  // Settings & Controls
  const [updateIntervalSec, setUpdateIntervalSec] = useState<number>(3);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isSimModalOpen, setIsSimModalOpen] = useState<boolean>(false);
  const [simulationOverride, setSimulationOverride] = useState<Partial<HealthReading> | null>(null);

  // Web Audio Context for space beep
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSpaceBeep = (isCritical = false) => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isCritical ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isCritical ? 880 : 587.33, ctx.currentTime); // A5 or D5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio play silently ignored if blocked by browser policy
    }
  };

  // Evaluate current parameters
  const evaluations = evaluateAllParameters(reading);
  const overallStatus = getOverallStatus(evaluations);

  // Live Timer Effect (Updates values every few seconds!)
  useEffect(() => {
    const timer = setInterval(() => {
      setReading(prev => {
        const next = generateNextReading(prev, simulationOverride || undefined);
        const nextEvaluations = evaluateAllParameters(next);
        const nextStatus = getOverallStatus(nextEvaluations);

        // Update history
        setHistory(prevHist => {
          const updated = [...prevHist, next];
          return updated.slice(-30); // Keep last 30 readings
        });

        // Check for new alerts
        setAlerts(prevAlerts => {
          const newAlerts = checkAndCreateAlerts(next, nextEvaluations, prevAlerts);
          if (newAlerts.length > prevAlerts.length) {
            const newest = newAlerts[0];
            playSpaceBeep(newest.severity === 'CRITICAL');

            // Log event
            setLogs(prevLogs => [
              {
                id: `log-${Date.now()}`,
                timestamp: next.timestamp,
                category: 'MEDICAL',
                level: newest.severity === 'CRITICAL' ? 'CRITICAL' : 'WARN',
                message: newest.message
              },
              ...prevLogs.slice(0, 49)
            ]);
          }
          return newAlerts;
        });

        return next;
      });
    }, updateIntervalSec * 1000);

    return () => clearInterval(timer);
  }, [updateIntervalSec, simulationOverride, audioEnabled]);

  // Alert Handlers
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const handleClearAllAlerts = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
  };

  // Simulation Triggers
  const simTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTimedAlertSimulation = () => {
    // Clear any existing timeout
    if (simTimeoutRef.current) {
      clearTimeout(simTimeoutRef.current);
    }

    // Force Oxygen to 88% (CRITICAL Hypoxia alert)
    const override: Partial<HealthReading> = { oxygenLevel: 88.0 };
    setSimulationOverride(override);

    const immediate = generateNextReading(reading, override);
    const immediateEval = evaluateAllParameters(immediate);

    setReading(immediate);
    setHistory(prev => [...prev, immediate].slice(-30));
    setAlerts(prev => checkAndCreateAlerts(immediate, immediateEval, prev));
    playSpaceBeep(true);

    // Keep abnormal state for 7 seconds, then automatically resume normal simulation
    simTimeoutRef.current = setTimeout(() => {
      setSimulationOverride(null);
    }, 7000);
  };

  const handleSimulatePreset = (type: 'hypoxia' | 'tachycardia' | 'fever' | 'bradycardia' | 'mildHR') => {
    let override: Partial<HealthReading> = {};
    if (type === 'hypoxia') override = { oxygenLevel: 87.5 };
    if (type === 'tachycardia') override = { heartRate: 128 };
    if (type === 'fever') override = { bodyTemp: 38.4 };
    if (type === 'bradycardia') override = { heartRate: 44 };
    if (type === 'mildHR') override = { heartRate: 108 };

    setSimulationOverride(override);

    // Immediately trigger reading update
    const immediate = generateNextReading(reading, override);
    const immediateEval = evaluateAllParameters(immediate);
    setReading(immediate);
    setHistory(prev => [...prev, immediate].slice(-30));
    setAlerts(prev => checkAndCreateAlerts(immediate, immediateEval, prev));
    playSpaceBeep(true);

    // Auto resume after 7 seconds
    if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
    simTimeoutRef.current = setTimeout(() => {
      setSimulationOverride(null);
    }, 7000);
  };

  const handleApplyCustomValues = (values: Partial<HealthReading>) => {
    setSimulationOverride(values);
    const updated = generateNextReading(reading, values);
    const evals = evaluateAllParameters(updated);
    setReading(updated);
    setHistory(prev => [...prev, updated].slice(-30));
    setAlerts(prev => checkAndCreateAlerts(updated, evals, prev));
    playSpaceBeep(evals.heartRate.status !== 'NORMAL' || evals.oxygenLevel.status !== 'NORMAL');
  };

  const handleResetBaseline = () => {
    if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
    setSimulationOverride(null);
    const baseline: HealthReading = {
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      heartRate: 74,
      oxygenLevel: 98.2,
      bodyTemp: 36.6,
      sleepDuration: 6.8,
      exerciseTime: 42
    };
    setReading(baseline);
    setHistory(prev => [...prev, baseline].slice(-30));
    setAlerts([]);
  };

  // History arrays for mini sparklines
  const hrHistory = history.map(h => h.heartRate);
  const o2History = history.map(h => h.oxygenLevel);
  const tempHistory = history.map(h => h.bodyTemp);
  const sleepHistory = history.map(h => h.sleepDuration);
  const exerciseHistory = history.map(h => h.exerciseTime);

  const activeAlertCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-[#0b0e1b] starfield-bg text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        overallStatus={overallStatus}
        alertCount={activeAlertCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header
          missionDay={profile.missionDay}
          onTriggerTimedAlert={handleTimedAlertSimulation}
          onOpenSimulation={() => setIsSimModalOpen(true)}
          onResetBaseline={handleResetBaseline}
          isSimulating={simulationOverride !== null}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Critical Alert Banner if overall status is CRITICAL */}
              {overallStatus === 'CRITICAL' && (
                <div className="p-4 rounded-2xl bg-rose-500/20 border-2 border-rose-500/60 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl glow-critical animate-pulse">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <strong className="font-bold uppercase tracking-wider block font-mono">
                        CRITICAL MEDICAL TELEMETRY ALERT
                      </strong>
                      <span className="text-xs text-rose-200/90">
                        {evaluations.heartRate.status === 'CRITICAL' ? evaluations.heartRate.message :
                         evaluations.oxygenLevel.status === 'CRITICAL' ? evaluations.oxygenLevel.message :
                         evaluations.bodyTemp.status === 'CRITICAL' ? evaluations.bodyTemp.message :
                         evaluations.sleepDuration.status === 'CRITICAL' ? evaluations.sleepDuration.message :
                         'Biometric threshold breached.'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleResetBaseline}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow transition-all flex-shrink-0"
                  >
                    Restore Vitals
                  </button>
                </div>
              )}

              {/* Greeting & Top Cards Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Astronaut Profile Card (Left 5 Cols on desktop) */}
                <div className="lg:col-span-5">
                  <AstronautCard profile={profile} />
                </div>

                {/* Status & Recent Alerts Panel (Right 7 Cols on desktop) */}
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatusCard overallStatus={overallStatus} evaluations={evaluations} />
                  <AlertPanel
                    alerts={alerts}
                    onAcknowledge={handleAcknowledgeAlert}
                    onClearAll={handleClearAllAlerts}
                    onSimulate={handleSimulatePreset}
                  />
                </div>
              </div>

              {/* 5 Health Vital Parameter Cards Grid matching reference layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <HealthCard
                  type="heartRate"
                  title="Heart Rate"
                  value={reading.heartRate}
                  unit="bpm"
                  evaluation={evaluations.heartRate}
                  rangeText={EVALUATION_RULES.heartRate.normalRangeText}
                  historyValues={hrHistory}
                />

                <HealthCard
                  type="oxygenLevel"
                  title="Oxygen Level"
                  value={reading.oxygenLevel}
                  unit="%"
                  evaluation={evaluations.oxygenLevel}
                  rangeText={EVALUATION_RULES.oxygenLevel.normalRangeText}
                  historyValues={o2History}
                />

                <HealthCard
                  type="bodyTemp"
                  title="Body Temperature"
                  value={reading.bodyTemp}
                  unit="°C"
                  evaluation={evaluations.bodyTemp}
                  rangeText={EVALUATION_RULES.bodyTemp.normalRangeText}
                  historyValues={tempHistory}
                />

                <HealthCard
                  type="sleepDuration"
                  title="Sleep Duration"
                  value={reading.sleepDuration}
                  unit="hrs"
                  evaluation={evaluations.sleepDuration}
                  rangeText={EVALUATION_RULES.sleepDuration.normalRangeText}
                  historyValues={sleepHistory}
                />

                <HealthCard
                  type="exerciseTime"
                  title="Exercise Time"
                  value={reading.exerciseTime}
                  unit="mins"
                  evaluation={evaluations.exerciseTime}
                  rangeText={EVALUATION_RULES.exerciseTime.normalRangeText}
                  historyValues={exerciseHistory}
                />
              </div>

              {/* Data Visualization Section — Last 30 Minutes Line Chart */}
              <div>
                <HealthChart history={history} />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <ProfileView profile={profile} currentReading={reading} />
          )}

          {activeTab === 'log' && (
            <MissionLogView logs={logs} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              updateIntervalSec={updateIntervalSec}
              setUpdateIntervalSec={setUpdateIntervalSec}
              audioEnabled={audioEnabled}
              setAudioEnabled={setAudioEnabled}
              history={history}
            />
          )}
        </main>
      </div>

      {/* Simulation Modal Drawer */}
      <SimulationModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        currentReading={reading}
        onApplyCustomValues={handleApplyCustomValues}
        onResetBaseline={handleResetBaseline}
      />
    </div>
  );
}

export default App;
