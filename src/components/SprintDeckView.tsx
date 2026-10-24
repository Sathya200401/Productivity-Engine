import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Check, 
  Code, 
  BrainCircuit, 
  Waves, 
  CloudRain, 
  Radio, 
  Send, 
  Zap, 
  Coffee, 
  Trophy,
  Plus,
  VolumeX,
  Volume2
} from 'lucide-react';
import { AppState, DayPlan, Task, ActiveSprintTimer } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface SprintDeckViewProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onOpenCustomTaskModal: () => void;
}

const DEFAULT_TIMER: ActiveSprintTimer = {
  activeStep: 0,
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
  const isShieldUnlocked = !!state.dopamineShieldStatus[dayKey];

  // Active persistent timer state from AppState
  const timer = state.activeSprintTimer || DEFAULT_TIMER;
  const activeStep = timer.activeStep ?? (isShieldUnlocked ? 1 : 0);

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

  const handleToggleShield = () => {
    sound.playTactileClick();
    const newStatus = !isShieldUnlocked;
    if (newStatus) {
      sound.playStartChime();
      updateTimer({ activeStep: 1 });
    } else {
      updateTimer({ activeStep: 0 });
    }

    onUpdateState(prev => ({
      ...prev,
      dopamineShieldStatus: {
        ...prev.dopamineShieldStatus,
        [dayKey]: newStatus
      }
    }));
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
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
      colors: isSaturday ? ['#FF4500', '#FF8C00', '#FBBF24'] : ['#00F2FE', '#4FACFE', '#8B5CF6']
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
    { id: 0, title: 'Shield', icon: '🛡️' },
    { id: 1, title: 'Block 1', icon: 'B1' },
    { id: 2, title: 'Breather', icon: '☕' },
    { id: 3, title: 'Block 2', icon: 'B2' },
    { id: 4, title: 'Victory', icon: '🏆' }
  ];

  return (
    <div className="px-4 py-4 pb-32">
      {/* 1. Stepper Station Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className={`text-[10px] font-black uppercase tracking-wider block ${
            isDark ? 'text-zinc-400' : 'text-slate-500'
          }`}>
            {isSaturday ? 'Saturday Morning Sprint' : 'Sunday Morning Sprint'}
          </span>
          <h2 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            90-Minute Focus Cockpit
          </h2>
        </div>

        {/* Step Indicator Pills */}
        <div className={`flex items-center gap-1.5 p-1 rounded-2xl border transition-colors ${
          isDark ? 'bg-cyber-card border-white/[0.08]' : 'bg-slate-100 border-slate-200'
        }`}>
          {stepLabels.map((s) => {
            const isActive = activeStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                title={s.title}
                className={`w-7 h-7 rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${
                  isActive
                    ? isSaturday
                      ? 'bg-gradient-to-r from-cyber-flame to-cyber-orange text-slate-950 shadow-neon-flame'
                      : 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 shadow-neon-cyan'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {s.icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Card Deck */}
      <AnimatePresence mode="wait">
        {/* STEP 0: DOPAMINE SHIELD STATION */}
        {activeStep === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`p-6 rounded-3xl border text-center transition-colors ${
              isDark 
                ? 'border-white/[0.12] bg-gradient-to-b from-cyber-cardElevated to-cyber-card shadow-cockpit' 
                : 'border-slate-200 bg-white shadow-xl text-slate-900'
            }`}
          >
            <div className={`w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center ${
              isDark 
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-neon-flame' 
                : 'bg-amber-100 border border-amber-300 text-amber-600 shadow-sm'
            }`}>
              {isShieldUnlocked ? <ShieldCheck className="w-8 h-8 stroke-[2.5]" /> : <Lock className="w-8 h-8" />}
            </div>

            <h3 className={`text-base font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Morning Dopamine Shield
            </h3>
            <p className={`text-xs leading-relaxed max-w-xs mx-auto mb-5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              Top engineers guard their mornings. Put your smartphone in another room. Zero social media feeds before your 90 minutes finish.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleToggleShield}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl transition-all ${
                isShieldUnlocked
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-cyber-flame via-cyber-orange to-cyber-amber text-slate-950 shadow-neon-flame'
              }`}
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>{isShieldUnlocked ? 'SHIELD ARMED • ENTER BLOCK 1' : 'ARM SHIELD & START SPRINT'}</span>
            </motion.button>
          </motion.div>
        )}

        {/* STEP 1: BLOCK 1 SPRINT */}
        {activeStep === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`p-5 rounded-3xl border transition-colors ${
              isDark 
                ? 'border-white/[0.12] bg-cyber-cardElevated shadow-cockpit' 
                : 'border-slate-200 bg-white shadow-xl'
            }`}
          >
            {/* Header pill */}
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isDark 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                Block 1 • First 45 Mins
              </span>
              <span className={`text-[10px] font-bold font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {activePlan.block1Task.difficulty} • {activePlan.block1Task.category.toUpperCase()}
              </span>
            </div>

            <h3 className={`text-sm font-black leading-snug mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activePlan.block1Task.title}
            </h3>
            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              {activePlan.block1Task.description}
            </p>

            {/* LIVE IN-CARD TIMER READOUT */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between mb-3 shadow-inner ${
              isDark 
                ? 'bg-cyber-bg/90 border-white/[0.08]' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className={`text-[9px] font-black uppercase tracking-wider block ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  Block 1 Countdown
                </span>
                <span className={`font-mono text-3xl font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {formatMMSS(timer.b1Seconds)}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleResetTimer('b1')}
                  title="Reset 45m"
                  className={`p-2.5 rounded-xl border ${
                    isDark ? 'border-white/10 bg-zinc-800 text-zinc-300' : 'border-slate-200 bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggleTimer('b1')}
                  className={`py-2.5 px-4 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-lg ${
                    timer.b1Running
                      ? 'bg-rose-500 text-white shadow-rose-500/30'
                      : 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  }`}
                >
                  {timer.b1Running ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  <span>{timer.b1Running ? 'PAUSE' : 'START 45M'}</span>
                </motion.button>
              </div>
            </div>

            {/* Ambient Focus Audio Synthesizer */}
            <div className={`p-2.5 rounded-2xl border mb-4 flex items-center justify-between gap-1 text-[10px] ${
              isDark ? 'bg-cyber-bg/60 border-white/[0.06]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 font-bold pl-1">
                <Waves className={`w-3.5 h-3.5 ${timer.ambientType !== 'none' ? 'text-cyber-cyan animate-pulse' : 'text-zinc-400'}`} />
                <span className={isDark ? 'text-zinc-300' : 'text-slate-600'}>Focus Audio:</span>
              </div>
              <div className="flex items-center gap-1">
                {(['none', 'rain', 'binaural', 'whitenoise'] as const).map((type) => {
                  const isSelected = timer.ambientType === type;
                  const label = type === 'none' ? 'Off' : type === 'rain' ? '🌧️ Rain' : type === 'binaural' ? '🧠 40Hz' : '📻 Pink';
                  return (
                    <button
                      key={type}
                      onClick={() => handleSetAmbient(type)}
                      className={`px-2 py-1 rounded-lg font-extrabold transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-cyber-cyan text-slate-950 shadow-neon-cyan'
                            : 'bg-cyan-600 text-white shadow-sm'
                          : isDark
                            ? 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* No AI Rule Box */}
            {activePlan.block1Task.noAiPrompt && (
              <div className={`p-3 rounded-2xl border text-xs mb-4 ${
                isDark 
                  ? 'border-amber-500/30 bg-amber-950/20 text-amber-200' 
                  : 'border-amber-300 bg-amber-50 text-amber-900'
              }`}>
                <div className="flex items-center gap-1.5 font-black text-[11px] text-amber-500 mb-1">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Strict No-AI Rule:</span>
                </div>
                <p className="text-[11px] leading-relaxed select-text">{activePlan.block1Task.noAiPrompt}</p>
              </div>
            )}

            {/* Checklist of steps */}
            <div className="space-y-1.5 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                Execution Breakdown (Check to Complete):
              </span>
              {activePlan.block1Task.actionItems.map((item, idx) => {
                const isDone = b1Checked.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleChecklist(activePlan.block1Task.id, idx)}
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer text-xs transition-colors ${
                      isDone
                        ? isDark
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-zinc-400 line-through'
                          : 'bg-emerald-50/70 border-emerald-300 text-emerald-900 line-through'
                        : isDark
                          ? 'bg-cyber-bg/60 border-white/[0.06] text-zinc-200 hover:border-white/15'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
                      isDone 
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                        : isDark ? 'border-zinc-700 bg-zinc-900' : 'border-slate-300 bg-white'
                    }`}>
                      {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] leading-relaxed select-text">{item}</span>
                  </div>
                );
              })}
            </div>

            {/* Code Snippet */}
            {activePlan.block1Task.codeSnippet && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                    isDark ? 'text-zinc-400' : 'text-slate-600'
                  }`}>
                    <Code className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Pattern Code Reference</span>
                  </span>
                  <button
                    onClick={() => handleCopyCode(activePlan.block1Task.codeSnippet!)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-colors ${
                      isDark 
                        ? 'bg-zinc-800 text-zinc-300 hover:text-white border-white/10' 
                        : 'bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    {copiedCode ? 'Copied! ✓' : 'Copy Code'}
                  </button>
                </div>
                <pre className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto select-text">
                  <code>{activePlan.block1Task.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Action Bar */}
            <div className={`flex items-center gap-2 pt-2 border-t ${
              isDark ? 'border-white/[0.08]' : 'border-slate-200'
            }`}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCompleteBlock(activePlan.block1Task.id)}
                className={`flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                  isB1Done
                    ? isDark ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isB1Done ? 'BLOCK 1 COMPLETED ✓' : 'MARK BLOCK 1 COMPLETE'}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
                className={`py-3 px-3 rounded-xl border text-xs font-bold ${
                  isDark ? 'border-white/10 bg-zinc-800 text-zinc-300' : 'border-slate-200 bg-slate-100 text-slate-700'
                }`}
              >
                Breather ➔
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: 5-MINUTE BREATHER SANCTUARY */}
        {activeStep === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`p-5 rounded-3xl border text-center transition-colors ${
              isDark 
                ? 'border-white/[0.12] bg-cyber-cardElevated shadow-cockpit' 
                : 'border-slate-200 bg-white shadow-xl'
            }`}
          >
            <div className={`w-14 h-14 rounded-3xl mx-auto mb-3 flex items-center justify-center ${
              isDark ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 'bg-amber-100 border border-amber-300 text-amber-600'
            }`}>
              <Coffee className="w-7 h-7" />
            </div>

            <h3 className={`text-sm font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              5-Minute Recovery Sanctuary
            </h3>
            <p className={`text-xs mb-4 max-w-xs mx-auto ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              Stand up, hydrate, and relax your eyes. High retention comes from interval spacing between deep sessions.
            </p>

            {/* Animated Breathing Visualizer */}
            <div className="my-4 flex flex-col items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className={`w-24 h-24 rounded-full border-2 flex items-center justify-center ${
                  isDark 
                    ? 'border-cyber-cyan/40 bg-cyber-cyan/10 shadow-neon-cyan' 
                    : 'border-cyan-400 bg-cyan-50 shadow-md'
                }`}
              >
                <span className={`font-mono text-xl font-black ${isDark ? 'text-white' : 'text-cyan-900'}`}>
                  {formatMMSS(timer.breatherSeconds)}
                </span>
              </motion.div>
              <span className={`text-[10px] font-bold uppercase tracking-wider mt-3 ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                Inhale 4s • Hold 4s • Exhale 4s
              </span>
            </div>

            <div className="flex items-center gap-2 max-w-xs mx-auto mt-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggleTimer('breather')}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md"
              >
                {timer.breatherRunning ? 'PAUSE BREATHER' : 'START 5M BREATHER'}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(3)}
                className={`py-3 px-4 rounded-xl border font-bold text-xs ${
                  isDark ? 'border-white/10 bg-zinc-800 text-zinc-200' : 'border-slate-200 bg-slate-100 text-slate-700'
                }`}
              >
                Skip to Block 2 ➔
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: BLOCK 2 SPRINT */}
        {activeStep === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`p-5 rounded-3xl border transition-colors ${
              isDark 
                ? 'border-white/[0.12] bg-cyber-cardElevated shadow-cockpit' 
                : 'border-slate-200 bg-white shadow-xl'
            }`}
          >
            {/* Header pill */}
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isDark 
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/30' 
                  : 'bg-cyan-50 text-cyan-700 border-cyan-200'
              }`}>
                Block 2 • Second 45 Mins
              </span>
              <span className={`text-[10px] font-bold font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {activePlan.block2Task.difficulty} • {activePlan.block2Task.category.toUpperCase()}
              </span>
            </div>

            <h3 className={`text-sm font-black leading-snug mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activePlan.block2Task.title}
            </h3>
            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              {activePlan.block2Task.description}
            </p>

            {/* LIVE IN-CARD TIMER READOUT */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between mb-3 shadow-inner ${
              isDark 
                ? 'bg-cyber-bg/90 border-white/[0.08]' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className={`text-[9px] font-black uppercase tracking-wider block ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  Block 2 Countdown
                </span>
                <span className={`font-mono text-3xl font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {formatMMSS(timer.b2Seconds)}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleResetTimer('b2')}
                  title="Reset 45m"
                  className={`p-2.5 rounded-xl border ${
                    isDark ? 'border-white/10 bg-zinc-800 text-zinc-300' : 'border-slate-200 bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggleTimer('b2')}
                  className={`py-2.5 px-4 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-lg ${
                    timer.b2Running
                      ? 'bg-rose-500 text-white shadow-rose-500/30'
                      : isDark ? 'bg-cyber-cyan text-slate-950 shadow-neon-cyan' : 'bg-cyan-600 text-white shadow-md'
                  }`}
                >
                  {timer.b2Running ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  <span>{timer.b2Running ? 'PAUSE' : 'START 45M'}</span>
                </motion.button>
              </div>
            </div>

            {/* Ambient Focus Audio Synthesizer */}
            <div className={`p-2.5 rounded-2xl border mb-4 flex items-center justify-between gap-1 text-[10px] ${
              isDark ? 'bg-cyber-bg/60 border-white/[0.06]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 font-bold pl-1">
                <Waves className={`w-3.5 h-3.5 ${timer.ambientType !== 'none' ? 'text-cyber-cyan animate-pulse' : 'text-zinc-400'}`} />
                <span className={isDark ? 'text-zinc-300' : 'text-slate-600'}>Focus Audio:</span>
              </div>
              <div className="flex items-center gap-1">
                {(['none', 'rain', 'binaural', 'whitenoise'] as const).map((type) => {
                  const isSelected = timer.ambientType === type;
                  const label = type === 'none' ? 'Off' : type === 'rain' ? '🌧️ Rain' : type === 'binaural' ? '🧠 40Hz' : '📻 Pink';
                  return (
                    <button
                      key={type}
                      onClick={() => handleSetAmbient(type)}
                      className={`px-2 py-1 rounded-lg font-extrabold transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-cyber-cyan text-slate-950 shadow-neon-cyan'
                            : 'bg-cyan-600 text-white shadow-sm'
                          : isDark
                            ? 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* No AI Rule Box */}
            {activePlan.block2Task.noAiPrompt && (
              <div className={`p-3 rounded-2xl border text-xs mb-4 ${
                isDark 
                  ? 'border-cyber-cyan/30 bg-cyber-blue/10 text-cyan-200' 
                  : 'border-cyan-300 bg-cyan-50 text-cyan-900'
              }`}>
                <div className={`flex items-center gap-1.5 font-black text-[11px] mb-1 ${
                  isDark ? 'text-cyber-cyan' : 'text-cyan-700'
                }`}>
                  <BrainCircuit className="w-4 h-4" />
                  <span>Strict Manual Recall Requirement:</span>
                </div>
                <p className="text-[11px] leading-relaxed select-text">{activePlan.block2Task.noAiPrompt}</p>
              </div>
            )}

            {/* Checklist of steps */}
            <div className="space-y-1.5 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                Execution Breakdown (Check to Complete):
              </span>
              {activePlan.block2Task.actionItems.map((item, idx) => {
                const isDone = b2Checked.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleChecklist(activePlan.block2Task.id, idx)}
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer text-xs transition-colors ${
                      isDone
                        ? isDark
                          ? 'bg-cyber-cyan/15 border-cyber-cyan/30 text-zinc-400 line-through'
                          : 'bg-cyan-50/70 border-cyan-300 text-cyan-900 line-through'
                        : isDark
                          ? 'bg-cyber-bg/60 border-white/[0.06] text-zinc-200 hover:border-white/15'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
                      isDone 
                        ? isDark ? 'bg-cyber-cyan border-cyber-cyan text-slate-950' : 'bg-cyan-600 border-cyan-600 text-white' 
                        : isDark ? 'border-zinc-700 bg-zinc-900' : 'border-slate-300 bg-white'
                    }`}>
                      {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] leading-relaxed select-text">{item}</span>
                  </div>
                );
              })}
            </div>

            {/* Custom Tasks for this Day */}
            <div className="mt-4 pt-4 border-t border-dashed border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  Custom Sprint Tasks ({customTasksForDay.length})
                </span>
                <button
                  onClick={() => {
                    sound.playTactileClick();
                    onOpenCustomTaskModal();
                  }}
                  className={`text-[10px] font-black flex items-center gap-1 px-2.5 py-1 rounded-xl border transition-colors ${
                    isDark 
                      ? 'border-white/10 bg-zinc-800 text-zinc-200 hover:bg-zinc-700' 
                      : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Task</span>
                </button>
              </div>

              {customTasksForDay.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {customTasksForDay.map((ct) => {
                    const isCompleted = state.completedTaskIds.includes(ct.id);
                    return (
                      <div
                        key={ct.id}
                        onClick={() => handleToggleCustomTask(ct.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs transition-colors ${
                          isCompleted
                            ? isDark ? 'bg-emerald-950/20 border-emerald-500/30 line-through text-zinc-400' : 'bg-emerald-50 border-emerald-300 line-through text-emerald-800'
                            : isDark ? 'bg-cyber-bg/50 border-white/10 text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border ${
                            isCompleted ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-zinc-600 bg-zinc-800'
                          }`}>
                            {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-bold text-[11px]">{ct.title}</span>
                        </div>
                        <span className="text-[9px] font-mono opacity-70">Block {ct.blockNumber}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className={`flex items-center gap-2 pt-3 border-t ${
              isDark ? 'border-white/[0.08]' : 'border-slate-200'
            }`}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCompleteBlock(activePlan.block2Task.id)}
                className={`flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                  isB2Done
                    ? isDark ? 'bg-zinc-800 text-cyber-cyan border border-cyber-cyan/30' : 'bg-cyan-50 text-cyan-700 border border-cyan-300'
                    : isDark ? 'bg-cyber-cyan text-slate-950 shadow-neon-cyan' : 'bg-cyan-600 text-white shadow-md'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isB2Done ? 'BLOCK 2 COMPLETED ✓' : 'MARK BLOCK 2 COMPLETE'}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(4)}
                className={`py-3 px-3 rounded-xl border text-xs font-bold ${
                  isDark ? 'border-white/10 bg-zinc-800 text-zinc-300' : 'border-slate-200 bg-slate-100 text-slate-700'
                }`}
              >
                Victory ➔
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: VICTORY & JOURNAL */}
        {activeStep === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`p-5 rounded-3xl border text-center transition-colors ${
              isDark 
                ? 'border-white/[0.12] bg-cyber-cardElevated shadow-cockpit' 
                : 'border-slate-200 bg-white shadow-xl'
            }`}
          >
            <div className={`w-16 h-16 rounded-3xl mx-auto mb-3 flex items-center justify-center ${
              isDark 
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-neon-flame' 
                : 'bg-amber-100 border border-amber-300 text-amber-600 shadow-sm'
            }`}>
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className={`text-base font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              90-Minute Sprint Complete!
            </h3>
            <p className={`text-xs mb-4 max-w-xs mx-auto ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              You showed up, protected your morning dopamine, and coded without crutches. Log today's breakthrough to lock in the neural pathway.
            </p>

            {/* Reflection prompt */}
            <div className={`text-left mb-4 p-4 rounded-2xl border ${
              isDark ? 'bg-cyber-bg border-white/[0.08]' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-black uppercase text-amber-500 block mb-1">
                Daily Takeaway Prompt:
              </span>
              <p className={`text-xs font-bold italic mb-2 select-text ${
                isDark ? 'text-zinc-300' : 'text-slate-700'
              }`}>
                "{activePlan.dailyReflectionPrompt}"
              </p>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="What syntax, architecture trade-off, or optimization did you write from memory today?"
                rows={3}
                className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-amber-400 select-text ${
                  isDark 
                    ? 'bg-zinc-900 border-white/10 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSaveReflection}
              className="w-full py-3.5 px-4 rounded-2xl font-black text-xs bg-amber-500 text-slate-950 shadow-neon-flame flex items-center justify-center gap-1.5"
            >
              {reflectionSaved ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>{reflectionSaved ? 'SAVED TO 20-LPA PORTFOLIO ✓' : 'SAVE TO CAREER LOG'}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
