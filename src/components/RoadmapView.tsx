import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  ChevronRight, 
  Calendar
} from 'lucide-react';
import { AppState } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { sound } from '../utils/sound';

interface RoadmapViewProps {
  state: AppState;
  onSelectWeek: (weekNumber: number) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ state, onSelectWeek }) => {
  const isDark = state.theme === 'dark';
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [activeLadderIndex, setActiveLadderIndex] = useState<number>(3);

  const totalTasks = CURRICULUM_DATA.length * 4;
  const completedCount = state.completedTaskIds.length;
  const overallPercent = Math.min(100, Math.round((completedCount / totalTasks) * 100));

  const filteredWeeks = selectedPhase === 'all'
    ? CURRICULUM_DATA
    : CURRICULUM_DATA.filter(w => w.phase === selectedPhase);

  const salaryLadder = [
    {
      level: 'Step 0: Baseline',
      salary: '7.5 LPA',
      role: 'Member Technical @ ADP',
      focus: 'Enterprise maintenance, framework dependency, AI autocomplete crutch',
      expectations: ['Ticket execution', 'Bug reproduction', 'Framework-bound endpoints'],
      interviewFormat: 'Basic language syntax + past company project review'
    },
    {
      level: 'Step 1: Code Stamina',
      salary: '12–14 LPA',
      role: 'Backend SDE-II',
      focus: 'Independent coding muscle without AI, clean REST & SQL indexing',
      expectations: ['Solve LeetCode Mediums on blank screen in 25m', 'Postgres EXPLAIN ANALYZE', 'FastAPI Pydantic v2'],
      interviewFormat: '45-minute live coding round (zero hints) + Basic System Design'
    },
    {
      level: 'Step 2: Distributed Scale',
      salary: '16–18 LPA',
      role: 'Senior Backend Engineer',
      focus: 'Distributed caching, message queues, hybrid vector search & RAG evaluation',
      expectations: ['Redis distributed locks with Lua', 'Kafka partitioning & idempotency', 'Dense + BM25 Hybrid Search'],
      interviewFormat: 'High-Level Design (HLD) + LLD concurrency interview'
    },
    {
      level: 'Step 3: Staff & AI Mastery',
      salary: '20–25+ LPA',
      role: 'Staff Backend + Applied AI',
      focus: 'End-to-end HLD bar-raiser clearance, AI Agents, local quantized LLMs, RCA command',
      expectations: ['Multi-agent deterministic handoffs', 'PII guardrails & SSRF defense', 'Production Incident RCA Command'],
      interviewFormat: 'Senior Bar-Raiser Architecture + Offer Negotiation Firepower'
    }
  ];

  return (
    <div className="px-4 py-4 pb-32">
      {/* 1. Header Card with Salary Ladder */}
      <div className={`p-5 rounded-3xl border mb-4 transition-colors ${
        isDark 
          ? 'border-white/[0.12] bg-cyber-cardElevated shadow-cockpit' 
          : 'border-slate-200 bg-white shadow-xl'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDark 
                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-neon-flame' 
                : 'bg-amber-100 border border-amber-300 text-amber-600 shadow-sm'
            }`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                The 18-Month 20 LPA Ladder
              </h2>
              <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Career Trajectory for ADP Engineers
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
            isDark 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {overallPercent}% Complete
          </span>
        </div>

        {/* Salary Ladder Steps */}
        <div className="grid grid-cols-4 gap-1.5 my-3">
          {salaryLadder.map((step, idx) => {
            const isActive = activeLadderIndex === idx;
            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sound.playTactileClick();
                  setActiveLadderIndex(idx);
                }}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  isActive
                    ? idx === 3
                      ? 'bg-amber-500 text-slate-950 font-black shadow-neon-flame border-amber-400'
                      : idx === 2
                        ? isDark ? 'bg-cyber-cyan text-slate-950 font-black shadow-neon-cyan border-cyber-cyan' : 'bg-cyan-600 text-white font-black shadow-md border-cyan-700'
                        : idx === 1
                          ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400'
                          : isDark ? 'bg-zinc-800 text-white border-zinc-600' : 'bg-slate-800 text-white border-slate-700'
                    : isDark 
                      ? 'bg-cyber-bg/80 border-white/[0.08] text-zinc-400 hover:border-white/15' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="text-[9px] uppercase tracking-wider block opacity-75 font-bold">
                  {step.level.split(':')[0]}
                </span>
                <span className="text-xs font-black block my-0.5">
                  {step.salary}
                </span>
                <span className="text-[9px] block truncate opacity-70">
                  {step.role.split(' ')[0]}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Active Ladder Detail Drawer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLadderIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`p-3.5 rounded-2xl border text-xs mt-3 ${
              isDark ? 'bg-cyber-bg border-white/[0.08]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-black text-amber-500 flex items-center gap-1.5 text-xs">
                <Zap className="w-3.5 h-3.5 fill-current" />
                {salaryLadder[activeLadderIndex].role} ({salaryLadder[activeLadderIndex].salary})
              </span>
              <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {salaryLadder[activeLadderIndex].level}
              </span>
            </div>

            <p className={`text-[11px] leading-relaxed mb-2.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              {salaryLadder[activeLadderIndex].focus}
            </p>

            <div className="space-y-1 mb-2">
              <span className={`text-[10px] font-black uppercase block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Target Interview Expectations:
              </span>
              {salaryLadder[activeLadderIndex].expectations.map((exp, eIdx) => (
                <div key={eIdx} className={`flex items-start gap-1.5 text-[11px] ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  <span className="text-cyber-cyan font-bold">•</span>
                  <span>{exp}</span>
                </div>
              ))}
            </div>

            <div className={`p-2 rounded-xl border text-[10px] ${
              isDark ? 'bg-zinc-900/90 border-white/5 text-zinc-400' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <strong className={isDark ? 'text-zinc-200' : 'text-slate-900'}>Interview Bar:</strong> {salaryLadder[activeLadderIndex].interviewFormat}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className={`w-full rounded-full h-2 mt-3.5 overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(5, overallPercent)}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-emerald-500 via-cyber-cyan to-amber-500 rounded-full"
          />
        </div>
      </div>

      {/* 2. Phase Filter Pills */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedPhase('all')}
          className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all ${
            selectedPhase === 'all'
              ? isDark ? 'bg-white text-slate-950 shadow-md' : 'bg-slate-900 text-white shadow-md'
              : isDark ? 'bg-cyber-card border border-white/10 text-zinc-400' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          All 16 Weeks
        </button>
        <button
          onClick={() => setSelectedPhase(1)}
          className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all ${
            selectedPhase === 1
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : isDark ? 'bg-cyber-card border border-white/10 text-emerald-400' : 'bg-white border border-emerald-200 text-emerald-700'
          }`}
        >
          Phase 1 (W1–6)
        </button>
        <button
          onClick={() => setSelectedPhase(2)}
          className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all ${
            selectedPhase === 2
              ? isDark ? 'bg-cyber-cyan text-slate-950 shadow-neon-cyan' : 'bg-cyan-600 text-white shadow-md'
              : isDark ? 'bg-cyber-card border border-white/10 text-cyber-cyan' : 'bg-white border border-cyan-200 text-cyan-700'
          }`}
        >
          Phase 2 (W7–12)
        </button>
        <button
          onClick={() => setSelectedPhase(3)}
          className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all ${
            selectedPhase === 3
              ? 'bg-amber-500 text-slate-950 shadow-neon-flame'
              : isDark ? 'bg-cyber-card border border-white/10 text-amber-400' : 'bg-white border border-amber-200 text-amber-700'
          }`}
        >
          Phase 3 (W13–16)
        </button>
      </div>

      {/* 3. Weeks List */}
      <div className="space-y-2.5">
        {filteredWeeks.map((week) => {
          const isSelected = state.currentWeek === week.weekNumber;
          const weekTaskIds = [
            week.saturday.block1Task.id,
            week.saturday.block2Task.id,
            week.sunday.block1Task.id,
            week.sunday.block2Task.id
          ];
          const completedCount = weekTaskIds.filter(id => state.completedTaskIds.includes(id)).length;
          const isComplete = completedCount === 4;

          return (
            <motion.div
              key={week.weekNumber}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playTactileClick();
                onSelectWeek(week.weekNumber);
              }}
              className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                isSelected
                  ? isDark
                    ? 'bg-cyber-cardElevated border-cyber-cyan shadow-neon-cyan'
                    : 'bg-cyan-50/80 border-cyan-500 shadow-md ring-2 ring-cyan-400/20'
                  : isDark
                    ? 'bg-cyber-card border-white/[0.08] hover:border-white/15'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-lg border ${
                      isDark 
                        ? 'bg-zinc-800 text-cyber-cyan border-white/10' 
                        : 'bg-cyan-100 text-cyan-800 border-cyan-200'
                    }`}>
                      Week {week.weekNumber}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Phase {week.phase}
                    </span>
                    {isComplete ? (
                      <span className={`text-[10px] font-black px-2 py-0.2 rounded-full border ${
                        isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        Complete ✓
                      </span>
                    ) : (
                      <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                        {completedCount}/4 done
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs font-extrabold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {week.weeklyGoal}
                  </h4>

                  <div className={`grid grid-cols-2 gap-2 mt-2 pt-2 border-t text-[10px] ${
                    isDark ? 'border-white/[0.06] text-zinc-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <div className="truncate">
                      <span className="text-emerald-500 font-bold">Sat:</span> {week.saturday.block1Task.title.split(':')[0]}
                    </div>
                    <div className="truncate">
                      <span className={isDark ? 'text-cyber-cyan font-bold' : 'text-cyan-700 font-bold'}>Sun:</span> {week.sunday.block1Task.title.split(':')[0]}
                    </div>
                  </div>
                </div>

                <div className={`p-2 rounded-xl shrink-0 mt-1 ${
                  isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-600'
                }`}>
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
