import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { sound } from '../utils/sound';

interface WeekCarouselProps {
  currentWeek: number;
  completedTaskIds: string[];
  onSelectWeek: (week: number) => void;
  isDark: boolean;
}

export const WeekCarousel: React.FC<WeekCarouselProps> = ({
  currentWeek,
  completedTaskIds,
  onSelectWeek,
  isDark
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedButtonRef.current && containerRef.current) {
      selectedButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [currentWeek]);

  const scrollBy = (offset: number) => {
    sound.playTactileClick();
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const getPhaseName = (phase: number) => {
    switch (phase) {
      case 1: return 'P1: Code Muscle';
      case 2: return 'P2: Distributed & RAG';
      case 3: return 'P3: 20 LPA Bar-Raiser';
      default: return '';
    }
  };

  return (
    <div className={`px-4 py-2.5 border-b transition-colors duration-200 ${
      isDark 
        ? 'border-white/[0.06] bg-cyber-bg/70 backdrop-blur-xl' 
        : 'border-slate-200 bg-slate-50/90 backdrop-blur-xl shadow-inner'
    }`}>
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-extrabold text-[11px] uppercase tracking-wider ${
            isDark ? 'text-zinc-400' : 'text-slate-600'
          }`}>
            16-Week Horizon
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isDark ? 'bg-cyber-cyan/15 text-cyber-cyan' : 'bg-cyan-100 text-cyan-800'
          }`}>
            Week {currentWeek} of 16
          </span>
        </div>

        {/* Scroll Chevrons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => scrollBy(-200)}
            aria-label="Scroll weeks left"
            className={`p-1 rounded-lg border transition-colors ${
              isDark 
                ? 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5' 
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scrollBy(200)}
            aria-label="Scroll weeks right"
            className={`p-1 rounded-lg border transition-colors ${
              isDark 
                ? 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5' 
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth"
      >
        {CURRICULUM_DATA.map((week) => {
          const isSelected = currentWeek === week.weekNumber;
          const weekTaskIds = [
            week.saturday.block1Task.id,
            week.saturday.block2Task.id,
            week.sunday.block1Task.id,
            week.sunday.block2Task.id
          ];
          const completedCount = weekTaskIds.filter(id => completedTaskIds.includes(id)).length;
          const isComplete = completedCount === 4;

          return (
            <motion.button
              key={week.weekNumber}
              ref={isSelected ? selectedButtonRef : undefined}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                sound.playTactileClick();
                onSelectWeek(week.weekNumber);
              }}
              className={`relative shrink-0 p-2.5 rounded-2xl border text-left transition-all min-w-[105px] ${
                isSelected
                  ? isDark
                    ? 'bg-cyber-cardElevated border-cyber-cyan/50 shadow-neon-cyan'
                    : 'bg-white border-cyan-500 shadow-md ring-2 ring-cyan-400/20 text-slate-900'
                  : isDark
                    ? 'bg-cyber-card border-white/[0.06] text-zinc-400 hover:border-white/15'
                    : 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white shadow-sm'
              }`}
            >
              {/* Active Indicator Top Light */}
              {isSelected && (
                <div className={`absolute -top-1 left-3 right-3 h-0.5 rounded-full ${
                  isDark ? 'bg-cyber-cyan shadow-sm' : 'bg-cyan-500'
                }`} />
              )}

              <div className="flex items-center justify-between mb-1">
                <span className={`font-mono text-xs font-black ${
                  isSelected 
                    ? isDark ? 'text-cyber-cyan' : 'text-cyan-700'
                    : isDark ? 'text-zinc-300' : 'text-slate-800'
                }`}>
                  Week {week.weekNumber}
                </span>

                {isComplete ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                    {completedCount}/4
                  </span>
                )}
              </div>

              <div className={`text-[9px] font-bold truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {getPhaseName(week.phase)}
              </div>

              {/* Progress bar inside card */}
              <div className={`w-full rounded-full h-1 mt-1.5 overflow-hidden ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}>
                <div 
                  className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : isDark ? 'bg-cyber-cyan' : 'bg-cyan-600'}`}
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
