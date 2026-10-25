import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Check, 
  BrainCircuit, 
  Coffee, 
  Trophy, 
  Send,
  Plus,
  Radio,
  FileCode2,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppState, DayPlan, ActiveSprintTimer } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { sound } from '../utils/sound';

interface SprintDeckViewProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onOpenCustomTaskModal: () => void;
}

const DEFAULT_TIMER: ActiveSprintTimer = {
  activeStep: 1,
  b1Seconds: 45 * 60,
  b1Running: false,
  breatherSeconds: 5 * 60,
  breatherRunning: false,
  b2Seconds: 45 * 60,
  b2Running: false,
  ambientType: 'none',
  lastTickTimestamp: Date.now()
};

export const SprintDeckView: React.FC<SprintDeckViewProps> = ({
  state,
  onUpdateState,
  onOpenCustomTaskModal
}) => {
  const isDark = state.theme === 'dark';
  const isSaturday = state.selectedDay === 'saturday';
  const currentWeekData = CURRICULUM_DATA.find(w => w.weekNumber === state.currentWeek) || CURRICULUM_DATA[0];
  const activePlan: DayPlan = isSaturday ? currentWeekData.saturday : currentWeekData.sunday;

  const dayKey = `week-${state.currentWeek}-${state.selectedDay}`;

  // Active persistent timer state from AppState (guaranteed >= 1)
  const timer = state.activeSprintTimer || DEFAULT_TIMER;
  const activeStep = timer.activeStep === 0 ? 1 : (timer.activeStep || 1);

  // Reflection text
  const [reflectionText, setReflectionText] = useState(state.reflections[dayKey] || '');
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Custom tasks for this day
  const customTasksForDay = state.customTasks[dayKey] || [];

  const updateTimer = (patch: Partial<ActiveSprintTimer>) => {
    onUpdateState(prev => ({
      ...prev,
      activeSprintTimer: {
        ...(prev.activeSprintTimer || DEFAULT_TIMER),
        ...patch,
        lastTickTimestamp: Date.now()
      }
    }));
  };

  const setStep = (step: number) => {
    sound.playTactileClick();
    updateTimer({ activeStep: step });
  };

  const handleToggleTimer = (type: 'b1' | 'breather' | 'b2') => {
    sound.playTactileClick();
    if (type === 'b1') {
      const nextRunning = !timer.b1Running;
      if (nextRunning) sound.playStartChime();
      updateTimer({ b1Running: nextRunning });
    } else if (type === 'breather') {
      const nextRunning = !timer.breatherRunning;
      if (nextRunning) sound.playStartChime();
      updateTimer({ breatherRunning: nextRunning });
    } else if (type === 'b2') {
      const nextRunning = !timer.b2Running;
      if (nextRunning) sound.playStartChime();
      updateTimer({ b2Running: nextRunning });
    }
  };

  const handleResetTimer = (type: 'b1' | 'breather' | 'b2') => {
    sound.playTactileClick();
    if (type === 'b1') {
      updateTimer({ b1Seconds: 45 * 60, b1Running: false });
    } else if (type === 'breather') {
      updateTimer({ breatherSeconds: 5 * 60, breatherRunning: false });
    } else if (type === 'b2') {
      updateTimer({ b2Seconds: 45 * 60, b2Running: false });
    }
  };

  const handleSetAmbient = (type: 'none' | 'binaural' | 'rain' | 'whitenoise') => {
    sound.playTactileClick();
    const nextType = timer.ambientType === type ? 'none' : type;
    updateTimer({ ambientType: nextType });
    if (nextType === 'none') {
      sound.stopAmbient();
    } else {
      sound.startAmbient(nextType);
    }
  };

  const handleToggleChecklist = (taskId: string, itemIndex: number) => {
    sound.playTactileClick();
    onUpdateState(prev => {
      const currentList = prev.checkedActionItems?.[taskId] || [];
      const updated = currentList.includes(itemIndex)
        ? currentList.filter(i => i !== itemIndex)
        : [...currentList, itemIndex];
      return {
        ...prev,
        checkedActionItems: {
          ...prev.checkedActionItems,
          [taskId]: updated
        }
      };
    });
  };

  const handleCompleteBlock = (taskId: string) => {
    sound.playCompletionChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#1D4ED8', '#000000', '#FFFFFF']
    });

    onUpdateState(prev => {
      const isAlready = prev.completedTaskIds.includes(taskId);
      const newIds = isAlready ? prev.completedTaskIds : [...prev.completedTaskIds, taskId];
      
      const b1Id = activePlan.block1Task.id;
      const b2Id = activePlan.block2Task.id;
      const bothDone = newIds.includes(b1Id) && newIds.includes(b2Id);

      const sessionKey = `week-${prev.currentWeek}-${prev.selectedDay}`;
      const sessions = prev.completedSessionKeys || [];
      const alreadyCredited = sessions.includes(sessionKey);

      let newStreak = prev.streakCount;
      let newSessions = sessions;

      if (bothDone && !alreadyCredited) {
        newStreak += 1;
        newSessions = [...sessions, sessionKey];
      }

      return {
        ...prev,
        completedTaskIds: newIds,
        completedSessionKeys: newSessions,
        streakCount: newStreak
      };
    });
  };

  const handleToggleCustomTask = (taskId: string) => {
    sound.playTactileClick();
    onUpdateState(prev => {
      const isDone = prev.completedTaskIds.includes(taskId);
      return {
        ...prev,
        completedTaskIds: isDone
          ? prev.completedTaskIds.filter(id => id !== taskId)
          : [...prev.completedTaskIds, taskId]
      };
    });
  };

  const handleCopyCode = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    sound.playTactileClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveReflection = () => {
    sound.playTactileClick();
    onUpdateState(prev => ({
      ...prev,
      reflections: {
        ...prev.reflections,
        [dayKey]: reflectionText
      }
    }));
    setReflectionSaved(true);
    setTimeout(() => setReflectionSaved(false), 2500);
  };

  const formatMMSS = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isB1Done = state.completedTaskIds.includes(activePlan.block1Task.id);
  const isB2Done = state.completedTaskIds.includes(activePlan.block2Task.id);

  const b1Checked = state.checkedActionItems?.[activePlan.block1Task.id] || [];
  const b2Checked = state.checkedActionItems?.[activePlan.block2Task.id] || [];

  const stepLabels = [
    { id: 1, short: '01 B1', full: '01 // Block 1 (45m)' },
    { id: 2, short: '02 REC', full: '02 // Recess (5m)' },
    { id: 3, short: '03 B2', full: '03 // Block 2 (45m)' },
    { id: 4, short: '04 LOG', full: '04 // Archive' }
  ];

  return (
    <div className="px-3.5 sm:px-6 py-4 pb-36">
      {/* 1. Mobile-Optimized Stepper Station Header */}
      <div className="flex flex-col gap-2.5 mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500">
            {isSaturday ? 'SESSION 01 // SATURDAY' : 'SESSION 02 // SUNDAY'}
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] px-1.5 py-0.2 border border-neutral-300 dark:border-neutral-700 uppercase">
            {activePlan.themeTitle}
          </span>
        </div>
        
        <h2 className={`font-display text-base sm:text-lg font-bold tracking-tight uppercase ${
          isDark ? 'text-white' : 'text-neutral-900'
        }`}>
          90-Minute Focus Station
        </h2>

        {/* Step Tabs with High-Contrast Mobile Inversion */}
        <div className={`grid grid-cols-4 p-0.5 border text-xs font-mono mt-1 ${
          isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-neutral-100'
        }`}>
          {stepLabels.map((s) => {
            const isActive = activeStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`py-2 px-1 text-center text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all min-h-[38px] flex items-center justify-center ${
                  isActive
                    ? isDark
                      ? 'bg-white text-neutral-950 shadow-sm'
                      : 'bg-neutral-950 text-white shadow-sm'
                    : isDark ? 'text-neutral-400 hover:text-white active:text-white' : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                <span className="sm:hidden">{s.short}</span>
                <span className="hidden sm:inline">{s.full}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Step Stage */}
      <AnimatePresence mode="wait">
        {/* STEP 1: BLOCK 1 (45M) */}
        {activeStep === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`border transition-colors ${
              isDark 
                ? 'border-neutral-800 bg-neutral-900/40 text-neutral-100' 
                : 'border-neutral-200 bg-white text-neutral-900 shadow-sm'
            }`}
          >
            {/* Plate Header Bar */}
            <div className={`p-3.5 sm:p-5 border-b flex items-center justify-between gap-2 font-mono ${
              isDark ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-neutral-50'
            }`}>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider ${
                  isDark ? 'border-blue-500/40 bg-blue-950/40 text-blue-300' : 'border-blue-300 bg-blue-50 text-blue-700'
                }`}>
                  B1 // 45M
                </span>
                <span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase">
                  {activePlan.block1Task.difficulty} • {activePlan.block1Task.category.toUpperCase()}
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase">
                {activePlan.block1Task.durationMinutes}m Recall
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <h3 className={`font-display text-base sm:text-xl font-bold tracking-tight mb-1.5 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>
                {activePlan.block1Task.title}
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                {activePlan.block1Task.description}
              </p>

              {/* Architectural Countdown Plate (Ergonomic Mobile Stack) */}
              <div className={`p-4 sm:p-5 border mb-5 font-mono ${
                isDark 
                  ? 'border-neutral-800 bg-black/60' 
                  : 'border-neutral-200 bg-neutral-50'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 block">
                      Execution Countdown // Interval 01
                    </span>
                    <span className={`text-4xl sm:text-5xl font-bold tracking-tight tabular-nums block mt-0.5 ${
                      timer.b1Running ? (isDark ? 'text-white' : 'text-blue-700') : (isDark ? 'text-neutral-300' : 'text-neutral-900')
                    }`}>
                      {formatMMSS(timer.b1Seconds)}
                    </span>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleResetTimer('b1')}
                      title="Reset to 45m"
                      className={`p-3 min-h-[44px] min-w-[44px] border font-mono text-xs flex items-center justify-center transition-colors ${
                        isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white active:bg-neutral-800' : 'border-neutral-300 bg-white text-neutral-700 hover:text-black active:bg-neutral-100'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleTimer('b1')}
                      className={`flex-1 sm:flex-initial py-3 px-5 min-h-[44px] border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        timer.b1Running
                          ? 'border-red-600 bg-red-600 text-white'
                          : isDark
                            ? 'border-white bg-white text-neutral-950 hover:bg-neutral-200 active:bg-neutral-300'
                            : 'border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 active:bg-neutral-700'
                      }`}
                    >
                      {timer.b1Running ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{timer.b1Running ? 'PAUSE TIMER' : 'START 45M SPRINT'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Ambient Audio Synthesizer (2x2 Grid on Mobile) */}
              <div className={`p-3 border mb-5 font-mono ${
                isDark ? 'border-neutral-800 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-100/60'
              }`}>
                <div className="flex items-center gap-1.5 text-neutral-400 mb-2">
                  <Radio className={`w-3.5 h-3.5 ${timer.ambientType !== 'none' ? 'text-blue-500 animate-pulse' : 'text-neutral-500'}`} />
                  <span className="uppercase text-[10px] tracking-wider">Procedural Synthesizer:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(['none', 'rain', 'binaural', 'whitenoise'] as const).map((type) => {
                    const isSelected = timer.ambientType === type;
                    const label = type === 'none' ? 'MUTE' : type === 'rain' ? 'RAIN' : type === 'binaural' ? '40HZ GAMMA' : 'PINK NOISE';
                    return (
                      <button
                        key={type}
                        onClick={() => handleSetAmbient(type)}
                        className={`py-2 px-2 text-[10px] font-bold border uppercase tracking-wider min-h-[38px] flex items-center justify-center transition-all ${
                          isSelected
                            ? isDark
                              ? 'border-blue-500 bg-blue-600 text-white'
                              : 'border-neutral-950 bg-neutral-950 text-white'
                            : isDark
                              ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white active:bg-neutral-800'
                              : 'border-neutral-300 bg-white text-neutral-600 hover:text-neutral-950 active:bg-neutral-100'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strict No-AI Rule Box */}
              {activePlan.block1Task.noAiPrompt && (
                <div className={`p-3.5 sm:p-4 border mb-5 ${
                  isDark 
                    ? 'border-neutral-800 bg-neutral-950 text-neutral-200' 
                    : 'border-neutral-300 bg-neutral-50 text-neutral-900'
                }`}>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-500 mb-1">
                    <BrainCircuit className="w-4 h-4 shrink-0" />
                    <span>Strict Architectural Recall Rule</span>
                  </div>
                  <p className="text-xs leading-relaxed font-mono select-text text-neutral-400">
                    {activePlan.block1Task.noAiPrompt}
                  </p>
                </div>
              )}

              {/* Action items Checklist (Thumb-Friendly Touch Targets) */}
              <div className="space-y-2 mb-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block">
                  Checklist // Core Milestones
                </span>
                {activePlan.block1Task.actionItems.map((item, idx) => {
                  const isDone = b1Checked.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleChecklist(activePlan.block1Task.id, idx)}
                      className={`p-3 min-h-[46px] border flex items-start gap-3 cursor-pointer text-xs transition-colors active:scale-[0.99] ${
                        isDone
                          ? isDark
                            ? 'border-neutral-800 bg-neutral-950/40 text-neutral-500 line-through'
                            : 'border-neutral-200 bg-neutral-100 text-neutral-500 line-through'
                          : isDark
                            ? 'border-neutral-800 bg-neutral-900/30 text-neutral-200 hover:border-neutral-700'
                            : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className={`w-4 h-4 mt-0.5 shrink-0 flex items-center justify-center border font-mono ${
                        isDone 
                          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black' 
                          : isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-300 bg-white'
                      }`}>
                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs leading-relaxed select-text font-mono flex-1">{item}</span>
                    </div>
                  );
                })}
              </div>

              {/* Code Snippet Plate */}
              {activePlan.block1Task.codeSnippet && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>Blueprint Code</span>
                    </span>
                    <button
                      onClick={() => handleCopyCode(activePlan.block1Task.codeSnippet!)}
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-colors min-h-[32px] flex items-center ${
                        isDark 
                          ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white active:bg-neutral-800' 
                          : 'border-neutral-300 bg-white text-neutral-700 hover:text-black active:bg-neutral-100'
                      }`}
                    >
                      {copiedCode ? 'COPIED ✓' : 'COPY CODE'}
                    </button>
                  </div>
                  <pre className={`p-3.5 border font-mono text-[11px] sm:text-xs overflow-x-auto select-text touch-pan-x ${
                    isDark ? 'border-neutral-800 bg-black text-neutral-200' : 'border-neutral-300 bg-neutral-900 text-neutral-100'
                  }`}>
                    <code>{activePlan.block1Task.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Stage Navigation & Completion Bar */}
              <div className={`pt-4 border-t flex flex-col sm:flex-row items-center gap-2.5 font-mono ${
                isDark ? 'border-neutral-800' : 'border-neutral-200'
              }`}>
                <button
                  onClick={() => handleCompleteBlock(activePlan.block1Task.id)}
                  className={`w-full sm:flex-1 py-3.5 px-4 border text-xs font-bold uppercase tracking-wider min-h-[46px] flex items-center justify-center gap-2 transition-all ${
                    isB1Done
                      ? isDark 
                        ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300' 
                        : 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : isDark
                        ? 'border-white bg-white text-neutral-950 hover:bg-neutral-200 active:bg-neutral-300'
                        : 'border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 active:bg-neutral-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isB1Done ? 'BLOCK 01 ARCHIVED ✓' : 'ARCHIVE BLOCK 01 AS MASTERED'}</span>
                </button>

                <button
                  onClick={() => setStep(2)}
                  className={`w-full sm:w-auto py-3 px-4 border text-xs font-bold uppercase tracking-wider min-h-[44px] flex items-center justify-center gap-1.5 transition-colors ${
                    isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white active:bg-neutral-800' : 'border-neutral-300 bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  <span>PROCEED TO RECESS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: 5-MINUTE RECESS (INTERMISSION) */}
        {activeStep === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`border p-5 sm:p-8 text-center transition-colors ${
              isDark ? 'border-neutral-800 bg-neutral-900/40 text-neutral-100' : 'border-neutral-200 bg-white text-neutral-900'
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center font-mono">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 block">
              Intermission // Cognitive Decompression
            </span>
            <h3 className={`font-display text-lg sm:text-2xl font-bold tracking-tight uppercase mt-0.5 mb-2 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              5-Minute Recess
            </h3>
            <p className={`text-xs sm:text-sm max-w-sm mx-auto mb-5 ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Stand, hydrate, and relax your eyes. Neural consolidation of algorithmic patterns occurs during the refractory period.
            </p>

            {/* Recess Countdown Readout */}
            <div className={`p-5 border max-w-xs mx-auto mb-5 font-mono ${
              isDark ? 'border-neutral-800 bg-black/60' : 'border-neutral-200 bg-neutral-50'
            }`}>
              <span className={`text-4xl font-bold tracking-tight tabular-nums block ${
                isDark ? 'text-white' : 'text-neutral-950'
              }`}>
                {formatMMSS(timer.breatherSeconds)}
              </span>
              <span className="text-[9px] text-neutral-500 uppercase tracking-wider mt-1 block">
                Breathing Cadence: 4s In • 4s Out
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-sm mx-auto font-mono">
              <button
                onClick={() => handleToggleTimer('breather')}
                className={`w-full py-3.5 px-4 min-h-[46px] border text-xs font-bold uppercase tracking-wider ${
                  timer.breatherRunning 
                    ? 'border-red-600 bg-red-600 text-white' 
                    : isDark ? 'border-white bg-white text-neutral-950 active:bg-neutral-200' : 'border-neutral-950 bg-neutral-950 text-white active:bg-neutral-800'
                }`}
              >
                {timer.breatherRunning ? 'PAUSE RECESS' : 'START 5M RECESS'}
              </button>
              <button
                onClick={() => setStep(3)}
                className={`w-full py-3 px-4 min-h-[44px] border text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-300 active:bg-neutral-800' : 'border-neutral-300 bg-neutral-100 text-neutral-700 active:bg-neutral-200'
                }`}
              >
                SKIP TO BLOCK 02 ➔
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: BLOCK 2 (45M) */}
        {activeStep === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`border transition-colors ${
              isDark 
                ? 'border-neutral-800 bg-neutral-900/40 text-neutral-100' 
                : 'border-neutral-200 bg-white text-neutral-900 shadow-sm'
            }`}
          >
            {/* Plate Header Bar */}
            <div className={`p-3.5 sm:p-5 border-b flex items-center justify-between gap-2 font-mono ${
              isDark ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-neutral-50'
            }`}>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider ${
                  isDark ? 'border-blue-500/40 bg-blue-950/40 text-blue-300' : 'border-blue-300 bg-blue-50 text-blue-700'
                }`}>
                  B2 // 45M
                </span>
                <span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase">
                  {activePlan.block2Task.difficulty} • {activePlan.block2Task.category.toUpperCase()}
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase">
                {activePlan.block2Task.durationMinutes}m Systems & AI
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <h3 className={`font-display text-base sm:text-xl font-bold tracking-tight mb-1.5 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>
                {activePlan.block2Task.title}
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                {activePlan.block2Task.description}
              </p>

              {/* Architectural Countdown Plate (Ergonomic Mobile Stack) */}
              <div className={`p-4 sm:p-5 border mb-5 font-mono ${
                isDark 
                  ? 'border-neutral-800 bg-black/60' 
                  : 'border-neutral-200 bg-neutral-50'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 block">
                      Execution Countdown // Interval 02
                    </span>
                    <span className={`text-4xl sm:text-5xl font-bold tracking-tight tabular-nums block mt-0.5 ${
                      timer.b2Running ? (isDark ? 'text-white' : 'text-blue-700') : (isDark ? 'text-neutral-300' : 'text-neutral-900')
                    }`}>
                      {formatMMSS(timer.b2Seconds)}
                    </span>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleResetTimer('b2')}
                      title="Reset to 45m"
                      className={`p-3 min-h-[44px] min-w-[44px] border font-mono text-xs flex items-center justify-center transition-colors ${
                        isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white active:bg-neutral-800' : 'border-neutral-300 bg-white text-neutral-700 hover:text-black active:bg-neutral-100'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleTimer('b2')}
                      className={`flex-1 sm:flex-initial py-3 px-5 min-h-[44px] border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        timer.b2Running
                          ? 'border-red-600 bg-red-600 text-white'
                          : isDark
                            ? 'border-white bg-white text-neutral-950 hover:bg-neutral-200 active:bg-neutral-300'
                            : 'border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 active:bg-neutral-700'
                      }`}
                    >
                      {timer.b2Running ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{timer.b2Running ? 'PAUSE TIMER' : 'START 45M SPRINT'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Strict No-AI / Systems Rule */}
              {activePlan.block2Task.noAiPrompt && (
                <div className={`p-3.5 sm:p-4 border mb-5 ${
                  isDark 
                    ? 'border-neutral-800 bg-neutral-950 text-neutral-200' 
                    : 'border-neutral-300 bg-neutral-50 text-neutral-900'
                }`}>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1">
                    <BrainCircuit className="w-4 h-4 shrink-0" />
                    <span>Architectural Tradeoff Rigor</span>
                  </div>
                  <p className="text-xs leading-relaxed font-mono select-text text-neutral-400">
                    {activePlan.block2Task.noAiPrompt}
                  </p>
                </div>
              )}

              {/* Action items Checklist (Thumb-Friendly Touch Targets) */}
              <div className="space-y-2 mb-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block">
                  Checklist // Systems Execution Steps
                </span>
                {activePlan.block2Task.actionItems.map((item, idx) => {
                  const isDone = b2Checked.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleChecklist(activePlan.block2Task.id, idx)}
                      className={`p-3 min-h-[46px] border flex items-start gap-3 cursor-pointer text-xs transition-colors active:scale-[0.99] ${
                        isDone
                          ? isDark
                            ? 'border-neutral-800 bg-neutral-950/40 text-neutral-500 line-through'
                            : 'border-neutral-200 bg-neutral-100 text-neutral-500 line-through'
                          : isDark
                            ? 'border-neutral-800 bg-neutral-900/30 text-neutral-200 hover:border-neutral-700'
                            : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className={`w-4 h-4 mt-0.5 shrink-0 flex items-center justify-center border font-mono ${
                        isDone 
                          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black' 
                          : isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-300 bg-white'
                      }`}>
                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs leading-relaxed select-text font-mono flex-1">{item}</span>
                    </div>
                  );
                })}
              </div>

              {/* Custom Tasks for this Day */}
              <div className="mt-5 pt-4 border-t border-dashed border-neutral-300 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-2.5 font-mono">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                    Custom Tasks // ({customTasksForDay.length})
                  </span>
                  <button
                    onClick={() => {
                      sound.playTactileClick();
                      onOpenCustomTaskModal();
                    }}
                    className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 px-2.5 py-1.5 min-h-[32px] border transition-colors ${
                      isDark 
                        ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white active:bg-neutral-800' 
                        : 'border-neutral-300 bg-white text-neutral-700 hover:text-black active:bg-neutral-100'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Append Task</span>
                  </button>
                </div>

                {customTasksForDay.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {customTasksForDay.map((ct) => {
                      const isCompleted = state.completedTaskIds.includes(ct.id);
                      return (
                        <div
                          key={ct.id}
                          onClick={() => handleToggleCustomTask(ct.id)}
                          className={`p-3 min-h-[46px] border flex items-center justify-between cursor-pointer text-xs font-mono transition-colors active:scale-[0.99] ${
                            isCompleted
                              ? isDark ? 'border-neutral-800 bg-neutral-950 text-neutral-500 line-through' : 'border-neutral-200 bg-neutral-100 text-neutral-500 line-through'
                              : isDark ? 'border-neutral-800 bg-neutral-900/40 text-neutral-200' : 'border-neutral-200 bg-white text-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 shrink-0 flex items-center justify-center border ${
                              isCompleted ? 'border-white bg-white text-black' : 'border-neutral-600 bg-neutral-800'
                            }`}>
                              {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="font-bold">{ct.title}</span>
                          </div>
                          <span className="text-[9px] uppercase text-neutral-500">Block {ct.blockNumber}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Stage Navigation & Completion Bar */}
              <div className={`pt-4 border-t flex flex-col sm:flex-row items-center gap-2.5 font-mono ${
                isDark ? 'border-neutral-800' : 'border-neutral-200'
              }`}>
                <button
                  onClick={() => handleCompleteBlock(activePlan.block2Task.id)}
                  className={`w-full sm:flex-1 py-3.5 px-4 border text-xs font-bold uppercase tracking-wider min-h-[46px] flex items-center justify-center gap-2 transition-all ${
                    isB2Done
                      ? isDark 
                        ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300' 
                        : 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : isDark
                        ? 'border-white bg-white text-neutral-950 hover:bg-neutral-200 active:bg-neutral-300'
                        : 'border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 active:bg-neutral-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isB2Done ? 'BLOCK 02 ARCHIVED ✓' : 'ARCHIVE BLOCK 02 AS MASTERED'}</span>
                </button>

                <button
                  onClick={() => setStep(4)}
                  className={`w-full sm:w-auto py-3 px-4 border text-xs font-bold uppercase tracking-wider min-h-[44px] flex items-center justify-center gap-1.5 transition-colors ${
                    isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white active:bg-neutral-800' : 'border-neutral-300 bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  <span>RECORD ARCHIVE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: ARCHIVE & REFLECTION LOG */}
        {activeStep === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`border p-4 sm:p-8 transition-colors ${
              isDark ? 'border-neutral-800 bg-neutral-900/40 text-neutral-100' : 'border-neutral-200 bg-white text-neutral-900'
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center font-mono">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 block">
              Exhibit Completed // Sprint Synthesis
            </span>
            <h3 className={`font-display text-lg sm:text-2xl font-bold tracking-tight uppercase mt-0.5 mb-2 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              90-Minute Archival Log
            </h3>
            <p className={`text-xs sm:text-sm max-w-lg mb-5 ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              You executed deliberate, AI-free coding practice. Record your core architectural breakthrough or algorithmic intuition below to solidify retention.
            </p>

            {/* Reflection Plate */}
            <div className={`p-4 border mb-5 font-mono text-xs ${
              isDark ? 'border-neutral-800 bg-black/60' : 'border-neutral-200 bg-neutral-50'
            }`}>
              <span className="text-[10px] uppercase tracking-wider text-amber-500 block mb-1">
                Reflective Inquiry:
              </span>
              <p className={`font-medium mb-2.5 select-text italic text-xs ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                "{activePlan.dailyReflectionPrompt}"
              </p>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Detail the algorithm, locking mechanism, or database indexing pattern coded from pure memory..."
                rows={4}
                className={`w-full p-3 border text-[16px] sm:text-xs font-mono focus:outline-none select-text ${
                  isDark 
                    ? 'border-neutral-800 bg-neutral-950 text-white focus:border-white' 
                    : 'border-neutral-300 bg-white text-neutral-900 focus:border-neutral-950'
                }`}
              />
            </div>

            <button
              onClick={handleSaveReflection}
              className={`w-full py-3.5 px-5 min-h-[48px] border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                reflectionSaved
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : isDark
                    ? 'border-white bg-white text-neutral-950 hover:bg-neutral-200 active:bg-neutral-300'
                    : 'border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 active:bg-neutral-700'
              }`}
            >
              {reflectionSaved ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>{reflectionSaved ? 'SAVED TO ARCHIVAL DOSSIER ✓' : 'SAVE TO CAREER LOG'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
