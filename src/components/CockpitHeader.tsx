import React from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Maximize2, 
  Smartphone,
  Activity
} from 'lucide-react';
import { AppState, DayType } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
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

  const totalTasks = CURRICULUM_DATA.length * 4;
  const completedCount = state.completedTaskIds.length;
  const overallPercent = Math.min(100, Math.round((completedCount / totalTasks) * 100));

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
    <header className="sticky top-0 z-40 transition-colors duration-150">
      <div className={`px-3.5 sm:px-6 py-3 border-b ${
        isDark 
          ? 'bg-[#09090B]/95 border-white/[0.08] text-neutral-100 backdrop-blur-md' 
          : 'bg-white/95 border-neutral-200 text-neutral-900 backdrop-blur-md'
      }`}>
        {/* Top Row: Mobile-Optimized Monograph Header */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand Mark & Monograph Meta */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-none border flex items-center justify-center font-mono font-bold text-[10px] sm:text-[11px] tracking-tighter ${
              isDark 
                ? 'border-white/20 bg-neutral-900 text-white' 
                : 'border-neutral-900 bg-neutral-900 text-white'
            }`}>
              90
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className={`font-display text-xs sm:text-base font-bold tracking-tight uppercase truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Weekend 90
                </h1>
                <span className={`font-mono text-[9px] sm:text-[10px] px-1 py-0.2 border uppercase tracking-wider shrink-0 ${
                  isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-300' : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                }`}>
                  20+ LPA
                </span>
              </div>
              <p className={`font-mono text-[9px] tracking-tight truncate hidden xs:block ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                ARCHITECTURAL SPRINT // STAFF ACCELERATOR
              </p>
            </div>
          </div>

          {/* Controls & Metrics */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Live Timer Readout if Active */}
            {state.activeSprintTimer && (state.activeSprintTimer.b1Running || state.activeSprintTimer.breatherRunning || state.activeSprintTimer.b2Running) && (
              <div
                className={`flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs font-mono font-medium border ${
                  isDark
                    ? 'border-blue-500/50 bg-blue-950/40 text-blue-400'
                    : 'border-blue-300 bg-blue-50 text-blue-700'
                }`}
                title="Sprint Timer Active"
              >
                <Activity className="w-3 h-3 animate-pulse" />
                <span className="tabular-nums">
                  {state.activeSprintTimer.b1Running
                    ? `B1 ${Math.floor(state.activeSprintTimer.b1Seconds / 60)}:${String(state.activeSprintTimer.b1Seconds % 60).padStart(2, '0')}`
                    : state.activeSprintTimer.breatherRunning
                    ? `REC ${Math.floor(state.activeSprintTimer.breatherSeconds / 60)}:${String(state.activeSprintTimer.breatherSeconds % 60).padStart(2, '0')}`
                    : `B2 ${Math.floor(state.activeSprintTimer.b2Seconds / 60)}:${String(state.activeSprintTimer.b2Seconds % 60).padStart(2, '0')}`}
                </span>
              </div>
            )}

            {/* Overall Curriculum Archival Progress (Desktop only) */}
            <div className={`hidden md:flex items-center gap-1.5 px-2 py-1 text-xs font-mono border ${
              isDark ? 'border-neutral-800 text-neutral-400 bg-neutral-900/50' : 'border-neutral-200 text-neutral-600 bg-neutral-50'
            }`}>
              <span className="text-[10px] uppercase text-neutral-500">Progress</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{overallPercent}%</span>
            </div>

            {/* Streak Counter */}
            <div
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 text-[11px] sm:text-xs font-mono border ${
                isDark 
                  ? 'border-neutral-800 bg-neutral-900 text-neutral-300' 
                  : 'border-neutral-200 bg-neutral-50 text-neutral-800'
              }`}
              title="Weekly Sprint Streak"
            >
              <span className="text-[9px] uppercase text-neutral-500 hidden sm:inline">Streak</span>
              <span className="font-bold">{state.streakCount}w</span>
            </div>

            {/* Canvas View Switcher (Desktop only) */}
            <button
              onClick={toggleViewMode}
              title={state.viewMode === 'mobile-shell' ? 'Expand Canvas' : 'Constrain Frame'}
              aria-label={state.viewMode === 'mobile-shell' ? 'Expand Canvas' : 'Constrain Frame'}
              className={`hidden md:flex p-1.5 border transition-colors ${
                isDark 
                  ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white' 
                  : 'border-neutral-200 bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {state.viewMode === 'mobile-shell' ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            </button>

            {/* Theme Inversion */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-1.5 sm:p-2 border transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center ${
                isDark 
                  ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white active:bg-neutral-800' 
                  : 'border-neutral-200 bg-neutral-100 text-neutral-600 hover:text-neutral-900 active:bg-neutral-200'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                sound.playTactileClick();
                onOpenSettings();
              }}
              title="System Settings"
              aria-label="System Settings"
              className={`p-1.5 sm:p-2 border transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center ${
                isDark 
                  ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white active:bg-neutral-800' 
                  : 'border-neutral-200 bg-neutral-100 text-neutral-600 hover:text-neutral-900 active:bg-neutral-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Second Row: Ergonomic Day Selector (44px Minimum Touch Targets) */}
        <div className={`mt-2.5 grid grid-cols-2 p-1 border text-xs font-mono ${
          isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {/* Saturday Block */}
          <button
            onClick={() => toggleDay('saturday')}
            className={`py-2 px-2 min-h-[44px] flex flex-col items-center justify-center text-center transition-all ${
              isSaturday 
                ? isDark
                  ? 'bg-white text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-950 text-white font-bold shadow-sm'
                : isDark ? 'text-neutral-400 hover:text-white active:text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <span className="block text-[11px] font-bold tracking-wider uppercase">01 // Saturday</span>
            <span className="text-[10px] tracking-tight opacity-75 truncate max-w-full">Algorithms & Code Muscle</span>
          </button>

          {/* Sunday Block */}
          <button
            onClick={() => toggleDay('sunday')}
            className={`py-2 px-2 min-h-[44px] flex flex-col items-center justify-center text-center transition-all ${
              !isSaturday 
                ? isDark
                  ? 'bg-white text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-950 text-white font-bold shadow-sm'
                : isDark ? 'text-neutral-400 hover:text-white active:text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <span className="block text-[11px] font-bold tracking-wider uppercase">02 // Sunday</span>
            <span className="text-[10px] tracking-tight opacity-75 truncate max-w-full">Distributed Systems & AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
