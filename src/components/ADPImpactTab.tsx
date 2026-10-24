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
  Zap,
  ArrowRight
} from 'lucide-react';
import { AppState, ADPLogEntry } from '../types';
import { generate20LpaResumeBullets } from '../utils/resumeBuilder';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface ADPImpactTabProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
}

export const ADPImpactTab: React.FC<ADPImpactTabProps> = ({ state, onUpdateState }) => {
  const isDark = state.theme === 'dark';

  const [featureOrBug, setFeatureOrBug] = useState('');
  const [techStack, setTechStack] = useState('C# .NET, SQL Server, Redis');
  const [used10MinRule, setUsed10MinRule] = useState(true);
  const [rootCause, setRootCause] = useState('');
  const [measurableImpact, setMeasurableImpact] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live preview bullet
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
      origin: { y: 0.8 }
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

  const handleDeleteLog = (id: string) => {
    sound.playTactileClick();
    onUpdateState(prev => ({
      ...prev,
      adpLogs: prev.adpLogs.filter(log => log.id !== id)
    }));
  };

  return (
    <div className="px-4 py-3 pb-32">
      {/* 1. Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-3xl mb-4 border relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-obsidian-card via-slate-900 to-emerald-950/30 border-white/[0.08] text-slate-100 shadow-xl' 
            : 'bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight">ADP Friday Impact Log</h2>
            <p className="text-[11px] text-slate-400">Turn Weekday Work into 20 LPA Resume Bullets</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mt-1">
          Every Friday before logging off ADP, document one technical win. The app synthesizes Google XYZ-format resume bullets demonstrating senior engineering ownership.
        </p>
      </motion.div>

      {/* 2. Quick Log Form */}
      <motion.form 
        onSubmit={handleSubmit}
        className={`p-4 rounded-3xl mb-5 border space-y-3.5 ${
          isDark ? 'bg-obsidian-card border-white/[0.08] text-slate-200 shadow-md' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Log This Week’s ADP Win
          </span>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
            Week {state.currentWeek}
          </span>
        </div>

        {/* Feature / Shipped work */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-400 mb-1">
            What did you ship, refactor, or debug at ADP this week? *
          </label>
          <input
            type="text"
            required
            value={featureOrBug}
            onChange={(e) => setFeatureOrBug(e.target.value)}
            placeholder="e.g. Refactored batch tax calculation microservice in .NET Core"
            className={`w-full p-3 rounded-2xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
              isDark ? 'bg-slate-950 border-white/[0.08] text-slate-100 placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-400 mb-1">
            Tech Stack Used (comma-separated):
          </label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="e.g. C# .NET Core, SQL Server, Redis, Kafka"
            className={`w-full p-3 rounded-2xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
              isDark ? 'bg-slate-950 border-white/[0.08] text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
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
              ? isDark ? 'bg-amber-950/25 border-amber-500/40 text-amber-200 shadow-glow-amber' : 'bg-amber-50 border-amber-300 text-amber-900'
              : isDark ? 'bg-slate-900/40 border-white/[0.05] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BrainCircuit className={`w-5 h-5 ${used10MinRule ? 'text-amber-400' : 'text-slate-400'}`} />
            <div>
              <div className="text-xs font-bold">10-Minute No-AI Debugging Rule?</div>
              <div className="text-[10px] opacity-80">Did you investigate logs & query plans yourself first?</div>
            </div>
          </div>
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
            used10MinRule ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}>
            {used10MinRule ? 'YES • 10M RULE' : 'NO'}
          </span>
        </motion.div>

        {/* Root Cause / Breakthrough */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-400 mb-1">
            Root Cause or Technical Breakthrough:
          </label>
          <input
            type="text"
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            placeholder="e.g. Discovered N+1 query loop; replaced with indexed bulk select"
            className={`w-full p-3 rounded-2xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
              isDark ? 'bg-slate-950 border-white/[0.08] text-slate-100 placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* Measurable Impact / Metric */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-400 mb-1">
            Measurable Impact (Numbers/Scale):
          </label>
          <input
            type="text"
            value={measurableImpact}
            onChange={(e) => setMeasurableImpact(e.target.value)}
            placeholder="e.g. Slashed p99 latency by 68% for 12,000 corporate clients"
            className={`w-full p-3 rounded-2xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
              isDark ? 'bg-slate-950 border-white/[0.08] text-slate-100 placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* Live Resume Bullet Generator Preview */}
        {livePreviewBullet && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`p-3 rounded-2xl border text-xs ${
              isDark ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-950'
            }`}
          >
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block mb-1">
              Live Google XYZ Bullet Preview:
            </span>
            <p className="text-[11px] italic leading-relaxed">"{livePreviewBullet}"</p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Save & Synthesize 20-LPA Bullets</span>
        </motion.button>
      </motion.form>

      {/* 3. Saved ADP Wins & Synthesized Bullets */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          Saved Resume Bullet Archive ({state.adpLogs.length})
        </h3>

        {state.adpLogs.map((log) => (
          <motion.div
            key={log.id}
            layout
            className={`p-4 rounded-3xl border transition-all ${
              isDark ? 'bg-obsidian-card border-white/[0.08] text-slate-200 shadow-md' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    Week {log.weekNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">{log.date}</span>
                  {log.used10MinNoAiRule && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      10m No-AI Rule
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-extrabold leading-snug">{log.featureOrBug}</h4>
              </div>

              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleDeleteLog(log.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="Delete entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            <div className="flex flex-wrap gap-1.5 my-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800/80 text-indigo-300 font-mono">
                {log.techStack}
              </span>
              {log.measurableImpact && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  ⚡ {log.measurableImpact}
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-white/[0.05] space-y-2">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                20 LPA Ready Resume Bullets:
              </span>
              {log.generatedResumeBullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs leading-relaxed flex items-start justify-between gap-2 ${
                    isDark ? 'bg-slate-950/70 border-white/[0.06] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <p className="flex-1 text-[11px]">{bullet}</p>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleCopyBullet(bullet, `${log.id}-${idx}`)}
                    className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white shrink-0 border border-white/10"
                    title="Copy bullet"
                  >
                    {copiedId === `${log.id}-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
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
