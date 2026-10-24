import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, Task } from './types';
import { loadAppState, saveAppState } from './utils/storage';
import { CURRICULUM_DATA } from './data/curriculumData';
import { sound } from './utils/sound';
import { CockpitHeader } from './components/CockpitHeader';
import { WeekCarousel } from './components/WeekCarousel';
import { SprintDeckView } from './components/SprintDeckView';
import { RoadmapView } from './components/RoadmapView';
import { ADPImpactView } from './components/ADPImpactView';
import { FloatingNavDock } from './components/FloatingNavDock';
import { CustomTaskModal } from './components/CustomTaskModal';
import { SettingsModal } from './components/SettingsModal';

export function App() {
  const [state, setState] = useState<AppState>(loadAppState);
  const [isCustomTaskModalOpen, setIsCustomTaskModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  // Persistent Timer Engine: Runs across tabs without stopping
  useEffect(() => {
    const timer = state.activeSprintTimer;
    if (!timer) return;

    const isRunning = timer.b1Running || timer.breatherRunning || timer.b2Running;
    if (!isRunning) return;

    const currentWeekData = CURRICULUM_DATA.find(w => w.weekNumber === state.currentWeek) || CURRICULUM_DATA[0];
    const activePlan = state.selectedDay === 'saturday' ? currentWeekData.saturday : currentWeekData.sunday;

    const interval = setInterval(() => {
      setState(prev => {
        const cur = prev.activeSprintTimer;
        if (!cur) return prev;

        const next = { ...cur, lastTickTimestamp: Date.now() };

        if (cur.b1Running) {
          if (cur.b1Seconds <= 1) {
            sound.playCompletionChime();
            const b1Id = activePlan.block1Task.id;
            const newCompleted = prev.completedTaskIds.includes(b1Id)
              ? prev.completedTaskIds
              : [...prev.completedTaskIds, b1Id];
            return {
              ...prev,
              completedTaskIds: newCompleted,
              activeSprintTimer: {
                ...next,
                b1Seconds: 0,
                b1Running: false,
                activeStep: 2,
                breatherRunning: true
              }
            };
          }
          next.b1Seconds -= 1;
        } else if (cur.breatherRunning) {
          if (cur.breatherSeconds <= 1) {
            sound.playCompletionChime();
            return {
              ...prev,
              activeSprintTimer: {
                ...next,
                breatherSeconds: 0,
                breatherRunning: false,
                activeStep: 3,
                b2Running: true
              }
            };
          }
          next.breatherSeconds -= 1;
        } else if (cur.b2Running) {
          if (cur.b2Seconds <= 1) {
            sound.playCompletionChime();
            sound.stopAmbient();
            const b2Id = activePlan.block2Task.id;
            const newCompleted = prev.completedTaskIds.includes(b2Id)
              ? prev.completedTaskIds
              : [...prev.completedTaskIds, b2Id];

            const sessionKey = `week-${prev.currentWeek}-${prev.selectedDay}`;
            const sessions = prev.completedSessionKeys || [];
            const alreadyCredited = sessions.includes(sessionKey);
            const newSessions = alreadyCredited ? sessions : [...sessions, sessionKey];
            const newStreak = alreadyCredited ? prev.streakCount : prev.streakCount + 1;

            return {
              ...prev,
              completedTaskIds: newCompleted,
              completedSessionKeys: newSessions,
              streakCount: newStreak,
              activeSprintTimer: {
                ...next,
                b2Seconds: 0,
                b2Running: false,
                activeStep: 4,
                ambientType: 'none'
              }
            };
          }
          next.b2Seconds -= 1;
        }

        return { ...prev, activeSprintTimer: next };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    state.activeSprintTimer?.b1Running,
    state.activeSprintTimer?.breatherRunning,
    state.activeSprintTimer?.b2Running,
    state.currentWeek,
    state.selectedDay
  ]);

  // Global Keyboard Ergonomics: Space for timer play/pause, Esc for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCustomTaskModalOpen(false);
        setIsSettingsModalOpen(false);
      } else if (e.code === 'Space') {
        const activeTag = (document.activeElement?.tagName || '').toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
          return;
        }
        const timer = state.activeSprintTimer;
        if (!timer) return;
        e.preventDefault();
        sound.playTactileClick();
        if (timer.activeStep === 1) {
          setState(prev => ({
            ...prev,
            activeSprintTimer: {
              ...(prev.activeSprintTimer || timer),
              b1Running: !timer.b1Running
            }
          }));
        } else if (timer.activeStep === 2) {
          setState(prev => ({
            ...prev,
            activeSprintTimer: {
              ...(prev.activeSprintTimer || timer),
              breatherRunning: !timer.breatherRunning
            }
          }));
        } else if (timer.activeStep === 3) {
          setState(prev => ({
            ...prev,
            activeSprintTimer: {
              ...(prev.activeSprintTimer || timer),
              b2Running: !timer.b2Running
            }
          }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.activeSprintTimer]);

  const handleAddCustomTask = (task: Task) => {
    const dayKey = `week-${state.currentWeek}-${state.selectedDay}`;
    setState(prev => ({
      ...prev,
      customTasks: {
        ...prev.customTasks,
        [dayKey]: [...(prev.customTasks[dayKey] || []), task]
      }
    }));
  };

  const handleSelectWeekFromRoadmap = (weekNumber: number) => {
    setState(prev => ({
      ...prev,
      currentWeek: weekNumber,
      activeTab: 'plan'
    }));
  };

  const isDark = state.theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col items-center justify-start ${
      isDark ? 'bg-cyber-bg text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Container (Mobile Shell or Expanded View) */}
      <div className={`w-full transition-all duration-300 relative flex flex-col min-h-screen ${
        state.viewMode === 'mobile-shell'
          ? isDark 
            ? 'max-w-[430px] sm:my-5 sm:rounded-[44px] sm:shadow-cockpit sm:border sm:border-white/[0.12] sm:overflow-hidden sm:min-h-[890px] bg-cyber-bg'
            : 'max-w-[430px] sm:my-5 sm:rounded-[44px] sm:shadow-2xl sm:border sm:border-slate-200 sm:overflow-hidden sm:min-h-[890px] bg-white text-slate-900'
          : isDark ? 'max-w-3xl bg-cyber-bg' : 'max-w-3xl bg-white text-slate-900 shadow-md'
      }`}>
        {/* Cockpit Header */}
        <CockpitHeader
          state={state}
          onUpdateState={setState}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        {/* 16-Week Horizontal Scrubber */}
        <WeekCarousel
          currentWeek={state.currentWeek}
          completedTaskIds={state.completedTaskIds}
          onSelectWeek={(w) => setState(prev => ({ ...prev, currentWeek: w }))}
          isDark={isDark}
        />

        {/* Tab Content with Fluid Spring Motion */}
        <main className="flex-1 w-full overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.activeTab + '-' + state.currentWeek + '-' + state.selectedDay}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="w-full"
            >
              {state.activeTab === 'plan' && (
                <SprintDeckView
                  state={state}
                  onUpdateState={setState}
                  onOpenCustomTaskModal={() => setIsCustomTaskModalOpen(true)}
                />
              )}

              {state.activeTab === 'roadmap' && (
                <RoadmapView
                  state={state}
                  onSelectWeek={handleSelectWeekFromRoadmap}
                />
              )}

              {state.activeTab === 'adp-log' && (
                <ADPImpactView
                  state={state}
                  onUpdateState={setState}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Capsule Bottom Dock */}
        <FloatingNavDock
          activeTab={state.activeTab === 'timer' ? 'plan' : state.activeTab}
          onSelectTab={(tab) => setState(prev => ({ ...prev, activeTab: tab }))}
          adpLogCount={state.adpLogs.length}
          isDark={isDark}
        />

        {/* Modals */}
        <CustomTaskModal
          isOpen={isCustomTaskModalOpen}
          onClose={() => setIsCustomTaskModalOpen(false)}
          day={state.selectedDay}
          currentWeek={state.currentWeek}
          onAddTask={handleAddCustomTask}
          isDark={isDark}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          state={state}
          onUpdateState={setState}
        />
      </div>
    </div>
  );
}

export default App;
