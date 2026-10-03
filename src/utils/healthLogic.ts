import { HealthReading, HealthStatus, ParameterEvaluation, ParameterEvaluations, Alert } from '../types/telemetry';

export const EVALUATION_RULES = {
  heartRate: {
    criticalHigh: 120,
    criticalLow: 50,
    warningHigh: 101,
    warningLow: 50,
    normalRangeText: 'Normal Range: 60 – 100 bpm',
    unit: 'bpm'
  },
  oxygenLevel: {
    criticalLow: 90,
    warningLow: 90,
    warningHighCutoff: 94,
    normalRangeText: 'Normal Range: 95 – 100 %',
    unit: '%'
  },
  bodyTemp: {
    criticalLow: 35.5,
    criticalHigh: 38.0,
    warningLowCutoff: 35.5,
    warningHighStart: 37.5,
    warningHighEnd: 38.0,
    normalRangeText: 'Normal Range: 36.1 – 37.2 °C',
    unit: '°C'
  },
  sleepDuration: {
    warningLow: 5.5,
    criticalLow: 4.0,
    normalRangeText: 'Recommended: 7.0 – 9.0 hrs',
    unit: 'hrs'
  },
  exerciseTime: {
    warningLow: 25,
    normalRangeText: 'Recommended: 30 – 60 mins',
    unit: 'mins'
  }
};

/** Evaluate Heart Rate parameter */
export function evaluateHeartRate(hr: number): ParameterEvaluation {
  if (hr < 50) {
    return { status: 'CRITICAL', message: `Severe Bradycardia: Heart rate dropped to ${hr} bpm (below 50 bpm)`, isNormal: false };
  }
  if (hr > 120) {
    return { status: 'CRITICAL', message: `Severe Tachycardia: Heart rate elevated to ${hr} bpm (exceeds 120 bpm)`, isNormal: false };
  }
  if (hr >= 50 && hr <= 59) {
    return { status: 'WARNING', message: `Mild Bradycardia: Heart rate at ${hr} bpm (between 50–59 bpm)`, isNormal: false };
  }
  if (hr >= 101 && hr <= 120) {
    return { status: 'WARNING', message: `Elevated Heart Rate: Current ${hr} bpm (between 101–120 bpm)`, isNormal: false };
  }
  return { status: 'NORMAL', message: `Normal heart rate at ${hr} bpm`, isNormal: true };
}

/** Evaluate Oxygen Level parameter */
export function evaluateOxygenLevel(o2: number): ParameterEvaluation {
  if (o2 < 90) {
    return { status: 'CRITICAL', message: `Severe Hypoxia: Oxygen level dropped to ${o2.toFixed(1)}% (below 90%)`, isNormal: false };
  }
  if (o2 >= 90 && o2 <= 94) {
    return { status: 'WARNING', message: `Moderate Hypoxia: Oxygen level at ${o2.toFixed(1)}% (between 90–94%)`, isNormal: false };
  }
  return { status: 'NORMAL', message: `Oxygen level optimal at ${o2.toFixed(1)}%`, isNormal: true };
}

/** Evaluate Body Temperature parameter */
export function evaluateBodyTemp(temp: number): ParameterEvaluation {
  if (temp < 35.5) {
    return { status: 'CRITICAL', message: `Hypothermia Risk: Temperature dropped to ${temp.toFixed(1)}°C (below 35.5°C)`, isNormal: false };
  }
  if (temp > 38.0) {
    return { status: 'CRITICAL', message: `High Fever / Hyperthermia: Temperature elevated to ${temp.toFixed(1)}°C (exceeds 38.0°C)`, isNormal: false };
  }
  if (temp >= 37.3 && temp <= 38.0) {
    return { status: 'WARNING', message: `Low-grade Fever: Temperature at ${temp.toFixed(1)}°C (between 37.3–38.0°C)`, isNormal: false };
  }
  return { status: 'NORMAL', message: `Core temperature stable at ${temp.toFixed(1)}°C`, isNormal: true };
}

/** Evaluate Sleep Duration */
export function evaluateSleep(sleep: number): ParameterEvaluation {
  if (sleep < 4.0) {
    return { status: 'CRITICAL', message: `Severe Sleep Deprivation: Only ${sleep.toFixed(1)} hrs recorded`, isNormal: false };
  }
  if (sleep < 5.5) {
    return { status: 'WARNING', message: `Insufficient Rest: ${sleep.toFixed(1)} hrs recorded`, isNormal: false };
  }
  return { status: 'NORMAL', message: `Restful sleep recorded (${sleep.toFixed(1)} hrs)`, isNormal: true };
}

/** Evaluate Exercise Time */
export function evaluateExercise(mins: number): ParameterEvaluation {
  if (mins < 20) {
    return { status: 'WARNING', message: `Cardiovascular regimen under recommended target (${mins} mins)`, isNormal: false };
  }
  return { status: 'NORMAL', message: `Exercise target achieved (${mins} mins)`, isNormal: true };
}

/** Evaluate all 5 parameters */
export function evaluateAllParameters(reading: HealthReading): ParameterEvaluations {
  return {
    heartRate: evaluateHeartRate(reading.heartRate),
    oxygenLevel: evaluateOxygenLevel(reading.oxygenLevel),
    bodyTemp: evaluateBodyTemp(reading.bodyTemp),
    sleepDuration: evaluateSleep(reading.sleepDuration),
    exerciseTime: evaluateExercise(reading.exerciseTime)
  };
}

/** Get overall health status (CRITICAL > WARNING > NORMAL) */
export function getOverallStatus(evaluations: ParameterEvaluations): HealthStatus {
  const statuses = [
    evaluations.heartRate.status,
    evaluations.oxygenLevel.status,
    evaluations.bodyTemp.status,
    evaluations.sleepDuration.status,
    evaluations.exerciseTime.status
  ];

  if (statuses.includes('CRITICAL')) return 'CRITICAL';
  if (statuses.includes('WARNING')) return 'WARNING';
  return 'NORMAL';
}

