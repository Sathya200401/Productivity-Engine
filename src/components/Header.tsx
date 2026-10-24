import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Sun, 
  Moon, 
  Smartphone, 
  Maximize2, 
  Settings, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { AppState } from '../types';
import { sound } from '../utils/sound';

interface HeaderProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onUpdateState, onOpenSettings }) => {
  const isDark = state.theme === 'dark';

  const toggleTheme = () => {
    sound.playTactileClick();
    onUpdateState(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const toggleViewMode = () => {
    sound.playTactileClick();
    onUpdateState(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'mobile-shell' ? 'full-screen' : 'mobile-shell'
    }));
  };

  const changeWeek = (delta: number) => {
    sound.playTactileClick();
    onUpdateState(prev => {
      const nextWeek = Math.max(1, Math.min(16, prev.currentWeek + delta));
      return { ...prev, currentWeek: nextWeek };
    });
  };

  const getPhaseInfo = (week: number) => {
    if (week <= 6) return { phase: 1, label: 'Phase 1: Code Muscle & Fluency', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (week <= 12) return { phase: 2, label: 'Phase 2: Distributed Systems & RAG', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
    return { phase: 3, label: 'Phase 3: LLD/HLD & 20 LPA Bar-Raiser', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  };

  const phaseInfo = getPhaseInfo(state.currentWeek);

  return (
    <header className="sticky top-0 z-30 transition-colors duration-200">
      <div className={`px-4 py-3 border-b backdrop-blur-2xl transition-colors ${
        isDark 
          ? 'bg-midnight-950/90 border-white/[0.08] text-zinc-100' 
          : 'bg-white/90 border-zinc-200 text-zinc-900 shadow-sm'
      }`}>
        {/* Top Bar: Brand, Streak, View & Settings */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-2.5">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-primaryLight flex items-center justify-center shadow-subtle-glow border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  Weekend 90
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500 text-zinc-950">
                  20 LPA
                </span>
              </div>
              <p className={`text-[10px] font-medium leading-none ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                ADP Member Tech ➔ Senior AI Eng
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            {/* Streak Counter */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                isDark 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-gold-glow' 
                  : 'bg-amber-50 border-amber-300 text-amber-600'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{state.streakCount}w</span>
            </motion.div>

            {/* Desktop View Switcher */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleViewMode}
              title={state.viewMode === 'mobile-shell' ? 'Expand to Fullscreen' : 'Constrain to Phone Frame'}
              className={`hidden sm:flex p-1.5 rounded-xl border transition-colors ${
                isDark ? 'bg-midnight-850 border-white/[0.08] text-zinc-300 hover:bg-midnight-800' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}
            >
              {state.viewMode === 'mobile-shell' ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-1.5 rounded-xl border transition-colors ${
                isDark ? 'bg-midnight-850 border-white/[0.08] text-amber-300 hover:bg-midnight-800' : 'bg-zinc-100 border-zinc-200 text-brand-primary'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </motion.button>

            {/* Settings */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                sound.playTactileClick();
                onOpenSettings();
              }}
              className={`p-1.5 rounded-xl border transition-colors ${
                isDark ? 'bg-midnight-850 border-white/[0.08] text-zinc-300 hover:bg-midnight-800' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Second Row: Week Selector & Phase Indicator */}
        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-white/[0.06]">
          {/* Week Selector */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => changeWeek(-1)}
              disabled={state.currentWeek <= 1}
              className={`p-1 rounded-lg transition-colors ${
                state.currentWeek <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-midnight-850 text-zinc-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-midnight-850 border border-white/10 text-brand-primaryLight shadow-inner">
              Week {state.currentWeek} of 16
            </span>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => changeWeek(1)}
              disabled={state.currentWeek >= 16}
              className={`p-1 rounded-lg transition-colors ${
                state.currentWeek >= 16 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-midnight-850 text-zinc-300'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Phase Badge */}
          <div className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border truncate max-w-[210px] ${phaseInfo.color}`}>
            {phaseInfo.label}
          </div>
        </div>
      </div>
    </header>
  );
};
