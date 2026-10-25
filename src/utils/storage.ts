import { AppState, ADPLogEntry, Task } from '../types';

const STORAGE_KEY = 'weekend_90_20lpa_state_v1';

// Seed initial ADP logs so user immediately sees realistic 20-LPA resume bullets
const INITIAL_ADP_LOGS: ADPLogEntry[] = [
  {
    id: 'adp-log-1',
    weekNumber: 1,
    date: '2026-10-16',
    featureOrBug: 'Optimized ADP Payroll Client Processing SQL queries & API response serialization',
    techStack: 'C# .NET Core, SQL Server, Redis',
    used10MinNoAiRule: true,
    rootCauseOrBreakthrough: 'Discovered N+1 database queries inside client deduction loop; replaced with batch bulk select and indexed (ClientId, PayPeriodDate).',
    measurableImpact: 'Reduced p99 batch payroll calculation latency by 68% (from 3.8s to 1.2s) across 12,000 corporate client accounts.',
    generatedResumeBullets: [
      'Engineered high-throughput batch query pipeline in .NET Core & SQL Server, mitigating N+1 query bottlenecks and slashing p99 latency by 68% (3.8s to 1.2s) for 12,000+ enterprise payroll clients.',
      'Architected composite database indexing and caching layer for payroll deduction calculation, reducing database CPU load by 45% during peak bi-weekly processing windows.'
    ],
    createdAt: new Date().toISOString()
  }
];

export const getDefaultState = (): AppState => {
  // Determine if today is Saturday or Sunday
  const dayOfWeek = new Date().getDay();
  const defaultDay = dayOfWeek === 0 ? 'sunday' : 'saturday';

  return {
    currentWeek: 1,
    selectedDay: defaultDay,
    streakCount: 3,
    lastCompletedDate: undefined,
    completedTaskIds: [],
    dopamineShieldStatus: {},
    reflections: {},
    customTasks: {},
    checkedActionItems: {},
    completedSessionKeys: [],
    activeSprintTimer: {
      activeStep: 1,
      b1Seconds: 45 * 60,
      b1Running: false,
      breatherSeconds: 5 * 60,
      breatherRunning: false,
      b2Seconds: 45 * 60,
      b2Running: false,
      ambientType: 'none',
      lastTickTimestamp: Date.now()
    },
    adpLogs: INITIAL_ADP_LOGS,
    theme: 'dark',
    viewMode: 'mobile-shell',
    activeTab: 'plan',
    soundEnabled: true
  };
};

export const loadAppState = (): AppState => {
  if (typeof window === 'undefined') return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    const defaultState = getDefaultState();
    const loadedTimer = {
      ...defaultState.activeSprintTimer!,
      ...(parsed.activeSprintTimer || {})
    };
    if (loadedTimer.activeStep === 0) {
      loadedTimer.activeStep = 1;
    }

    return {
      ...defaultState,
      ...parsed,
      activeSprintTimer: loadedTimer,
      checkedActionItems: parsed.checkedActionItems || {},
      completedSessionKeys: parsed.completedSessionKeys || [],
      customTasks: parsed.customTasks || {},
      reflections: parsed.reflections || {},
      dopamineShieldStatus: parsed.dopamineShieldStatus || {},
      adpLogs: Array.isArray(parsed.adpLogs) && parsed.adpLogs.length > 0 ? parsed.adpLogs : INITIAL_ADP_LOGS
    };
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return getDefaultState();
  }
};

export const saveAppState = (state: AppState): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
};

export const exportAppStateAsJson = (state: AppState): string => {
  return JSON.stringify(state, null, 2);
};

export const importAppStateFromJson = (jsonStr: string): AppState => {
  const parsed = JSON.parse(jsonStr);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON format');
  }
  return { ...getDefaultState(), ...parsed };
};
