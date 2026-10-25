import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Network, 
  Sparkles,
  ArrowUpRight
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

  // Categorize completed tasks by Target Domain
  const getDomainStats = () => {
    let dsaCompleted = 0;
    let dsaTotal = 0;
    let backendCompleted = 0;
    let backendTotal = 0;
    let sysDesignCompleted = 0;
    let sysDesignTotal = 0;
    let appliedAiCompleted = 0;
    let appliedAiTotal = 0;

    CURRICULUM_DATA.forEach(week => {
      const tasks = [
        week.saturday.block1Task,
        week.saturday.block2Task,
        week.sunday.block1Task,
        week.sunday.block2Task
      ];

      tasks.forEach(task => {
        const isDone = state.completedTaskIds.includes(task.id);
        if (task.category === 'dsa') {
          dsaTotal++;
          if (isDone) dsaCompleted++;
        } else if (task.category === 'backend') {
          backendTotal++;
          if (isDone) backendCompleted++;
        } else if (task.category === 'system-design') {
          sysDesignTotal++;
          if (isDone) sysDesignCompleted++;
        } else if (task.category === 'applied-ai') {
          appliedAiTotal++;
          if (isDone) appliedAiCompleted++;
        }
      });
    });

    return [
      {
        id: 'dsa',
        name: 'DSA & Algorithmic Recall',
        code: 'AREA_01',
        icon: Terminal,
        completed: dsaCompleted,
        total: dsaTotal,
        percent: dsaTotal > 0 ? Math.round((dsaCompleted / dsaTotal) * 100) : 0,
        topics: ['Two Pointers', 'Sliding Window', 'Monotonic Queue', 'Dynamic Programming', 'Graph BFS/DFS']
      },
      {
        id: 'backend',
        name: 'High-Performance Backend',
        code: 'AREA_02',
        icon: Cpu,
        completed: backendCompleted,
        total: backendTotal,
        percent: backendTotal > 0 ? Math.round((backendCompleted / backendTotal) * 100) : 0,
        topics: ['Async FastAPI', 'PostgreSQL GIN/B-Tree', 'Redis Lua Atomic Locks', 'Connection Pools']
      },
      {
        id: 'system-design',
        name: 'Distributed Systems (HLD)',
        code: 'AREA_03',
        icon: Network,
        completed: sysDesignCompleted,
        total: sysDesignTotal,
        percent: sysDesignTotal > 0 ? Math.round((sysDesignCompleted / sysDesignTotal) * 100) : 0,
        topics: ['Kafka Partitioning', 'Rate Limiters', 'Quorums & Consensus', 'SSRF Defense']
      },
      {
        id: 'applied-ai',
        name: 'Applied AI & RAG Systems',
        code: 'AREA_04',
        icon: Sparkles,
        completed: appliedAiCompleted,
        total: appliedAiTotal,
        percent: appliedAiTotal > 0 ? Math.round((appliedAiCompleted / appliedAiTotal) * 100) : 0,
        topics: ['Hybrid BM25 + Dense Search', 'Vector Embeddings', 'Deterministic Multi-Agent State', 'RAG Evals']
      }
    ];
  };

  const domainStats = getDomainStats();

  const salaryLadder = [
    {
      level: 'STEP 00 // BASELINE',
      salary: '7.5 LPA',
      role: 'Member Technical @ ADP',
      focus: 'Enterprise maintenance, framework dependency, AI autocomplete reliance',
      expectations: ['Ticket execution', 'Bug reproduction', 'Framework-bound endpoints'],
      interviewFormat: 'Basic syntax quiz + past internal company bug review'
    },
    {
      level: 'STEP 01 // CODE STAMINA',
      salary: '12–14 LPA',
      role: 'Backend SDE-II',
      focus: 'Independent coding muscle without AI, clean REST & SQL indexing',
      expectations: ['Solve LeetCode Mediums on blank screen in 25m', 'Postgres EXPLAIN ANALYZE', 'FastAPI Pydantic v2'],
      interviewFormat: '45-minute live blank-screen coding round (zero hints) + Basic System Design'
    },
    {
      level: 'STEP 02 // DISTRIBUTED SCALE',
      salary: '16–18 LPA',
      role: 'Senior Backend Engineer',
      focus: 'Distributed caching, message queues, hybrid vector search & RAG evaluation',
      expectations: ['Redis distributed locks with Lua', 'Kafka partitioning & idempotency', 'Dense + BM25 Hybrid Search'],
      interviewFormat: 'High-Level Design (HLD) + LLD concurrency interview'
    },
    {
      level: 'STEP 03 // STAFF & APPLIED AI',
      salary: '20–25+ LPA',
      role: 'Staff Backend + Applied AI',
      focus: 'End-to-end HLD bar-raiser clearance, AI Agents, local quantized LLMs, RCA command',
      expectations: ['Multi-agent deterministic handoffs', 'PII guardrails & SSRF defense', 'Production Incident RCA Command'],
      interviewFormat: 'Senior Bar-Raiser Architecture + Offer Negotiation Firepower'
    }
  ];

  return (
    <div className="px-3.5 sm:px-6 py-4 pb-36">
      {/* 1. Header Plate: Exhibition Horizon Overview */}
      <div className={`p-4 sm:p-6 border mb-5 transition-colors ${
        isDark ? 'border-neutral-800 bg-neutral-900/40 text-neutral-100' : 'border-neutral-200 bg-white text-neutral-900 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 font-mono">
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 block">
              Dossier // 16-Week Mastery Trajectory
            </span>
            <h2 className={`font-display text-base sm:text-xl font-bold tracking-tight uppercase mt-0.5 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Progress & Target Area Matrix
            </h2>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className={`text-[10px] sm:text-xs px-2 py-0.5 border font-bold uppercase tracking-wider ${
              isDark ? 'border-neutral-700 bg-neutral-900 text-white' : 'border-neutral-300 bg-neutral-100 text-neutral-950'
            }`}>
              {completedCount} / {totalTasks} Done
            </span>
            <span className={`text-[10px] sm:text-xs px-2 py-0.5 border font-bold uppercase tracking-wider ${
              isDark ? 'border-blue-500/40 bg-blue-950/40 text-blue-300' : 'border-blue-300 bg-blue-50 text-blue-800'
            }`}>
              {overallPercent}% Complete
            </span>
          </div>
        </div>

        {/* Minimalist Hairline Progress Bar */}
        <div className={`w-full h-1 border border-neutral-300 dark:border-neutral-800 ${isDark ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
          <div 
            className={`h-full transition-all duration-500 ${isDark ? 'bg-white' : 'bg-neutral-950'}`}
            style={{ width: `${Math.max(2, overallPercent)}%` }}
          />
        </div>
      </div>

      {/* 2. Target Area Breakdown Matrix (Single Column on Mobile for Maximum Readability) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5 font-mono">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500">
            Competency Domains // Target Areas
          </span>
          <span className="text-[9px] sm:text-[10px] text-neutral-400">
            4 Core Vectors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {domainStats.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.id}
                className={`p-3.5 sm:p-4 border font-mono transition-colors ${
                  isDark ? 'border-neutral-800 bg-neutral-900/30' : 'border-neutral-200 bg-white shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="p-1.5 border border-neutral-300 dark:border-neutral-700 shrink-0">
                      <Icon className="w-3.5 h-3.5 text-neutral-400" />
                    </span>
                    <div className="min-w-0">
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-500 block">
                        {domain.code}
                      </span>
                      <h3 className={`text-xs font-bold uppercase tracking-tight truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {domain.name}
                      </h3>
                    </div>
                  </div>
                  <span className={`text-[11px] sm:text-xs font-bold px-2 py-0.5 border shrink-0 ${
                    domain.percent === 100 
                      ? 'border-emerald-600 bg-emerald-950 text-emerald-300' 
                      : isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
                  }`}>
                    {domain.percent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className={`w-full h-1 my-2 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                  <div 
                    className={`h-full ${isDark ? 'bg-blue-500' : 'bg-neutral-900'}`}
                    style={{ width: `${domain.percent}%` }}
                  />
                </div>

                {/* Topics / Focus Items (Pills with generous touch reading wrap) */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {domain.topics.map((t, i) => (
                    <span
                      key={i}
                      className={`text-[9px] px-1.5 py-0.5 border leading-tight ${
                        isDark ? 'border-neutral-800/80 bg-neutral-950 text-neutral-400' : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. The 18-Month 20 LPA Ladder Drawer (Mobile 2x2 Grid) */}
      <div className={`p-4 sm:p-5 border mb-6 font-mono ${
        isDark ? 'border-neutral-800 bg-neutral-900/20' : 'border-neutral-200 bg-neutral-50'
      }`}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500">
            Market Compensation Benchmarks
          </span>
          <span className="text-[9px] sm:text-[10px] text-amber-500 uppercase font-bold">
            20–25+ LPA Bar
          </span>
        </div>

        {/* Step Buttons (2 columns on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2.5">
          {salaryLadder.map((step, idx) => {
            const isActive = activeLadderIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  sound.playTactileClick();
                  setActiveLadderIndex(idx);
                }}
                className={`p-2.5 min-h-[62px] border text-left transition-all ${
                  isActive
                    ? isDark
                      ? 'border-white bg-white text-neutral-950 font-bold'
                      : 'border-neutral-950 bg-neutral-950 text-white font-bold'
                    : isDark 
                      ? 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white active:bg-neutral-900' 
                      : 'border-neutral-200 bg-white text-neutral-600 hover:text-neutral-950 active:bg-neutral-100'
                }`}
              >
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider block opacity-70">
                  {step.level.split('//')[0].trim()}
                </span>
                <span className="text-[11px] sm:text-xs font-bold block my-0.5">
                  {step.salary}
                </span>
                <span className="text-[9px] truncate block opacity-75">
                  {step.role.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Step Details */}
        <div className={`p-3.5 border text-xs ${
          isDark ? 'border-neutral-800 bg-black/50 text-neutral-200' : 'border-neutral-200 bg-white text-neutral-900'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-[11px] sm:text-xs uppercase tracking-wider text-blue-500 truncate mr-2">
              {salaryLadder[activeLadderIndex].role} // {salaryLadder[activeLadderIndex].salary}
            </span>
            <span className="text-[9px] sm:text-[10px] text-neutral-500 shrink-0">
              {salaryLadder[activeLadderIndex].level}
            </span>
          </div>

          <p className="text-[11px] sm:text-xs leading-relaxed text-neutral-400 mb-2.5">
            {salaryLadder[activeLadderIndex].focus}
          </p>

          <div className="space-y-1 mb-2.5">
            <span className="text-[9px] uppercase tracking-wider text-neutral-500 block">
              Evaluation Criteria:
            </span>
            {salaryLadder[activeLadderIndex].expectations.map((exp, eIdx) => (
              <div key={eIdx} className="flex items-start gap-1.5 text-[11px] sm:text-xs">
                <span className="text-neutral-500 font-bold">›</span>
                <span>{exp}</span>
              </div>
            ))}
          </div>

          <div className={`p-2 border text-[10px] sm:text-[11px] ${
            isDark ? 'border-neutral-800 bg-neutral-950 text-neutral-400' : 'border-neutral-200 bg-neutral-100 text-neutral-700'
          }`}>
            <span className="font-bold uppercase text-neutral-300 dark:text-neutral-200">Interview Standard: </span>
            {salaryLadder[activeLadderIndex].interviewFormat}
          </div>
        </div>
      </div>

      {/* 4. Week-by-Week Progress Gallery (16 Exhibition Plates) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 font-mono">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500">
            Archival Index // 16 Week Curriculum
          </span>

          {/* Phase Filter Segmenter */}
          <div className={`grid grid-cols-4 sm:flex sm:items-center gap-1 p-0.5 border text-[10px] ${
            isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-100'
          }`}>
            <button
              onClick={() => setSelectedPhase('all')}
              className={`py-1.5 px-2 text-center uppercase font-bold transition-all ${
                selectedPhase === 'all'
                  ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                  : 'text-neutral-400 hover:text-white active:bg-neutral-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedPhase(1)}
              className={`py-1.5 px-2 text-center uppercase font-bold transition-all ${
                selectedPhase === 1
                  ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                  : 'text-neutral-400 hover:text-white active:bg-neutral-800'
              }`}
            >
              P1
            </button>
            <button
              onClick={() => setSelectedPhase(2)}
              className={`py-1.5 px-2 text-center uppercase font-bold transition-all ${
                selectedPhase === 2
                  ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                  : 'text-neutral-400 hover:text-white active:bg-neutral-800'
              }`}
            >
              P2
            </button>
            <button
              onClick={() => setSelectedPhase(3)}
              className={`py-1.5 px-2 text-center uppercase font-bold transition-all ${
                selectedPhase === 3
                  ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                  : 'text-neutral-400 hover:text-white active:bg-neutral-800'
              }`}
            >
              P3
            </button>
          </div>
        </div>

        {/* The 16 Plates with Generous Mobile Layout */}
        <div className="space-y-2.5 font-mono">
          {filteredWeeks.map((week) => {
            const isSelected = state.currentWeek === week.weekNumber;
            const weekTaskIds = [
              week.saturday.block1Task.id,
              week.saturday.block2Task.id,
              week.sunday.block1Task.id,
              week.sunday.block2Task.id
            ];
            const completedInWeek = weekTaskIds.filter(id => state.completedTaskIds.includes(id)).length;
            const isComplete = completedInWeek === 4;

            return (
              <div
                key={week.weekNumber}
                onClick={() => {
                  sound.playTactileClick();
                  onSelectWeek(week.weekNumber);
                }}
                className={`p-3.5 sm:p-5 border transition-all cursor-pointer active:scale-[0.99] ${
                  isSelected
                    ? isDark
                      ? 'border-white bg-neutral-900/80 text-white'
                      : 'border-neutral-950 bg-neutral-50 text-neutral-950 ring-1 ring-neutral-950'
                    : isDark
                      ? 'border-neutral-800 bg-neutral-950/40 text-neutral-300 hover:border-neutral-700'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-[11px] sm:text-xs font-bold px-2 py-0.5 border uppercase tracking-wider shrink-0 ${
                      isSelected
                        ? isDark ? 'border-white bg-white text-black' : 'border-neutral-950 bg-neutral-950 text-white'
                        : isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-300' : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                    }`}>
                      WK {String(week.weekNumber).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-wider truncate">
                      P{week.phase} • {week.phaseTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isComplete ? (
                      <span className="text-[9px] px-1.5 py-0.5 border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 uppercase tracking-wider font-bold">
                        Archived ✓
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] text-neutral-500 tabular-nums">
                        {completedInWeek}/4 Done
                      </span>
                    )}

                    <div className="p-1 border border-neutral-700 dark:border-neutral-700 text-neutral-400">
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <h4 className={`font-display text-xs sm:text-base font-bold tracking-tight mb-2 leading-snug ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  {week.weeklyGoal}
                </h4>

                {/* Days sub-summary: Stacked on mobile so full task titles are readable */}
                <div className="space-y-1 text-[11px] pt-2 border-t border-neutral-200 dark:border-neutral-800/80 text-neutral-400">
                  <div className="truncate">
                    <span className="text-neutral-300 dark:text-neutral-200 font-bold uppercase text-[9px] mr-1">Sat:</span>
                    <span>{week.saturday.block1Task.title}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-neutral-300 dark:text-neutral-200 font-bold uppercase text-[9px] mr-1">Sun:</span>
                    <span>{week.sunday.block1Task.title}</span>
                  </div>
                </div>

                {/* Hairline completion meter */}
                <div className={`w-full h-0.5 mt-2.5 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                  <div 
                    className={`h-full ${isComplete ? 'bg-emerald-500' : isDark ? 'bg-white' : 'bg-neutral-950'}`}
                    style={{ width: `${(completedInWeek / 4) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
