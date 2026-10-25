import React, { useRef, useEffect } from 'react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
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

  const getPhaseShort = (phase: number) => {
    switch (phase) {
      case 1: return 'P1 // CODE MUSCLE';
      case 2: return 'P2 // SCALE & RAG';
      case 3: return 'P3 // BAR-RAISER';
      default: return '';
    }
  };

  return (
    <div className={`px-3.5 sm:px-6 py-2.5 border-b font-mono transition-colors duration-150 ${
      isDark 
        ? 'border-white/[0.08] bg-[#09090B]' 
        : 'border-neutral-200 bg-neutral-50'
    }`}>
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Horizon Matrix
          </span>
          <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 border ${
            isDark ? 'border-neutral-700 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-950 font-bold'
          }`}>
            WK {String(currentWeek).padStart(2, '0')} / 16
          </span>
        </div>

        {/* Scroll Chevrons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => scrollBy(-180)}
            aria-label="Previous weeks"
            className={`p-1.5 border transition-colors min-h-[30px] min-w-[30px] flex items-center justify-center ${
              isDark 
                ? 'border-neutral-800 text-neutral-400 hover:text-white active:bg-neutral-800' 
                : 'border-neutral-200 text-neutral-600 hover:text-neutral-900 active:bg-neutral-200'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scrollBy(180)}
            aria-label="Next weeks"
            className={`p-1.5 border transition-colors min-h-[30px] min-w-[30px] flex items-center justify-center ${
              isDark 
                ? 'border-neutral-800 text-neutral-400 hover:text-white active:bg-neutral-800' 
                : 'border-neutral-200 text-neutral-600 hover:text-neutral-900 active:bg-neutral-200'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Snap-Scrolling Horizon Bar */}
      <div 
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth snap-x snap-mandatory touch-pan-x"
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
            <button
              key={week.weekNumber}
              ref={isSelected ? selectedButtonRef : undefined}
              onClick={() => {
                sound.playTactileClick();
                onSelectWeek(week.weekNumber);
              }}
              className={`snap-start relative shrink-0 p-2 sm:p-2.5 border text-left transition-all min-w-[94px] sm:min-w-[104px] min-h-[58px] ${
                isSelected
                  ? isDark
                    ? 'border-white bg-neutral-900 text-white'
                    : 'border-neutral-950 bg-white text-neutral-950 ring-1 ring-neutral-950'
                  : isDark
                    ? 'border-neutral-800/80 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 active:border-neutral-500'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 active:border-neutral-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] sm:text-xs font-bold tracking-tight ${
                  isSelected 
                    ? isDark ? 'text-white' : 'text-neutral-950'
                    : isDark ? 'text-neutral-300' : 'text-neutral-700'
                }`}>
                  WK {String(week.weekNumber).padStart(2, '0')}
                </span>

                {isComplete ? (
                  <span className="flex items-center text-emerald-500 font-bold text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-[10px] text-neutral-500 tabular-nums">
                    {completedCount}/4
                  </span>
                )}
              </div>

              <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-500 truncate">
                {getPhaseShort(week.phase)}
              </div>

              {/* Minimalist Hairline Progress Bar */}
              <div className={`w-full h-0.5 mt-2 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                <div 
                  className={`h-full ${isComplete ? 'bg-emerald-500' : isDark ? 'bg-white' : 'bg-neutral-950'}`}
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
