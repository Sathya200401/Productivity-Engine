import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, BrainCircuit } from 'lucide-react';
import { Task, DayType, TaskCategory, Difficulty } from '../types';
import { sound } from '../utils/sound';

interface CustomTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayType;
  currentWeek: number;
  onAddTask: (task: Task) => void;
  isDark: boolean;
}

export const CustomTaskModal: React.FC<CustomTaskModalProps> = ({
  isOpen,
  onClose,
  day,
  currentWeek,
  onAddTask,
  isDark
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>(day === 'saturday' ? 'dsa' : 'applied-ai');
  const [blockNumber, setBlockNumber] = useState<1 | 2>(1);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [description, setDescription] = useState('');
  const [noAiPrompt, setNoAiPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playCompletionChime();

    const newTask: Task = {
      id: `custom-task-${Date.now()}`,
      day,
      blockNumber,
      title,
      category,
      durationMinutes: 45,
      difficulty,
      description: description || 'Custom weekend learning sprint task.',
      actionItems: [
        '00-15m: Review core architecture / problem requirements and sketch plan.',
        '15-35m: Hand-code implementation with AI assistance turned OFF.',
        '35-45m: Review edge cases, write tests, and document key trade-offs.'
      ],
      noAiPrompt: noAiPrompt || 'Hand-code logic from memory before testing.',
      completed: false
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm font-mono">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15 }}
          className={`w-full max-w-md border p-6 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#09090B] border-neutral-800 text-neutral-100 shadow-2xl' : 'bg-white border-neutral-300 text-neutral-900 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 block">Task Registry</span>
                <h3 className="font-display text-sm font-bold uppercase tracking-tight">Append Custom Task</h3>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playTactileClick();
                onClose();
              }}
              className="p-1 border border-neutral-700 hover:border-white text-neutral-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Task Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Implement Trie with Prefix Search from memory"
                className={`w-full p-3 border text-xs focus:outline-none ${
                  isDark ? 'bg-neutral-950 border-neutral-800 text-white focus:border-white' : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-neutral-950'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 mb-1">Sprint Block</label>
                <select
                  value={blockNumber}
                  onChange={(e) => setBlockNumber(Number(e.target.value) as 1 | 2)}
                  className={`w-full p-2.5 rounded-xl text-xs border ${
                    isDark ? 'bg-slate-950 border-white/[0.08] text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value={1}>Block 1 (First 45m)</option>
                  <option value={2}>Block 2 (Second 45m)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className={`w-full p-2.5 rounded-xl text-xs border ${
                    isDark ? 'bg-slate-950 border-white/[0.08] text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className={`w-full p-2.5 rounded-xl text-xs border ${
                  isDark ? 'bg-slate-950 border-white/[0.08] text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="dsa">DSA & Algorithms</option>
                <option value="backend">Backend Engineering</option>
                <option value="system-design">System Design (LLD/HLD)</option>
                <option value="applied-ai">Applied AI & RAG</option>
                <option value="custom">Custom Drill</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 mb-1">Task Instructions / Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide context, constraints, and target outcomes..."
                className={`w-full p-2.5 rounded-2xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDark ? 'bg-slate-950 border-white/[0.08] text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 mb-1">Strict No-AI Coding Requirement</label>
              <input
                type="text"
                value={noAiPrompt}
                onChange={(e) => setNoAiPrompt(e.target.value)}
                placeholder="e.g. Type out pointer swap logic without looking up syntax"
                className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDark ? 'bg-slate-950 border-white/[0.08] text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3 border text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'border-neutral-800 text-neutral-400 hover:text-white' : 'border-neutral-300 text-neutral-600 hover:text-black'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 py-3 border text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'border-white bg-white text-neutral-950 hover:bg-neutral-200' : 'border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800'
                }`}
              >
                Append Task
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