/** Generate realistic next reading with gradual random walk */
export function generateNextReading(prev: HealthReading, forceSimulation?: Partial<HealthReading>): HealthReading {
  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (forceSimulation) {
    return {
      timestamp,
      heartRate: forceSimulation.heartRate ?? prev.heartRate,
      oxygenLevel: forceSimulation.oxygenLevel ?? prev.oxygenLevel,
      bodyTemp: forceSimulation.bodyTemp ?? prev.bodyTemp,
      sleepDuration: forceSimulation.sleepDuration ?? prev.sleepDuration,
      exerciseTime: forceSimulation.exerciseTime ?? prev.exerciseTime,
    };
  }

  // Gradual random walk for natural variations
  // Heart rate fluctuates around 65-85 bpm
  let hr = prev.heartRate + (Math.random() * 2.4 - 1.2);
  // If HR went far from normal range without simulation, nudge back towards 74
  if (prev.heartRate < 60 || prev.heartRate > 95) {
    hr += (74 - prev.heartRate) * 0.15;
  }
  hr = Math.min(135, Math.max(42, Math.round(hr)));

  // Oxygen fluctuates around 97-99%
  let o2 = prev.oxygenLevel + (Math.random() * 0.4 - 0.2);
  if (prev.oxygenLevel < 94) {
    o2 += (98 - prev.oxygenLevel) * 0.1;
  }
  o2 = Math.min(100, Math.max(82, parseFloat(o2.toFixed(1))));

  // Temperature fluctuates around 36.4-37.0 °C
  let temp = prev.bodyTemp + (Math.random() * 0.06 - 0.03);
  if (prev.bodyTemp < 36.0 || prev.bodyTemp > 37.4) {
    temp += (36.6 - prev.bodyTemp) * 0.1;
  }
  temp = Math.min(39.2, Math.max(34.8, parseFloat(temp.toFixed(1))));

  // Sleep duration remains relatively stable
  let sleep = prev.sleepDuration;

  // Exercise time gradually increases during mission (+1 min every 10 updates if under 55)
  let exercise = prev.exerciseTime;
  if (Math.random() > 0.7 && exercise < 60) {
    exercise += 1;
  }

  return {
    timestamp,
    heartRate: hr,
    oxygenLevel: o2,
    bodyTemp: temp,
    sleepDuration: parseFloat(sleep.toFixed(1)),
    exerciseTime: Math.round(exercise)
  };
}

/** Initial historical readings generator for the chart */
export function generateInitialHistory(count = 20): HealthReading[] {
  const history: HealthReading[] = [];
  const baseTime = new Date();
  
  let currentHR = 74;
  let currentO2 = 98.2;
  let currentTemp = 36.6;
  let currentSleep = 6.8;
  let currentExercise = 42;

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(baseTime.getTime() - i * 60 * 1000);
    const timestamp = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    currentHR = Math.min(88, Math.max(62, Math.round(currentHR + (Math.random() * 3 - 1.5))));
    currentO2 = Math.min(100, Math.max(96, parseFloat((currentO2 + (Math.random() * 0.4 - 0.2)).toFixed(1))));
    currentTemp = Math.min(37.1, Math.max(36.3, parseFloat((currentTemp + (Math.random() * 0.04 - 0.02)).toFixed(1))));

    history.push({
      timestamp,
      heartRate: currentHR,
      oxygenLevel: currentO2,
      bodyTemp: currentTemp,
      sleepDuration: currentSleep,
      exerciseTime: currentExercise
    });
  }

  return history;
}

/** Create alert objects when parameter is out of normal range & resolve when returned to normal */
export function checkAndCreateAlerts(
  reading: HealthReading, 
  evaluations: ParameterEvaluations, 
  existingAlerts: Alert[]
): Alert[] {
  let updatedAlerts: Alert[] = [...existingAlerts];
  const timestamp = reading.timestamp;

  const checkParam = (
    key: 'heartRate' | 'oxygenLevel' | 'bodyTemp' | 'sleepDuration' | 'exerciseTime',
    paramName: string,
    val: number,
    unit: string,
    evaluation: ParameterEvaluation
  ) => {
    if (!evaluation.isNormal) {
      // Check if alert already exists recently for this parameter to prevent duplications
      const existsRecent = updatedAlerts.some(
        a => a.parameterKey === key && !a.acknowledged && a.severity === evaluation.status
      );

      if (!existsRecent) {
        updatedAlerts.unshift({
          id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp,
          parameter: paramName,
          parameterKey: key,
          value: val,
          unit,
          severity: evaluation.status as 'WARNING' | 'CRITICAL',
          message: evaluation.message,
          acknowledged: false
        });
      }
    } else {
      // Parameter returned to normal range: resolve/clear active unacknowledged alert for this parameter
      updatedAlerts = updatedAlerts.map(a => 
        (a.parameterKey === key && !a.acknowledged) ? { ...a, acknowledged: true } : a
      );
    }
  };

  checkParam('heartRate', 'Heart Rate', reading.heartRate, 'bpm', evaluations.heartRate);
  checkParam('oxygenLevel', 'Oxygen Level', reading.oxygenLevel, '%', evaluations.oxygenLevel);
  checkParam('bodyTemp', 'Body Temperature', reading.bodyTemp, '°C', evaluations.bodyTemp);
  checkParam('sleepDuration', 'Sleep Duration', reading.sleepDuration, 'hrs', evaluations.sleepDuration);

  // Keep last 15 alerts max
  return updatedAlerts.slice(0, 15);
}
