import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Copy, 
  Check, 
  BrainCircuit, 
  Trash2, 
  FileCheck
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
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#1D4ED8', '#000000', '#FFFFFF']
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
    <div className="px-3.5 sm:px-6 py-4 pb-36">
      {/* Header Plate */}
      <div className={`p-4 sm:p-6 border mb-5 transition-colors ${
        isDark ? 'border-neutral-800 bg-neutral-900/40 text-neutral-100' : 'border-neutral-200 bg-white text-neutral-900 shadow-sm'
      }`}>
        <div className="flex items-center gap-2.5 mb-2.5 font-mono">
          <div className="w-7 h-7 sm:w-8 sm:h-8 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0">
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 block">
              Artifact Synthesizer // Google XYZ Standard
            </span>
            <h2 className={`font-display text-base sm:text-lg font-bold tracking-tight uppercase ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Executive Impact Monograph
            </h2>
          </div>
        </div>
        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Convert routine enterprise deliverables into quantifiable senior-level resume artifacts: <span className="font-mono text-neutral-300 dark:text-neutral-200">Accomplished [X] as measured by [Y], by doing [Z]</span>.
        </p>
      </div>

      {/* Entry Form (16px base font size on mobile to prevent iOS Safari auto-zoom) */}
      <form onSubmit={handleSubmit} className={`p-4 sm:p-6 border space-y-3.5 mb-5 font-mono text-xs transition-colors ${
        isDark ? 'border-neutral-800 bg-neutral-900/20' : 'border-neutral-200 bg-white shadow-sm'
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Log Technical Contribution
          </span>
          <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 border ${
            isDark ? 'border-neutral-800 bg-neutral-900 text-neutral-300' : 'border-neutral-200 bg-neutral-100 text-neutral-800'
          }`}>
            WK {state.currentWeek}
          </span>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
            Deliverable or Bug Fixed: *
          </label>
          <input
            type="text"
            required
            value={featureOrBug}
            onChange={(e) => setFeatureOrBug(e.target.value)}
            placeholder="e.g. Optimized payroll tax computation batch job"
            className={`w-full p-3 border text-[16px] sm:text-xs font-mono focus:outline-none select-text ${
              isDark 
                ? 'border-neutral-800 bg-neutral-950 text-white focus:border-white' 
                : 'border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-neutral-950'
            }`}
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
            Technology Stack:
          </label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="e.g. C# .NET Core, SQL Server, Redis, Kafka"
            className={`w-full p-3 border text-[16px] sm:text-xs font-mono focus:outline-none select-text ${
              isDark 
                ? 'border-neutral-800 bg-neutral-950 text-white focus:border-white' 
                : 'border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-neutral-950'
            }`}
          />
        </div>

        {/* 10-Min Rule Toggle (Ergonomic Mobile Tap Area) */}
        <div
          onClick={() => {
            sound.playTactileClick();
            setUsed10MinRule(!used10MinRule);
          }}
          className={`p-3 sm:p-3.5 min-h-[48px] border cursor-pointer flex items-center justify-between transition-colors active:scale-[0.99] ${
            used10MinRule
              ? isDark 
                ? 'border-neutral-700 bg-neutral-900 text-neutral-200' 
                : 'border-neutral-400 bg-neutral-100 text-neutral-900'
              : isDark 
                ? 'border-neutral-800/60 bg-neutral-950 text-neutral-500' 
                : 'border-neutral-200 bg-neutral-50 text-neutral-500'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 mr-2">
            <BrainCircuit className={`w-4 h-4 shrink-0 ${used10MinRule ? 'text-amber-500' : 'text-neutral-500'}`} />
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">
                10-Minute Manual Debugging Protocol?
              </div>
              <div className="text-[9px] text-neutral-500 truncate hidden xs:block">
                Investigated execution plan & stack trace manually first
              </div>
            </div>
          </div>
          <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 border uppercase shrink-0 ${
            used10MinRule 
              ? 'border-amber-500 text-amber-500' 
              : 'border-neutral-700 text-neutral-600'
          }`}>
            {used10MinRule ? 'YES' : 'NO'}
          </span>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
            Root Cause or Breakthrough:
          </label>
          <input
            type="text"
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            placeholder="e.g. Uncovered unindexed foreign key causing table lockups"
            className={`w-full p-3 border text-[16px] sm:text-xs font-mono focus:outline-none select-text ${
              isDark 
                ? 'border-neutral-800 bg-neutral-950 text-white focus:border-white' 
                : 'border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-neutral-950'
            }`}
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
            Quantifiable Impact (Scale & Latency):
          </label>
          <input
            type="text"
            value={measurableImpact}
            onChange={(e) => setMeasurableImpact(e.target.value)}
            placeholder="e.g. Reduced p99 latency by 68% for 12,000 corporate clients"
            className={`w-full p-3 border text-[16px] sm:text-xs font-mono focus:outline-none select-text ${
              isDark 
                ? 'border-neutral-800 bg-neutral-950 text-white focus:border-white' 
                : 'border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-neutral-950'
            }`}
          />
        </div>

        {/* Live Bullet Preview */}
        {livePreviewBullet && (
          <div className={`p-3.5 border text-xs font-mono ${
            isDark ? 'border-neutral-700 bg-black text-neutral-200' : 'border-neutral-300 bg-neutral-100 text-neutral-900'
          }`}>
            <span className="text-[10px] uppercase tracking-wider text-blue-400 block mb-1">
              Live XYZ Synthesis:
            </span>
            <p className="text-[11px] sm:text-xs leading-relaxed italic select-text">
              "{livePreviewBullet}"
            </p>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3.5 px-4 min-h-[46px] border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            isDark 
              ? 'border-white bg-white text-neutral-950 hover:bg-neutral-200 active:bg-neutral-300' 
              : 'border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 active:bg-neutral-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Synthesize & Record Resume Bullets</span>
        </button>
      </form>

      {/* Dossier Archive */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Archived Dossier ({state.adpLogs.length})</span>
          </span>

          {state.adpLogs.length > 0 && (
            <button
              onClick={handleCopyAllBullets}
              className={`text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center gap-1 px-2.5 py-1 min-h-[30px] border transition-colors ${
                isDark 
                  ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white active:bg-neutral-800' 
                  : 'border-neutral-300 bg-white text-neutral-700 hover:text-black active:bg-neutral-100'
              }`}
            >
              {copiedAll ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAll ? 'COPIED ✓' : 'COPY ALL'}</span>
            </button>
          )}
        </div>

        {state.adpLogs.map((log) => (
          <div
            key={log.id}
            className={`p-4 sm:p-5 border transition-colors ${
              isDark ? 'border-neutral-800 bg-neutral-900/30 text-neutral-200' : 'border-neutral-200 bg-white text-neutral-900 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 border ${
                    isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-300' : 'border-neutral-300 bg-neutral-100 text-neutral-800'
                  }`}>
                    WK {log.weekNumber}
                  </span>
                  <span className="text-[9px] text-neutral-500">{log.date}</span>
                  {log.used10MinNoAiRule && (
                    <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 border border-amber-500/40 text-amber-500 uppercase">
                      10m Rule
                    </span>
                  )}
                </div>
                <h4 className="font-display text-xs sm:text-sm font-bold tracking-tight select-text leading-snug">{log.featureOrBug}</h4>
              </div>

              <button
                onClick={() => handleDeleteLog(log.id)}
                title="Delete Entry"
                className="text-neutral-500 hover:text-red-500 p-1.5 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 my-2">
              <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 border ${
                isDark ? 'border-neutral-800 bg-neutral-950 text-neutral-400' : 'border-neutral-200 bg-neutral-100 text-neutral-700'
              }`}>
                {log.techStack}
              </span>
              {log.measurableImpact && (
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 border border-emerald-500/40 text-emerald-400">
                  {log.measurableImpact}
                </span>
              )}
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 block">
                Google XYZ Resume Bullets:
              </span>
              {log.generatedResumeBullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 sm:p-3 border text-xs leading-relaxed flex items-start justify-between gap-2.5 ${
                    isDark ? 'border-neutral-800 bg-black/40' : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  <p className="flex-1 text-[11px] sm:text-xs select-text text-neutral-300 dark:text-neutral-300 font-mono">{bullet}</p>
                  <button
                    onClick={() => handleCopyBullet(bullet, `${log.id}-${idx}`)}
                    title="Copy bullet"
                    className={`p-1.5 border shrink-0 transition-colors min-h-[30px] min-w-[30px] flex items-center justify-center ${
                      isDark 
                        ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white active:bg-neutral-800' 
                        : 'border-neutral-300 bg-white text-neutral-700 hover:text-black active:bg-neutral-100'
                    }`}
                  >
                    {copiedId === `${log.id}-${idx}` ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
