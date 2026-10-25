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
            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 block">System Parameters</span>
              <h3 className="font-display text-sm font-bold uppercase tracking-tight">
                Settings & Philosophy
              </h3>
            </div>
            <button
              onClick={() => {
                sound.playTactileClick();
                onClose();
              }}
              aria-label="Close settings"
              className="p-1 border border-neutral-700 hover:border-white text-neutral-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Philosophy Card */}
          <div className={`p-4 mb-4 border ${
            isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
          }`}>
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase text-amber-500 mb-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Architectural Protocol // 90-Minute Cadence</span>
            </div>
            <p className="text-[11px] leading-relaxed select-text font-mono">
              Transitioning from <strong>7.5 LPA</strong> (ADP Member Tech) to <strong>20+ LPA</strong> (Staff Applied AI) requires deliberate practice:
            </p>
            <ul className={`text-[11px] mt-2 space-y-1 list-disc list-inside select-text font-mono ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <li><strong>Mon–Fri:</strong> 10-Minute Manual Debugging Protocol before AI.</li>
              <li><strong>Saturday 90m:</strong> Pure Algorithmic Recall & Manual Backend Fluency.</li>
              <li><strong>Sunday 90m:</strong> High-Level Distributed Architecture & Applied AI.</li>
            </ul>
          </div>

          {/* 2. Sound Toggle */}
          <div className={`flex items-center justify-between py-3 border-b mb-4 ${
            isDark ? 'border-neutral-800' : 'border-neutral-200'
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              {state.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
              Procedural Audio & Synthesizer
            </span>
            <button
              onClick={toggleSound}
              className={`px-3 py-1 text-xs font-bold uppercase border transition-colors ${
                state.soundEnabled
                  ? isDark 
                    ? 'border-emerald-600 bg-emerald-950 text-emerald-300' 
                    : 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : isDark 
                    ? 'bg-neutral-900 text-neutral-500 border-neutral-800' 
                    : 'bg-neutral-100 text-neutral-600 border-neutral-300'
              }`}
            >
              {state.soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>

          {/* 3. Export JSON Backup */}
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1.5">
              Archival Backup & Export:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadBackup}
                className={`py-2.5 px-3 border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  isDark ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-200' : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON</span>
              </button>
              <button
                onClick={handleCopyJson}
                className={`py-2.5 px-3 border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  isDark ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-200' : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                }`}
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied!' : 'Copy to Clip'}</span>
              </button>
            </div>
          </div>

          {/* 4. Import JSON */}
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1.5">
              Restore State from JSON Dossier:
            </span>
            <textarea
              rows={2}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste exported JSON dossier here..."
              className={`w-full p-2.5 text-[11px] font-mono border focus:outline-none mb-2 select-text ${
                isDark ? 'bg-neutral-950 border-neutral-800 text-white focus:border-white' : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-neutral-950'
              }`}
            />
            {importError && (
              <div className="text-[11px] text-red-500 font-bold mb-2">Error: {importError}</div>
            )}
            {importSuccess && (
              <div className="text-[11px] text-emerald-400 font-bold mb-2">Successfully restored!</div>
            )}
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className={`w-full py-2.5 border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors ${
                isDark ? 'border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800' : 'border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Backup</span>
            </button>
          </div>

          {/* 5. Reset Demo Data */}
          <div className={`pt-3 border-t ${
            isDark ? 'border-neutral-800' : 'border-neutral-200'
          }`}>
            <button
              onClick={handleReset}
              className="w-full py-3 border border-red-900/60 bg-red-950/20 text-red-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-red-950/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State & Restore Demo Data</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
