import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  CheckCircle2, 
  BarChart3,
  ChevronRight,
  Award,
  Zap,
  Briefcase,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { AppState } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { sound } from '../utils/sound';

interface RoadmapTabProps {
  state: AppState;
  onSelectWeek: (weekNumber: number) => void;
}

export const RoadmapTab: React.FC<RoadmapTabProps> = ({ state, onSelectWeek }) => {
  const isDark = state.theme === 'dark';
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | 'all'>('all');
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(3); // default to 20 LPA goal

  const totalTasks = CURRICULUM_DATA.length * 4;
  const completedCount = state.completedTaskIds.length;
  const overallPercent = Math.min(100, Math.round((completedCount / totalTasks) * 100));

  const filteredWeeks = selectedPhaseFilter === 'all'
    ? CURRICULUM_DATA
    : CURRICULUM_DATA.filter(w => w.phase === selectedPhaseFilter);

  const handleWeekClick = (weekNumber: number) => {
    sound.playTactileClick();
    onSelectWeek(weekNumber);
  };

  const salaryMilestones = [
    {
      title: 'Baseline (Current)',
      salary: '7.5 LPA',
      role: 'Member Technical @ ADP',
      badge: 'Current Level',
      color: 'slate',
      description: 'Enterprise workflow maintenance, internal framework dependence, Copilot crutch.',
      skills: ['Framework APIs', 'Bug fixes', 'Assisted coding']
    },
    {
      title: 'Milestone 1',
      salary: '12–14 LPA',
      role: 'Backend SDE-II',
      badge: 'Phase 1 Complete',
      color: 'emerald',
      description: 'Independent Python/DSA coding stamina without autocomplete; raw REST & SQL fluency.',
      skills: ['Array/Window DSA', 'FastAPI Pydantic v2', 'SQL Indexing EXPLAIN']
    },
    {
      title: 'Milestone 2',
      salary: '16–18 LPA',
      role: 'Senior Backend Engineer',
      badge: 'Phase 2 Complete',
      color: 'indigo',
      description: 'Distributed caching (Redis), message streaming (Kafka), hybrid vector search & RAG evaluation.',
      skills: ['Distributed Locks', 'Kafka Event Bus', 'Cross-Encoder Rerank']
    },
    {
      title: 'Target Goal',
      salary: '20–25+ LPA',
      role: 'Staff Backend + Applied AI',
      badge: '18-Month Target',
      color: 'amber',
      description: 'End-to-end HLD bar-raiser clearance, AI agent tool calling, offline LLMs, zero-defect execution.',
      skills: ['High-Scale HLD', 'Autonomous Agents', 'RCA Incident Command']
    }
  ];

  return (
    <div className="px-4 py-3 pb-32">
      {/* 1. Header & Salary Journey Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-3xl mb-4 border relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-obsidian-card via-slate-900 to-indigo-950/40 border-white/[0.08] text-slate-100 shadow-xl' 
            : 'bg-gradient-to-br from-white via-indigo-50/30 to-emerald-50/30 border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">The 18-Month 20 LPA Ladder</h2>
              <p className="text-[11px] text-slate-400">ADP Member Technical ➔ Senior Applied AI Engineer</p>
            </div>
          </div>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {overallPercent}% Complete
          </span>
        </div>

        {/* Salary Milestone Stepper with Motion Selection */}
        <div className="grid grid-cols-4 gap-1.5 my-3 text-center">
          {salaryMilestones.map((m, idx) => {
            const isActive = activeMilestoneIndex === idx;
            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sound.playTactileClick();
                  setActiveMilestoneIndex(idx);
                }}
                className={`p-2 rounded-2xl border transition-all relative ${
                  isActive
                    ? idx === 3
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-glow-amber'
                      : idx === 2
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-glow-indigo'
                        : idx === 1
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-glow-emerald'
                          : 'bg-slate-800 border-slate-600 text-white'
                    : isDark ? 'bg-slate-900/60 border-white/[0.05] text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <span className="text-[9px] font-bold uppercase block tracking-wider opacity-80">{m.title.split(' ')[0]}</span>
                <div className="text-xs font-black tracking-tight my-0.5">{m.salary}</div>
                <div className="text-[9px] truncate opacity-70 leading-none">{m.role.split(' ')[0]}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Active Milestone Highlight Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMilestoneIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`p-3 rounded-2xl border mt-2.5 text-xs ${
              isDark ? 'bg-slate-950/70 border-white/[0.06] text-slate-300' : 'bg-white/80 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-amber-400 flex items-center gap-1 text-[11px]">
                <Zap className="w-3.5 h-3.5" />
                {salaryMilestones[activeMilestoneIndex].role} ({salaryMilestones[activeMilestoneIndex].salary})
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {salaryMilestones[activeMilestoneIndex].badge}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              {salaryMilestones[activeMilestoneIndex].description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {salaryMilestones[activeMilestoneIndex].skills.map((skill, sIdx) => (
                <span key={sIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800/90 text-indigo-300 border border-white/5">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Overall Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden mt-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(5, overallPercent)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* 2. Skills Competency Matrix */}
      <div className={`p-4 rounded-3xl mb-4 border ${
        isDark ? 'bg-obsidian-card border-white/[0.08] text-slate-100 shadow-md' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
            20 LPA Benchmark Skills Matrix
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow-emerald" />
                Raw Coding & DSA Muscle (No-AI)
              </span>
              <span className="font-mono text-emerald-400 font-bold">80% Target</span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ duration: 0.8 }} className="h-full bg-emerald-500 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-glow-indigo" />
                Scalable Backend (FastAPI, Redis, Kafka, SQL)
              </span>
              <span className="font-mono text-indigo-400 font-bold">85% Target</span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 0.8, delay: 0.1 }} className="h-full bg-indigo-500 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-glow-amber" />
                Production Applied AI (RAG, Agents, Qdrant)
              </span>
              <span className="font-mono text-amber-400 font-bold">90% Target</span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full bg-amber-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Phase Filter Pills */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedPhaseFilter('all')}
          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedPhaseFilter === 'all'
              ? 'bg-slate-100 text-slate-900 shadow-sm'
              : isDark ? 'bg-slate-900 border border-white/10 text-slate-400' : 'bg-slate-100 text-slate-600'
          }`}
        >
          All 16 Weeks
        </button>
        <button
          onClick={() => setSelectedPhaseFilter(1)}
          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedPhaseFilter === 1
              ? 'bg-emerald-500 text-white shadow-sm'
              : isDark ? 'bg-slate-900 border border-white/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          Phase 1 (W1-6)
        </button>
        <button
          onClick={() => setSelectedPhaseFilter(2)}
          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedPhaseFilter === 2
              ? 'bg-indigo-600 text-white shadow-sm'
              : isDark ? 'bg-slate-900 border border-white/10 text-indigo-400' : 'bg-indigo-50 text-indigo-700'
          }`}
        >
          Phase 2 (W7-12)
        </button>
        <button
          onClick={() => setSelectedPhaseFilter(3)}
          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedPhaseFilter === 3
              ? 'bg-amber-500 text-white shadow-sm'
              : isDark ? 'bg-slate-900 border border-white/10 text-amber-400' : 'bg-amber-50 text-amber-700'
          }`}
        >
          Phase 3 (W13-16)
        </button>
      </div>

      {/* 4. Week-by-Week Visual Cards */}
      <div className="space-y-3">
        {filteredWeeks.map((week) => {
          const isCurrent = state.currentWeek === week.weekNumber;
          const satTasksCompleted = [week.saturday.block1Task.id, week.saturday.block2Task.id].filter(id => state.completedTaskIds.includes(id)).length;
          const sunTasksCompleted = [week.sunday.block1Task.id, week.sunday.block2Task.id].filter(id => state.completedTaskIds.includes(id)).length;
          const weekDone = satTasksCompleted + sunTasksCompleted;

          return (
            <motion.div
              key={week.weekNumber}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWeekClick(week.weekNumber)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                isCurrent
                  ? isDark
                    ? 'bg-slate-900/90 border-indigo-500/50 shadow-glow-indigo'
                    : 'bg-white border-indigo-400 shadow-md ring-2 ring-indigo-400/30'
                  : isDark
                    ? 'bg-obsidian-card border-white/[0.08] hover:border-white/20 text-slate-200 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-indigo-300 border border-white/10">
                      Week {week.weekNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {week.phase === 1 ? 'Phase 1' : week.phase === 2 ? 'Phase 2' : 'Phase 3'}
                    </span>
                    {weekDone === 4 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-extrabold leading-snug">
                    {week.weeklyGoal}
                  </h4>

                  {/* Summary of Saturday & Sunday Focus */}
                  <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-white/[0.05] text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate">Sat: {week.saturday.block1Task.title.split(':')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="truncate">Sun: {week.sunday.block1Task.title.split(':')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-center p-2 rounded-2xl bg-slate-800/60 text-slate-400">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
