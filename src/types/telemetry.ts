export type HealthStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';

export interface HealthReading {
  timestamp: string;
  heartRate: number;
  oxygenLevel: number;
  bodyTemp: number;
  sleepDuration: number;
  exerciseTime: number;
}

export interface ParameterEvaluation {
  status: HealthStatus;
  message: string;
  isNormal: boolean;
}

export interface ParameterEvaluations {
  heartRate: ParameterEvaluation;
  oxygenLevel: ParameterEvaluation;
  bodyTemp: ParameterEvaluation;
  sleepDuration: ParameterEvaluation;
  exerciseTime: ParameterEvaluation;
}

export interface Alert {
  id: string;
  timestamp: string;
  parameter: string;
  parameterKey: 'heartRate' | 'oxygenLevel' | 'bodyTemp' | 'sleepDuration' | 'exerciseTime';
  value: number;
  unit: string;
  severity: 'WARNING' | 'CRITICAL';
  message: string;
  acknowledged: boolean;
}

export interface AstronautProfile {
  name: string;
  callsign: string;
  mission: string;
  location: string;
  spacecraft: string;
  missionDay: number;
  suitId: string;
  bloodType: string;
  age: number;
  avatar: string;
  portholeImage: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  category: 'TELEMETRY' | 'SUIT' | 'CABIN' | 'MEDICAL' | 'SYSTEM';
  level: 'INFO' | 'WARN' | 'CRITICAL';
  message: string;
}
