import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Radio, 
  CloudRain, 
  Waves, 
  Zap
} from 'lucide-react';
import { AppState, Task, TimerPhase } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface TimerTabProps {
  state: AppState;
  activeTask?: Task | null;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onSwitchToPlan: () => void;
}

const PHASE_DURATIONS: Record<TimerPhase, number> = {
  block1: 45 * 60,
  break: 5 * 60,
  block2: 45 * 60,
  finished: 0
};

export const TimerTab: React.FC<TimerTabProps> = ({
  state,
  activeTask,
  onUpdateState,
  onSwitchToPlan
}) => {
  const isDark = state.theme === 'dark';

  const [phase, setPhase] = useState<TimerPhase>('block1');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(PHASE_DURATIONS.block1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientNoise, setAmbientNoise] = useState<'none' | 'binaural' | 'rain' | 'whitenoise'>('none');
  const [soundMuted, setSoundMuted] = useState<boolean>(!state.soundEnabled);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    sound.setMuted(soundMuted);
  }, [soundMuted]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, phase]);

  const handlePhaseComplete = () => {
    sound.playCompletionChime();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (phase === 'block1') {
      setPhase('break');
      setSecondsRemaining(PHASE_DURATIONS.break);
    } else if (phase === 'break') {
      setPhase('block2');
      setSecondsRemaining(PHASE_DURATIONS.block2);
    } else if (phase === 'block2') {
      setPhase('finished');
      setSecondsRemaining(0);
      setIsRunning(false);
      sound.stopAmbient();
    }
  };

  const togglePlayPause = () => {
    sound.playTactileClick();
    if (!isRunning) {
      sound.playStartChime();
      if (ambientNoise !== 'none') {
        sound.startAmbient(ambientNoise);
      }
    } else {
      sound.stopAmbient();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    sound.playTactileClick();
    setIsRunning(false);
    sound.stopAmbient();
    setSecondsRemaining(PHASE_DURATIONS[phase]);
  };

  const handleSkipPhase = () => {
    sound.playTactileClick();
    handlePhaseComplete();
  };

  const handleSetPhase = (newPhase: TimerPhase) => {
    sound.playTactileClick();
    setPhase(newPhase);
    setSecondsRemaining(PHASE_DURATIONS[newPhase]);
    setIsRunning(false);
    sound.stopAmbient();
  };

  const handleAmbientChange = (type: 'none' | 'binaural' | 'rain' | 'whitenoise') => {
    sound.playTactileClick();
    setAmbientNoise(type);
    if (type === 'none') {
      sound.stopAmbient();
    } else if (isRunning) {
      sound.startAmbient(type);
    }
  };

  const handleMarkBlockComplete = () => {
    sound.playCompletionChime();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.7 }
    });

    if (activeTask) {
      onUpdateState(prev => ({
        ...prev,
        completedTaskIds: prev.completedTaskIds.includes(activeTask.id)
          ? prev.completedTaskIds
          : [...prev.completedTaskIds, activeTask.id]
      }));
    }

    if (phase === 'block1') {
      setPhase('break');
      setSecondsRemaining(PHASE_DURATIONS.break);
      setIsRunning(false);
    } else if (phase === 'block2') {
      setPhase('finished');
      setSecondsRemaining(0);
      setIsRunning(false);
    }
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalPhaseTime = PHASE_DURATIONS[phase] || 1;
  const progressFraction = (totalPhaseTime - secondsRemaining) / totalPhaseTime;

  const getPhaseColor = () => {
    switch (phase) {
      case 'block1':
        return { stroke: '#10B981', gradient: 'from-emerald-500 to-teal-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'break':
        return { stroke: '#F59E0B', gradient: 'from-amber-500 to-orange-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'block2':
        return { stroke: '#6366F1', gradient: 'from-indigo-500 to-purple-500', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'finished':
        return { stroke: '#10B981', gradient: 'from-emerald-500 to-teal-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    }
  };

  const phaseVisual = getPhaseColor();

  return (
    <div className="px-4 py-3 pb-32 flex flex-col items-center">
      {/* 1. Top Segmented Phase Bar */}
      <div className={`p-1.5 rounded-2xl flex items-center w-full max-w-sm mb-4 border relative ${
        isDark ? 'bg-slate-900/90 border-white/[0.08]' : 'bg-slate-200/80 border-slate-300'
      }`}>
        <button
          onClick={() => handleSetPhase('block1')}
          className={`relative flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all z-10 ${
            phase === 'block1' ? 'text-white' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600'
          }`}
        >
          {phase === 'block1' && (
            <motion.div
              layoutId="timerPhasePill"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md border border-emerald-400/40"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">Block 1 (45m)</span>
        </button>

        <button
          onClick={() => handleSetPhase('break')}
          className={`relative py-1.5 px-2.5 rounded-xl text-xs font-black transition-all z-10 ${
            phase === 'break' ? 'text-white' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600'
          }`}
        >
          {phase === 'break' && (
            <motion.div
              layoutId="timerPhasePill"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-md border border-amber-400/40"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">Break (5m)</span>
        </button>

        <button
          onClick={() => handleSetPhase('block2')}
          className={`relative flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all z-10 ${
            phase === 'block2' ? 'text-white' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600'
          }`}
        >
          {phase === 'block2' && (
            <motion.div
              layoutId="timerPhasePill"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md border border-indigo-400/40"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">Block 2 (45m)</span>
        </button>
      </div>

      {/* 2. Active Linked Task Banner */}
      {activeTask && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-sm p-3.5 rounded-3xl mb-4 border transition-all ${
            isDark 
              ? 'bg-obsidian-card border-white/[0.08] text-slate-200 shadow-md' 
              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              Active Sprint Task
            </span>
            <button
              onClick={onSwitchToPlan}
              className="text-indigo-400 hover:underline font-bold"
            >
              Change Task
            </button>
          </div>
          <p className="text-xs font-extrabold truncate">{activeTask.title}</p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{activeTask.description}</p>
        </motion.div>
      )}

      {/* 3. Dual-Ring SVG Circular Timer with Breathing Glow */}
      <div className="relative my-2 flex items-center justify-center">
        {/* Outer Glow Ring */}
        <div 
          className={`absolute w-56 h-56 rounded-full blur-2xl opacity-20 pointer-events-none transition-all duration-700 ${
            isRunning ? (phase === 'block1' ? 'bg-emerald-500 scale-110' : phase === 'break' ? 'bg-amber-500 scale-105' : 'bg-indigo-500 scale-110') : 'bg-transparent'
          }`} 
        />

        <svg className="w-64 h-64 -rotate-90 transform" viewBox="0 0 260 260">
          <defs>
            <linearGradient id="timerGradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#2DD4BF" />
            </linearGradient>
            <linearGradient id="timerGradIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <linearGradient id="timerGradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx="130"
            cy="130"
            r="110"
            stroke={isDark ? '#1E293B' : '#E2E8F0'}
            strokeWidth="12"
            fill="transparent"
          />

          {/* Animated Progress Circle */}
          <circle
            cx="130"
            cy="130"
            r="110"
            stroke={phase === 'block1' ? 'url(#timerGradEmerald)' : phase === 'break' ? 'url(#timerGradAmber)' : 'url(#timerGradIndigo)'}
            strokeWidth="12"
            strokeDasharray={691}
            strokeDashoffset={691 - (691 * progressFraction)}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center Digital Clock */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1 ${phaseVisual.badge}`}>
            {phase === 'block1' && 'Block 1 • Deep Work'}
            {phase === 'break' && '5m Recovery • Hydrate'}
            {phase === 'block2' && 'Block 2 • Deep Work'}
            {phase === 'finished' && 'Sprint Finished!'}
          </span>

          <motion.span 
            key={timeFormatted}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="font-mono text-5xl font-black tracking-tighter my-0.5"
          >
            {timeFormatted}
          </motion.span>

          <span className="text-[11px] font-medium text-slate-400">
            {isRunning ? 'Sprint In Progress' : 'Paused / Ready'}
          </span>

          {/* Dynamic Audio Equalizer Bars (When audio is active) */}
          {ambientNoise !== 'none' && isRunning && (
            <div className="flex items-center gap-1 mt-1.5 h-3">
              {[0.4, 0.8, 0.3, 0.9, 0.5].map((delay, i) => (
                <motion.span
                  key={i}
                  animate={{ height: ['4px', '14px', '6px'] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: delay }}
                  className="w-1 bg-emerald-400 rounded-full"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Primary Floating Control Dock */}
      <div className="flex items-center gap-4 my-4">
        {/* Reset */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleReset}
          title="Reset Phase"
          className={`p-3.5 rounded-2xl border transition-all ${
            isDark 
              ? 'bg-slate-900/80 border-white/[0.08] text-slate-300 hover:bg-slate-800' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm'
          }`}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        {/* Big Play/Pause Button with Spring */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={togglePlayPause}
          className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all ${
            isRunning
              ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/40'
              : phase === 'block1'
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-emerald-500/40'
                : 'bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-indigo-600/40'
          }`}
        >
          {isRunning ? (
            <Pause className="w-7 h-7 fill-white" />
          ) : (
            <Play className="w-7 h-7 fill-white ml-1" />
          )}
        </motion.button>

        {/* Skip to Next */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSkipPhase}
          title="Skip to next phase"
          className={`p-3.5 rounded-2xl border transition-all ${
            isDark 
              ? 'bg-slate-900/80 border-white/[0.08] text-slate-300 hover:bg-slate-800' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm'
          }`}
        >
          <FastForward className="w-5 h-5" />
        </motion.button>
      </div>

      {/* 5. 1-Tap "Mark Block Complete" Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleMarkBlockComplete}
        className="w-full max-w-sm py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all mb-4"
      >
        <CheckCircle2 className="w-5 h-5" />
        <span>Mark Current 45m Block Complete</span>
      </motion.button>

      {/* 6. Ambient Synthesizer Deck */}
      <div className={`w-full max-w-sm p-3.5 rounded-3xl border ${
        isDark ? 'bg-slate-900/60 border-white/[0.08] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-indigo-400" />
            Ambient Synthesizer (100% Offline)
          </span>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </motion.button>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAmbientChange('none')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
              ambientNoise === 'none'
                ? 'bg-slate-800 border-white/20 text-white shadow-sm'
                : 'border-transparent text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            Off
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAmbientChange('binaural')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold border flex items-center justify-center gap-1 transition-colors ${
              ambientNoise === 'binaural'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                : 'border-transparent text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>40Hz</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAmbientChange('rain')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold border flex items-center justify-center gap-1 transition-colors ${
              ambientNoise === 'rain'
                ? 'bg-teal-600 border-teal-400 text-white shadow-sm'
                : 'border-transparent text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            <CloudRain className="w-3 h-3" />
            <span>Rain</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAmbientChange('whitenoise')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold border flex items-center justify-center gap-1 transition-colors ${
              ambientNoise === 'whitenoise'
                ? 'bg-slate-700 border-white/20 text-white shadow-sm'
                : 'border-transparent text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            <Waves className="w-3 h-3" />
            <span>Pink</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
