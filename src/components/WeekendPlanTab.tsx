import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Send, 
  CheckCircle, 
  Layers, 
  Sparkles
} from 'lucide-react';
import { AppState, DayType, Task } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { DopamineShield } from './DopamineShield';
import { TaskCard } from './TaskCard';
import { sound } from '../utils/sound';

interface WeekendPlanTabProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onLaunchTimer: (task: Task) => void;
  onOpenCustomTaskModal: () => void;
}

export const WeekendPlanTab: React.FC<WeekendPlanTabProps> = ({
  state,
  onUpdateState,
  onLaunchTimer,
  onOpenCustomTaskModal
}) => {
  const isDark = state.theme === 'dark';
  const currentWeekData = CURRICULUM_DATA.find(w => w.weekNumber === state.currentWeek) || CURRICULUM_DATA[0];
  const activeDayPlan = state.selectedDay === 'saturday' ? currentWeekData.saturday : currentWeekData.sunday;

  const dayKey = `week-${state.currentWeek}-${state.selectedDay}`;
  const isShieldUnlocked = !!state.dopamineShieldStatus[dayKey];

  const [reflectionText, setReflectionText] = useState(state.reflections[dayKey] || '');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const isSaturday = state.selectedDay === 'saturday';

  const isBlock1Done = state.completedTaskIds.includes(activeDayPlan.block1Task.id);
  const isBlock2Done = state.completedTaskIds.includes(activeDayPlan.block2Task.id);
  
  const customTasksForDay = state.customTasks[dayKey] || [];
  const completedCustomCount = customTasksForDay.filter(t => state.completedTaskIds.includes(t.id)).length;

  const totalTasks = 2 + customTasksForDay.length;
  const completedTasks = (isBlock1Done ? 1 : 0) + (isBlock2Done ? 1 : 0) + completedCustomCount;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const handleSelectDay = (day: DayType) => {
    sound.playTactileClick();
    onUpdateState(prev => ({ ...prev, selectedDay: day }));
    setReflectionText(state.reflections[`week-${state.currentWeek}-${day}`] || '');
    setReflectionSaved(false);
  };

  const handleToggleShield = () => {
    onUpdateState(prev => ({
      ...prev,
      dopamineShieldStatus: {
        ...prev.dopamineShieldStatus,
        [dayKey]: !prev.dopamineShieldStatus[dayKey]
      }
    }));
  };

  const handleToggleTaskComplete = (taskId: string) => {
    onUpdateState(prev => {
      const isAlreadyCompleted = prev.completedTaskIds.includes(taskId);
      const newCompleted = isAlreadyCompleted
        ? prev.completedTaskIds.filter(id => id !== taskId)
        : [...prev.completedTaskIds, taskId];
      
      let streak = prev.streakCount;
      if (!isAlreadyCompleted && (newCompleted.includes(activeDayPlan.block1Task.id) && newCompleted.includes(activeDayPlan.block2Task.id))) {
        streak += 1;
      }

      return {
        ...prev,
        completedTaskIds: newCompleted,
        streakCount: streak
      };
    });
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

  return (
    <div className="pb-28">
      {/* 1. Saturday / Sunday Segmented Pill Switcher */}
      <div className="px-4 pt-3 pb-2">
        <div className={`p-1 rounded-2xl flex items-center border transition-all relative ${
          isDark ? 'bg-midnight-900 border-white/[0.08]' : 'bg-zinc-200/80 border-zinc-300'
        }`}>
          {/* Saturday Tab */}
          <button
            onClick={() => handleSelectDay('saturday')}
            className={`relative flex-1 py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors z-10 ${
              isSaturday ? 'text-white' : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600'
            }`}
          >
            {isSaturday && (
              <motion.div
                layoutId="activeDayTab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md border border-emerald-400/30"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isSaturday ? 'bg-white' : 'bg-emerald-400'}`} />
              <span>SATURDAY</span>
              <span className="text-[10px] opacity-80 font-normal hidden xs:inline">• DSA Muscle</span>
            </span>
          </button>

          {/* Sunday Tab */}
          <button
            onClick={() => handleSelectDay('sunday')}
            className={`relative flex-1 py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors z-10 ${
              !isSaturday ? 'text-white' : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600'
            }`}
          >
            {!isSaturday && (
              <motion.div
                layoutId="activeDayTab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryDark shadow-md border border-brand-primaryLight/30"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${!isSaturday ? 'bg-white' : 'bg-brand-primary'}`} />
              <span>SUNDAY</span>
              <span className="text-[10px] opacity-80 font-normal hidden xs:inline">• Applied AI</span>
            </span>
          </button>
        </div>
      </div>

      <div className="px-4">
        {/* 2. Coaching & Philosophy Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          key={state.selectedDay}
          className={`rounded-2xl p-3 my-2 flex items-center justify-between border text-xs ${
            isSaturday
              ? isDark
                ? 'bg-emerald-950/15 border-emerald-500/25 text-emerald-300'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : isDark
                ? 'bg-indigo-950/15 border-indigo-500/25 text-indigo-300'
                : 'bg-indigo-50 border-indigo-300 text-indigo-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{isSaturday ? '⚡' : '🧠'}</span>
            <div>
              <div className="font-extrabold uppercase tracking-wider text-[11px]">
                {isSaturday ? 'Raw Code Muscle & DSA Day' : 'System Design & Applied AI Day'}
              </div>
              <div className="text-[10px] font-medium opacity-85">
                {isSaturday 
                  ? 'Hand-code Python & SQL without AI autocomplete' 
                  : 'Architect microservices & build production RAG'}
              </div>
            </div>
          </div>
          <div className="text-right pl-2">
            <span className="font-mono font-extrabold text-xs">{completedTasks}/{totalTasks}</span>
            <div className="text-[9px] uppercase tracking-wider opacity-70">Done</div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full bg-midnight-800 rounded-full h-1.5 mb-3.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isSaturday ? 'bg-emerald-500' : 'bg-brand-primary'
            }`}
          />
        </div>

        {/* 3. Dopamine Shield */}
        <DopamineShield
          isUnlocked={isShieldUnlocked}
          onToggle={handleToggleShield}
          day={state.selectedDay}
          isDark={isDark}
        />

        {/* 4. Weekly Goal Callout */}
        <div className={`p-3 rounded-2xl mb-3 border flex items-start gap-2.5 ${
          isDark ? 'bg-midnight-850/60 border-white/[0.08] text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
        }`}>
          <Layers className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-extrabold text-amber-400">Week {state.currentWeek} Goal: </span>
            <span className="leading-relaxed">{currentWeekData.weeklyGoal}</span>
          </div>
        </div>

        {/* 5. 90-Minute Sprint Tasks */}
        <div className="space-y-1">
          <TaskCard
            task={activeDayPlan.block1Task}
            day={state.selectedDay}
            isUnlocked={isShieldUnlocked}
            isCompleted={isBlock1Done}
            onToggleComplete={() => handleToggleTaskComplete(activeDayPlan.block1Task.id)}
            onLaunchTimer={onLaunchTimer}
            isDark={isDark}
          />

          <TaskCard
            task={activeDayPlan.block2Task}
            day={state.selectedDay}
            isUnlocked={isShieldUnlocked}
            isCompleted={isBlock2Done}
            onToggleComplete={() => handleToggleTaskComplete(activeDayPlan.block2Task.id)}
            onLaunchTimer={onLaunchTimer}
            isDark={isDark}
          />

          {customTasksForDay.map(customTask => (
            <TaskCard
              key={customTask.id}
              task={customTask}
              day={state.selectedDay}
              isUnlocked={isShieldUnlocked}
              isCompleted={state.completedTaskIds.includes(customTask.id)}
              onToggleComplete={() => handleToggleTaskComplete(customTask.id)}
              onLaunchTimer={onLaunchTimer}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Add Custom Weekend Task Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playTactileClick();
            onOpenCustomTaskModal();
          }}
          className={`w-full py-2.5 px-3 rounded-xl border border-dashed flex items-center justify-center gap-1.5 text-xs font-bold transition-all my-2.5 ${
            isDark 
              ? 'border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200 bg-midnight-900/40' 
              : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-800 bg-zinc-50'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Custom {isSaturday ? 'Saturday' : 'Sunday'} Task</span>
        </motion.button>

        {/* 6. Daily Reflection Prompt Card */}
        <div className={`mt-3 p-3.5 rounded-2xl border ${
          isDark 
            ? 'bg-midnight-850/80 border-white/[0.08] text-zinc-200' 
            : 'bg-white border-zinc-200 text-zinc-800 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Reflection Journal
            </span>
          </div>

          <p className="text-xs font-semibold mb-2 text-zinc-300 italic">
            "{activeDayPlan.dailyReflectionPrompt}"
          </p>

          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Record what you coded from memory, the key complexity trade-off, or architectural nuance learned today..."
            rows={2}
            className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 ${
              isSaturday ? 'focus:ring-emerald-500' : 'focus:ring-brand-primary'
            } ${
              isDark 
                ? 'bg-midnight-950 border-white/[0.08] text-zinc-100 placeholder-zinc-600' 
                : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
            }`}
          />

          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[10px] text-zinc-500">
              {reflectionSaved ? '✓ Saved to journal' : 'Persisted in localStorage'}
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveReflection}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSaturday
                  ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-extrabold'
                  : 'bg-brand-primary text-white hover:bg-brand-primaryDark'
              }`}
            >
              {reflectionSaved ? <CheckCircle className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              <span>{reflectionSaved ? 'Saved!' : 'Save Reflection'}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
