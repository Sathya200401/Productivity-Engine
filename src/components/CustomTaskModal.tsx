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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className={`w-full max-w-md rounded-t-[32px] sm:rounded-3xl border p-5 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-white/[0.08] text-slate-100 shadow-2xl' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black">Add Custom Weekend Task</h3>
                <p className="text-[11px] text-slate-400">Week {currentWeek} • {day.toUpperCase()}</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                sound.playTactileClick();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 mb-1">Task Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Implement Trie with Prefix Search in Python"
                className={`w-full p-3 rounded-2xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDark ? 'bg-slate-950 border-white/[0.08] text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
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
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className={`flex-1 py-3 rounded-2xl text-xs font-bold border ${
                  isDark ? 'border-white/10 text-slate-400' : 'border-slate-300 text-slate-600'
                }`}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="flex-1 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
              >
                Add Task
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
