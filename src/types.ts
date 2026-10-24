export type DayType = 'saturday' | 'sunday';

export type TaskCategory = 'dsa' | 'backend' | 'system-design' | 'applied-ai' | 'custom';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Task {
  id: string;
  day: DayType;
  blockNumber: 1 | 2; // Block 1 (0-45m) or Block 2 (45-90m)
  title: string;
  category: TaskCategory;
  durationMinutes: number;
  difficulty?: Difficulty;
  description: string;
  actionItems: string[];
  noAiPrompt?: string; // Specific instruction on what to write from scratch without AI
  codeSnippet?: string; // Optional starter code or pattern snippet
  referenceLinks?: { title: string; url: string }[];
  completed: boolean;
  notes?: string;
  completedAt?: string;
}

export interface DayPlan {
  day: DayType;
  themeTitle: string;
  themeColor: 'emerald' | 'indigo';
  dopamineShieldCompleted: boolean;
  dailyReflectionPrompt: string;
  reflectionAnswer?: string;
  block1Task: Task;
  block2Task: Task;
  customTasks?: Task[];
}

export interface WeekCurriculum {
  weekNumber: number; // 1 to 16
  phase: 1 | 2 | 3;
  phaseTitle: string;
  phaseSubtitle: string;
  weeklyGoal: string;
  saturday: DayPlan;
  sunday: DayPlan;
}

export interface ADPLogEntry {
  id: string;
  weekNumber: number;
  date: string;
  featureOrBug: string;
  techStack: string; // e.g. React, Redux, C# .NET, SQL Server
  used10MinNoAiRule: boolean;
  rootCauseOrBreakthrough: string;
  measurableImpact: string; // e.g. "Reduced query response from 1.2s to 180ms"
  generatedResumeBullets: string[];
  createdAt: string;
}

export type TimerPhase = 'block1' | 'break' | 'block2' | 'finished';

export interface TimerSession {
  phase: TimerPhase;
  secondsRemaining: number;
  isRunning: boolean;
  totalTime: number; // total for current phase
  activeTaskTitle: string;
  activeTaskId?: string;
  ambientNoise: 'none' | 'whitenoise' | 'binaural' | 'rain';
  soundEnabled: boolean;
}

export interface ActiveSprintTimer {
  activeStep: number; // 0=Shield, 1=B1, 2=Breather, 3=B2, 4=Victory
  b1Seconds: number;
  b1Running: boolean;
  breatherSeconds: number;
  breatherRunning: boolean;
  b2Seconds: number;
  b2Running: boolean;
  ambientType: 'none' | 'binaural' | 'rain' | 'whitenoise';
  lastTickTimestamp?: number;
}

export interface AppState {
  currentWeek: number;
  selectedDay: DayType;
  streakCount: number;
  lastCompletedDate?: string;
  completedTaskIds: string[];
  dopamineShieldStatus: Record<string, boolean>; // key: "week-X-saturday" -> boolean
  reflections: Record<string, string>; // key: "week-X-saturday" -> answer
  customTasks: Record<string, Task[]>; // key: "week-X-saturday" -> Task[]
  checkedActionItems?: Record<string, number[]>; // key: taskId -> checked index array
  completedSessionKeys?: string[]; // key: "week-X-day" for idempotent streaks
  activeSprintTimer?: ActiveSprintTimer;
  adpLogs: ADPLogEntry[];
  theme: 'dark' | 'light';
  viewMode: 'mobile-shell' | 'full-screen';
  activeTab: 'plan' | 'timer' | 'roadmap' | 'adp-log';
  soundEnabled: boolean;
}
