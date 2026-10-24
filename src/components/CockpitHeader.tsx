import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Sparkles, 
  Settings, 
  Sun, 
  Moon, 
  Maximize2, 
  Smartphone,
  Zap
} from 'lucide-react';
import { AppState, DayType } from '../types';
import { sound } from '../utils/sound';

interface CockpitHeaderProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onOpenSettings: () => void;
}

export const CockpitHeader: React.FC<CockpitHeaderProps> = ({
  state,
  onUpdateState,
  onOpenSettings
}) => {
  const isDark = state.theme === 'dark';
  const isSaturday = state.selectedDay === 'saturday';

  const toggleDay = (day: DayType) => {
    sound.playTactileClick();
    onUpdateState(prev => ({ ...prev, selectedDay: day }));
  };

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

  return (
    <header className="sticky top-0 z-40 transition-colors duration-200">
      <div className={`px-4 py-3 border-b backdrop-blur-2xl ${
        isDark 
          ? 'bg-cyber-bg/95 border-white/[0.08] text-white' 
          : 'bg-white/95 border-zinc-200 text-zinc-900 shadow-sm'
      }`}>
        {/* Top Row: Brand & Master Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand Mark */}
          <div className="flex items-center gap-2.5">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shadow-lg border border-white/20 ${
                isSaturday 
                  ? 'bg-gradient-to-tr from-cyber-flame via-cyber-orange to-cyber-amber text-slate-950 shadow-neon-flame'
                  : 'bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-cyber-purple text-slate-950 shadow-neon-cyan'
              }`}
            >
              W90
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-black text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Weekend 90
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 tracking-wider">
                  20 LPA
                </span>
              </div>
              <p className={`text-[10px] font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                ADP Member Tech ➔ Staff AI Eng
              </p>
            </div>
          </div>

          {/* Controls: Streak, Active Timer, View Mode, Theme, Settings */}
          <div className="flex items-center gap-1.5">
            {/* Live Timer Pill if Running */}
            {state.activeSprintTimer && (state.activeSprintTimer.b1Running || state.activeSprintTimer.breatherRunning || state.activeSprintTimer.b2Running) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-black border animate-pulse ${
                  isDark
                    ? 'bg-cyber-cyan/15 border-cyber-cyan/40 text-cyber-cyan shadow-neon-cyan'
                    : 'bg-cyan-50 border-cyan-300 text-cyan-700'
                }`}
                title="Active Sprint Timer Running"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>
                  {state.activeSprintTimer.b1Running
                    ? `${Math.floor(state.activeSprintTimer.b1Seconds / 60)}:${String(state.activeSprintTimer.b1Seconds % 60).padStart(2, '0')}`
                    : state.activeSprintTimer.breatherRunning
                    ? `${Math.floor(state.activeSprintTimer.breatherSeconds / 60)}:${String(state.activeSprintTimer.breatherSeconds % 60).padStart(2, '0')}`
                    : `${Math.floor(state.activeSprintTimer.b2Seconds / 60)}:${String(state.activeSprintTimer.b2Seconds % 60).padStart(2, '0')}`}
                </span>
              </motion.div>
            )}

            {/* Streak Counter with Burning Flame */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black border ${
                isDark 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-neon-flame' 
                  : 'bg-amber-50 border-amber-300 text-amber-600'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{state.streakCount}w</span>
            </motion.div>

            {/* Desktop View Switcher */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleViewMode}
              title={state.viewMode === 'mobile-shell' ? 'Expand to Fullscreen' : 'Constrain to Phone Frame'}
              aria-label={state.viewMode === 'mobile-shell' ? 'Expand to Fullscreen' : 'Constrain to Phone Frame'}
              className={`hidden sm:flex p-2 rounded-xl border transition-colors ${
                isDark ? 'bg-cyber-card border-white/[0.08] text-zinc-300 hover:bg-cyber-cardElevated' : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {state.viewMode === 'mobile-shell' ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Cyber Dark Theme'}
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Cyber Dark Theme'}
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'bg-cyber-card border-white/[0.08] text-amber-300 hover:bg-cyber-cardElevated' : 'bg-zinc-100 border-zinc-200 text-amber-600 hover:bg-zinc-200'
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
              title="Open Settings & Guide"
              aria-label="Open Settings & Guide"
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'bg-cyber-card border-white/[0.08] text-zinc-300 hover:bg-cyber-cardElevated' : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Second Row: Saturday / Sunday Segmented Capsule */}
        <div className={`mt-3 p-1 rounded-2xl flex items-center border relative transition-colors ${
          isDark ? 'bg-cyber-card border-white/[0.08]' : 'bg-slate-100 border-slate-200'
        }`}>
          {/* Saturday Capsule */}
          <button
            onClick={() => toggleDay('saturday')}
            className={`relative flex-1 py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-colors z-10 ${
              isSaturday 
                ? 'text-slate-950 font-black' 
                : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isSaturday && (
              <motion.div
                layoutId="cockpitDayTab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyber-flame via-cyber-orange to-cyber-amber shadow-neon-flame border border-white/20"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>SATURDAY</span>
              <span className="text-[10px] opacity-80 hidden xs:inline">• DSA & Code Muscle</span>
            </span>
          </button>

          {/* Sunday Capsule */}
          <button
            onClick={() => toggleDay('sunday')}
            className={`relative flex-1 py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-colors z-10 ${
              !isSaturday 
                ? 'text-slate-950 font-black' 
                : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {!isSaturday && (
              <motion.div
                layoutId="cockpitDayTab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple shadow-neon-cyan border border-white/20"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>SUNDAY</span>
              <span className="text-[10px] opacity-80 hidden xs:inline">• HLD & Applied AI</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
