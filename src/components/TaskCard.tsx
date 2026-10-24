import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Timer, 
  Code, 
  ChevronDown, 
  Copy, 
  Check, 
  BrainCircuit, 
  FileText
} from 'lucide-react';
import { Task, DayType } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface TaskCardProps {
  task: Task;
  day: DayType;
  isUnlocked: boolean;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onLaunchTimer: (task: Task) => void;
  isDark: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  day,
  isUnlocked,
  isCompleted,
  onToggleComplete,
  onLaunchTimer,
  isDark
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [userNotes, setUserNotes] = useState(task.notes || '');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const isSaturday = day === 'saturday';
  const accentBorder = isSaturday ? 'border-emerald-500/30' : 'border-indigo-500/30';
  const accentBg = isSaturday ? 'bg-emerald-500/10' : 'bg-indigo-500/10';
  const accentText = isSaturday ? 'text-emerald-400' : 'text-indigo-400';

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTactileClick();

    if (!isCompleted) {
      sound.playCompletionChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: isSaturday ? ['#10B981', '#34D399', '#059669', '#F59E0B'] : ['#6366F1', '#818CF8', '#4F46E5', '#F59E0B']
      });
    }
    onToggleComplete();
  };

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.codeSnippet) return;
    navigator.clipboard.writeText(task.codeSnippet);
    setCopiedCode(true);
    sound.playTactileClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleSubStep = (idx: number) => {
    sound.playTactileClick();
    setCompletedSteps(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Easy</span>;
      case 'Medium':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">Medium</span>;
      case 'Hard':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20">Hard</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden mb-3 ${
        !isUnlocked ? 'opacity-40 grayscale select-none' : 'opacity-100'
      } ${
        isCompleted
          ? isDark
            ? 'bg-midnight-900/40 border-white/[0.04] text-zinc-400'
            : 'bg-zinc-100 border-zinc-200 text-zinc-500'
          : isDark
            ? 'bg-midnight-850/80 border-white/[0.08] text-zinc-100 hover:border-white/15 shadow-sm'
            : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-300 shadow-sm'
      }`}
    >
      {/* Header bar of Task Card */}
      <div 
        className="p-3.5 cursor-pointer"
        onClick={() => isUnlocked && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Completion Checkbox */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleCheckboxClick}
            disabled={!isUnlocked}
            className={`mt-0.5 shrink-0 transition-transform ${
              !isUnlocked ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className={`w-5 h-5 ${isSaturday ? 'text-emerald-400 fill-emerald-500/20' : 'text-indigo-400 fill-indigo-500/20'}`} />
            ) : (
              <Circle className={`w-5 h-5 ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600'}`} />
            )}
          </motion.button>

          {/* Main Task Title & Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-1.5 mb-1">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${accentBg} ${accentText} border ${accentBorder}`}>
                Block {task.blockNumber} • 45m
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize ${
                isDark ? 'bg-midnight-700/80 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
              }`}>
                {task.category.replace('-', ' ')}
              </span>
              {getDifficultyBadge(task.difficulty)}
            </div>

            <h3 className={`text-xs font-black leading-snug tracking-tight ${isCompleted ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
              {task.title}
            </h3>

            <p className={`text-[11px] mt-1 leading-relaxed line-clamp-2 ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              {task.description}
            </p>
          </div>

          {/* Expand / Collapse Chevron */}
          <motion.div 
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={`p-1 rounded-lg shrink-0 ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Quick Action Footer: Start Timer & No-AI Pill */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>No-AI Autocomplete</span>
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              sound.playTactileClick();
              onLaunchTimer(task);
            }}
            disabled={!isUnlocked}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              isSaturday
                ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
                : 'bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Sprint in Timer</span>
          </motion.button>
        </div>
      </div>

      {/* Expandable Details Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`px-3.5 pb-3.5 pt-2 border-t text-xs overflow-hidden ${
              isDark ? 'bg-midnight-900/60 border-white/[0.05]' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            {/* Step-by-Step Execution Breakdown */}
            <div className="mb-3">
              <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>45-Minute Step-by-Step Plan</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {completedSteps.length}/{task.actionItems.length} done
                </span>
              </h4>
              <div className="space-y-1.5">
                {task.actionItems.map((item, idx) => {
                  const isStepDone = completedSteps.includes(idx);
                  return (
                    <motion.div
                      key={idx}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleSubStep(idx)}
                      className={`p-2 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                        isStepDone
                          ? isDark ? 'bg-emerald-950/20 border-emerald-500/30 text-zinc-400' : 'bg-emerald-50 border-emerald-300 text-zinc-500'
                          : isDark ? 'bg-midnight-950 border-white/[0.05] text-zinc-200 hover:border-zinc-700' : 'bg-white border-zinc-200 text-zinc-800'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded mt-0.5 shrink-0 flex items-center justify-center border transition-all ${
                        isStepDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isDark ? 'border-zinc-700 bg-midnight-900' : 'border-zinc-300 bg-white'
                      }`}>
                        {isStepDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className={`leading-relaxed text-[11px] ${isStepDone ? 'line-through opacity-70' : ''}`}>
                        {item}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* No-AI Challenge Requirement */}
            {task.noAiPrompt && (
              <div className={`p-2.5 rounded-xl border mb-3 ${
                isDark 
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' 
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-[10px] text-amber-400 mb-0.5">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Strict No-AI Coding Requirement:</span>
                </div>
                <p className="text-[11px] leading-relaxed">{task.noAiPrompt}</p>
              </div>
            )}

            {/* Code Snippet Box */}
            {task.codeSnippet && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Algorithm Reference:</span>
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={copyCode}
                    className="flex items-center gap-1 text-[10px] font-bold text-zinc-300 hover:text-white px-2 py-0.5 rounded-lg bg-midnight-800 border border-white/10"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </motion.button>
                </div>
                <pre className="p-2.5 rounded-xl bg-midnight-950 border border-white/[0.08] text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  <code>{task.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Notes Input */}
            <div>
              <div className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                <FileText className="w-3 h-3 text-amber-400" />
                <span>Sprint Notes & Complexity (O):</span>
              </div>
              <textarea
                value={userNotes}
                onChange={(e) => {
                  setUserNotes(e.target.value);
                  task.notes = e.target.value;
                }}
                placeholder="Log edge cases or takeaways..."
                rows={2}
                className={`w-full p-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-1 ${
                  isSaturday ? 'focus:ring-emerald-500' : 'focus:ring-brand-primary'
                } ${
                  isDark 
                    ? 'bg-midnight-950 border-white/[0.08] text-zinc-100 placeholder-zinc-600' 
                    : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
