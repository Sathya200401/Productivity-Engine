import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Sparkles, 
  Copy, 
  Check, 
  BrainCircuit, 
  Trash2, 
  FileCheck,
  Download,
  Share2
} from 'lucide-react';
import { AppState, ADPLogEntry } from '../types';
import { generate20LpaResumeBullets } from '../utils/resumeBuilder';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface ADPImpactViewProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
}

export const ADPImpactView: React.FC<ADPImpactViewProps> = ({ state, onUpdateState }) => {
  const isDark = state.theme === 'dark';
  const [featureOrBug, setFeatureOrBug] = useState('');
  const [techStack, setTechStack] = useState('C# .NET Core, SQL Server, Redis');
  const [used10MinRule, setUsed10MinRule] = useState(true);
  const [rootCause, setRootCause] = useState('');
  const [measurableImpact, setMeasurableImpact] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Live real-time preview
  const livePreviewBullet = featureOrBug.trim()
    ? generate20LpaResumeBullets({
        featureOrBug,
        techStack,
        rootCauseOrBreakthrough: rootCause || 'identified system bottleneck and optimized database query execution path',
        measurableImpact: measurableImpact || 'improved system throughput',
        used10MinNoAiRule: used10MinRule
      })[0]
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureOrBug.trim()) return;

    sound.playCompletionChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00F2FE', '#4FACFE', '#FF8C00']
    });

    const generatedBullets = generate20LpaResumeBullets({
      featureOrBug,
      techStack,
      rootCauseOrBreakthrough: rootCause || 'identified system bottleneck and applied structured architectural optimization',
      measurableImpact: measurableImpact || 'improved system reliability and throughput',
      used10MinNoAiRule: used10MinRule
    });

    const newEntry: ADPLogEntry = {
      id: `adp-log-${Date.now()}`,
      weekNumber: state.currentWeek,
      date: new Date().toISOString().split('T')[0],
      featureOrBug,
      techStack,
      used10MinNoAiRule: used10MinRule,
      rootCauseOrBreakthrough: rootCause,
      measurableImpact,
      generatedResumeBullets: generatedBullets,
      createdAt: new Date().toISOString()
    };

    onUpdateState(prev => ({
      ...prev,
      adpLogs: [newEntry, ...prev.adpLogs]
    }));

    setFeatureOrBug('');
    setRootCause('');
    setMeasurableImpact('');
  };

  const handleCopyBullet = (text: string, id: string) => {
    sound.playTactileClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllBullets = () => {
    sound.playTactileClick();
    const allBullets = state.adpLogs
      .flatMap(log => [
        `### Week ${log.weekNumber} - ${log.featureOrBug} (${log.techStack})`,
        ...log.generatedResumeBullets.map(b => `- ${b}`),
        ''
      ])
      .join('\n');

    navigator.clipboard.writeText(allBullets);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleDeleteLog = (id: string) => {
    sound.playTactileClick();
    onUpdateState(prev => ({
      ...prev,
      adpLogs: prev.adpLogs.filter(log => log.id !== id)
    }));
  };

  return (
    <div className="px-4 py-4 pb-32">
      {/* Header Banner */}
      <div className={`p-5 rounded-3xl border mb-4 transition-colors ${
        isDark 
          ? 'border-white/[0.12] bg-gradient-to-r from-cyber-cardElevated to-cyber-card shadow-cockpit' 
          : 'border-slate-200 bg-white shadow-xl'
      }`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            isDark 
              ? 'bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan shadow-neon-cyan' 
              : 'bg-cyan-100 border border-cyan-300 text-cyan-700 shadow-sm'
          }`}>
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ADP Friday Impact Studio
            </h2>
            <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Convert Weekday Work into 20 LPA Resume Bullets
            </p>
          </div>
        </div>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
          Every Friday before logging off ADP, document one technical ship. The engine automatically outputs Google XYZ-format resume bullets demonstrating senior engineering ownership.
        </p>
      </div>

      {/* Quick Entry Form */}
      <form onSubmit={handleSubmit} className={`p-5 rounded-3xl border space-y-3.5 mb-5 transition-colors ${
        isDark 
          ? 'border-white/[0.12] bg-cyber-cardElevated shadow-cockpit' 
          : 'border-slate-200 bg-white shadow-xl'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-cyber-cyan' : 'text-cyan-700'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            Log This Week’s ADP Win
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            isDark ? 'bg-zinc-800 text-zinc-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            Week {state.currentWeek}
          </span>
        </div>

        <div>
          <label className={`block text-[11px] font-extrabold mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            What did you ship, refactor, or debug at ADP this week? *
          </label>
          <input
            type="text"
            required
            value={featureOrBug}
            onChange={(e) => setFeatureOrBug(e.target.value)}
            placeholder="e.g. Refactored batch tax calculation microservice in .NET Core"
            className={`w-full p-3 rounded-2xl text-xs border focus:outline-none select-text ${
              isDark 
                ? 'bg-cyber-bg border-white/10 text-white focus:border-cyber-cyan' 
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
            }`}
          />
        </div>

        <div>
          <label className={`block text-[11px] font-extrabold mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            Tech Stack Used (comma-separated):
          </label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="e.g. C# .NET Core, SQL Server, Redis, Kafka"
            className={`w-full p-3 rounded-2xl text-xs border focus:outline-none select-text ${
              isDark 
                ? 'bg-cyber-bg border-white/10 text-white focus:border-cyber-cyan' 
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
            }`}
          />
        </div>

        {/* 10-Minute No-AI Rule Toggle */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playTactileClick();
            setUsed10MinRule(!used10MinRule);
          }}
          className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
            used10MinRule
              ? isDark 
                ? 'bg-amber-950/25 border-amber-500/40 text-amber-200 shadow-neon-flame' 
                : 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
              : isDark 
                ? 'bg-cyber-bg border-white/10 text-zinc-400' 
                : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BrainCircuit className={`w-5 h-5 ${used10MinRule ? 'text-amber-500' : 'text-zinc-400'}`} />
            <div>
              <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                10-Minute No-AI Rule Applied?
              </div>
              <div className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Did you investigate the stack trace & query plan manually first?
              </div>
            </div>
          </div>
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
            used10MinRule 
              ? 'bg-amber-500 text-slate-950' 
              : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-200 text-slate-600'
          }`}>
            {used10MinRule ? 'YES • 10M RULE' : 'NO'}
          </span>
        </motion.div>

        <div>
          <label className={`block text-[11px] font-extrabold mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            Root Cause or Technical Breakthrough:
          </label>
          <input
            type="text"
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            placeholder="e.g. Uncovered unindexed foreign key causing table scan lockups"
            className={`w-full p-3 rounded-2xl text-xs border focus:outline-none select-text ${
              isDark 
                ? 'bg-cyber-bg border-white/10 text-white focus:border-cyber-cyan' 
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
            }`}
          />
        </div>

        <div>
          <label className={`block text-[11px] font-extrabold mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            Measurable Impact (Numbers/Scale):
          </label>
          <input
            type="text"
            value={measurableImpact}
            onChange={(e) => setMeasurableImpact(e.target.value)}
            placeholder="e.g. Reduced p99 calculation latency by 68% for 12,000 corporate clients"
            className={`w-full p-3 rounded-2xl text-xs border focus:outline-none select-text ${
              isDark 
                ? 'bg-cyber-bg border-white/10 text-white focus:border-cyber-cyan' 
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
            }`}
          />
        </div>

        {/* Live Resume Bullet Preview */}
        {livePreviewBullet && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`p-3.5 rounded-2xl border text-xs ${
              isDark 
                ? 'bg-cyber-blue/10 border-cyber-cyan/30 text-zinc-200' 
                : 'bg-cyan-50 border-cyan-300 text-cyan-900'
            }`}
          >
            <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${
              isDark ? 'text-cyber-cyan' : 'text-cyan-800'
            }`}>
              Live Google XYZ Bullet Synthesizer:
            </span>
            <p className="text-[11px] italic leading-relaxed select-text">
              "{livePreviewBullet}"
            </p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className={`w-full py-4 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
            isDark 
              ? 'bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple text-slate-950 shadow-neon-cyan' 
              : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-md'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Save & Synthesize 20-LPA Bullets</span>
        </motion.button>
      </form>

      {/* Saved Archive */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-zinc-400' : 'text-slate-600'
          }`}>
            <FileCheck className="w-4 h-4 text-emerald-500" />
            Resume Bullet Archive ({state.adpLogs.length})
          </h3>

          {state.adpLogs.length > 0 && (
            <button
              onClick={handleCopyAllBullets}
              className={`text-[10px] font-black flex items-center gap-1 px-2.5 py-1 rounded-xl border transition-colors ${
                isDark 
                  ? 'border-white/10 bg-zinc-800 text-zinc-200 hover:bg-zinc-700' 
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-sm'
              }`}
            >
              {copiedAll ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAll ? 'All Copied! ✓' : 'Copy All Bullets'}</span>
            </button>
          )}
        </div>

        {state.adpLogs.map((log) => (
          <motion.div
            key={log.id}
            layout
            className={`p-4 rounded-3xl border transition-colors ${
              isDark 
                ? 'border-white/[0.08] bg-cyber-card shadow-cockpit' 
                : 'border-slate-200 bg-white shadow-md text-slate-900'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-700'
                  }`}>
                    Week {log.weekNumber}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{log.date}</span>
                  {log.used10MinNoAiRule && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                      isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      10m No-AI Rule
                    </span>
                  )}
                </div>
                <h4 className={`text-xs font-black leading-snug select-text ${isDark ? 'text-white' : 'text-slate-900'}`}>{log.featureOrBug}</h4>
              </div>

              <button
                onClick={() => handleDeleteLog(log.id)}
                title="Delete entry"
                className="text-zinc-400 hover:text-rose-500 p-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 my-2">
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono ${
                isDark ? 'bg-zinc-800 text-cyber-cyan' : 'bg-cyan-50 text-cyan-800 border border-cyan-200'
              }`}>
                {log.techStack}
              </span>
              {log.measurableImpact && (
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  ⚡ {log.measurableImpact}
                </span>
              )}
            </div>

            <div className={`mt-3 pt-3 border-t space-y-2 ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block">
                20 LPA Ready Bullets:
              </span>
              {log.generatedResumeBullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs leading-relaxed flex items-start justify-between gap-2 ${
                    isDark ? 'bg-cyber-bg/90 border-white/[0.06]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <p className={`flex-1 text-[11px] select-text ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{bullet}</p>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleCopyBullet(bullet, `${log.id}-${idx}`)}
                    title="Copy bullet"
                    className={`p-1.5 rounded-xl shrink-0 border transition-colors ${
                      isDark 
                        ? 'bg-zinc-800 text-zinc-300 hover:text-white border-white/10' 
                        : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm'
                    }`}
                  >
                    {copiedId === `${log.id}-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
