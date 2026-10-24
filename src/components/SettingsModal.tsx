import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Check, 
  Copy, 
  BookOpen
} from 'lucide-react';
import { AppState } from '../types';
import { exportAppStateAsJson, importAppStateFromJson, getDefaultState } from '../utils/storage';
import { sound } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  onUpdateState: (newState: AppState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState
}) => {
  if (!isOpen) return null;

  const isDark = state.theme === 'dark';
  const [copiedJson, setCopiedJson] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleDownloadBackup = () => {
    sound.playTactileClick();
    const jsonStr = exportAppStateAsJson(state);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekend-90-backup-week${state.currentWeek}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    sound.playTactileClick();
    const jsonStr = exportAppStateAsJson(state);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleImport = () => {
    sound.playTactileClick();
    try {
      setImportError(null);
      const newState = importAppStateFromJson(importText);
      onUpdateState(newState);
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setImportError((err as Error).message || 'Invalid JSON');
    }
  };

  const handleReset = () => {
    sound.playTactileClick();
    if (confirm('Are you sure you want to reset all weekend progress and restore demo data?')) {
      onUpdateState(getDefaultState());
      onClose();
    }
  };

  const toggleSound = () => {
    sound.playTactileClick();
    const nextVal = !state.soundEnabled;
    sound.setMuted(!nextVal);
    onUpdateState({ ...state, soundEnabled: nextVal });
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
            <h3 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Settings & Career Guide
            </h3>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                sound.playTactileClick();
                onClose();
              }}
              aria-label="Close settings"
              className={`p-1.5 rounded-full transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* 1. Philosophy Card */}
          <div className={`p-4 rounded-3xl mb-4 border ${
            isDark ? 'bg-slate-950/80 border-white/[0.08] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-1.5 font-black text-xs text-amber-500 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>The 90-Minute Weekend Philosophy</span>
            </div>
            <p className="text-[11px] leading-relaxed select-text">
              Transitioning from <strong>7.5 LPA</strong> (ADP Member Tech) to <strong>20+ LPA</strong> (Senior Applied AI) requires no-burnout consistency:
            </p>
            <ul className={`text-[11px] mt-2 space-y-1 list-disc list-inside select-text ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <li><strong>Mon–Fri:</strong> Work at ADP + 10-minute No-AI Debugging Rule.</li>
              <li><strong>Saturday 90m:</strong> Raw DSA Coding & Manual Backend (AI Off).</li>
              <li><strong>Sunday 90m:</strong> System Design (HLD) & Applied AI Portfolio.</li>
            </ul>
          </div>

          {/* 2. Sound Toggle */}
          <div className={`flex items-center justify-between py-2 border-b mb-3 ${
            isDark ? 'border-white/[0.06]' : 'border-slate-200'
          }`}>
            <span className={`text-xs font-bold flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {state.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              Audio Chimes & Synthesizer
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleSound}
              className={`px-3 py-1 rounded-xl text-xs font-black border transition-colors ${
                state.soundEnabled
                  ? isDark 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : isDark 
                    ? 'bg-slate-800 text-slate-400 border-white/10' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {state.soundEnabled ? 'Enabled' : 'Muted'}
            </motion.button>
          </div>

          {/* 3. Export JSON Backup */}
          <div className="mb-4">
            <span className={`text-xs font-bold block mb-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Data Backup & Export:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadBackup}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 border-white/10 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyJson}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 border-white/10 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied!' : 'Copy to Clip'}</span>
              </motion.button>
            </div>
          </div>

          {/* 4. Import JSON */}
          <div className="mb-4">
            <span className={`text-xs font-bold block mb-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Import State from JSON:
            </span>
            <textarea
              rows={2}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste exported JSON here to restore progress..."
              className={`w-full p-2.5 rounded-2xl text-[11px] font-mono border focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2 select-text ${
                isDark ? 'bg-slate-950 border-white/[0.08] text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
            {importError && (
              <div className="text-[11px] text-rose-400 font-semibold mb-2">Error: {importError}</div>
            )}
            {importSuccess && (
              <div className="text-[11px] text-emerald-400 font-semibold mb-2">Successfully restored!</div>
            )}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleImport}
              disabled={!importText.trim()}
              className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 shadow-md shadow-indigo-600/20"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Backup</span>
            </motion.button>
          </div>

          {/* 5. Reset Demo Data */}
          <div className={`pt-2 border-t ${
            isDark ? 'border-white/[0.06]' : 'border-slate-200'
          }`}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleReset}
              className="w-full py-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-500/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data & Progress</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
