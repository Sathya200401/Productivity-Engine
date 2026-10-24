import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Smartphone, Zap, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface DopamineShieldProps {
  isUnlocked: boolean;
  onToggle: () => void;
  day: 'saturday' | 'sunday';
  isDark: boolean;
}

export const DopamineShield: React.FC<DopamineShieldProps> = ({
  isUnlocked,
  onToggle,
  day,
  isDark
}) => {
  const isSaturday = day === 'saturday';

  const handleClick = () => {
    sound.playTactileClick();
    if (!isUnlocked) {
      sound.playStartChime();
    }
    onToggle();
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      className={`relative overflow-hidden rounded-2xl p-3.5 mb-4 border transition-all duration-300 cursor-pointer select-none ${
        isUnlocked
          ? isSaturday
            ? isDark
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100 shadow-emerald-glow'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
            : isDark
              ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-100 shadow-subtle-glow'
              : 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-sm'
          : isDark
            ? 'bg-midnight-850/60 border-white/[0.08] text-zinc-300 hover:border-white/15'
            : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3.5 relative z-10">
        {/* Toggle Icon */}
        <motion.div
          animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
            isUnlocked
              ? isSaturday
                ? 'bg-emerald-500 text-zinc-950 font-black shadow-md'
                : 'bg-brand-primary text-white shadow-md'
              : isDark
                ? 'bg-midnight-800 text-zinc-400 border border-white/5'
                : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
          }`}
        >
          {isUnlocked ? (
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <Lock className="w-4 h-4 text-amber-400" />
          )}
        </motion.div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Zap className={`w-3.5 h-3.5 ${isUnlocked ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'}`} />
              Morning Dopamine Shield
            </span>

            {/* Apple-style Switch Toggle */}
            <div className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors ${
              isUnlocked 
                ? isSaturday ? 'bg-emerald-500' : 'bg-brand-primary'
                : isDark ? 'bg-midnight-700 border border-white/10' : 'bg-zinc-300'
            }`}>
              <motion.div 
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center ${
                  isUnlocked ? 'ml-auto' : ''
                }`}
              />
            </div>
          </div>

          <p className={`text-[11px] leading-relaxed ${
            isUnlocked 
              ? isDark ? 'text-zinc-200' : 'text-zinc-700' 
              : isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            {isUnlocked ? (
              <span className="flex items-center gap-1 font-semibold text-emerald-400">
                <Smartphone className="w-3.5 h-3.5 inline shrink-0" />
                <span>Deep Work Mode active. Zero social feeds before 90-minute completion!</span>
              </span>
            ) : (
              'Place phone in another room. Zero social scrolling before 90-minute completion.'
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
