import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Briefcase } from 'lucide-react';
import { sound } from '../utils/sound';

interface FloatingNavDockProps {
  activeTab: 'plan' | 'roadmap' | 'adp-log';
  onSelectTab: (tab: 'plan' | 'roadmap' | 'adp-log') => void;
  adpLogCount: number;
  isDark?: boolean;
}

export const FloatingNavDock: React.FC<FloatingNavDockProps> = ({
  activeTab,
  onSelectTab,
  adpLogCount,
  isDark = true
}) => {
  const tabs = [
    {
      id: 'plan' as const,
      label: 'Focus Studio',
      icon: Zap
    },
    {
      id: 'roadmap' as const,
      label: '20 LPA Roadmap',
      icon: TrendingUp
    },
    {
      id: 'adp-log' as const,
      label: 'ADP Work Wins',
      icon: Briefcase,
      badge: adpLogCount > 0 ? adpLogCount : undefined
    }
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40 max-w-[400px] mx-auto pointer-events-auto select-none">
      <div className={`p-1.5 rounded-3xl border backdrop-blur-3xl transition-colors duration-200 flex items-center justify-between ${
        isDark 
          ? 'border-white/[0.12] bg-cyber-card/90 shadow-cockpit' 
          : 'border-slate-200 bg-white/95 shadow-2xl'
      }`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                sound.playTactileClick();
                onSelectTab(tab.id);
              }}
              className={`relative flex-1 py-2.5 px-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all text-xs font-black ${
                isActive
                  ? isDark ? 'text-slate-950 font-black' : 'text-white font-black'
                  : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="floatingDockPill"
                  className={`absolute inset-0 rounded-2xl border ${
                    isDark 
                      ? 'bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple shadow-neon-cyan border-white/20' 
                      : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 shadow-lg border-white/20'
                  }`}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-1.5">
                <Icon className="w-4 h-4" />
                <span className="truncate">{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive 
                      ? isDark ? 'bg-slate-950 text-white' : 'bg-white text-indigo-700' 
                      : 'bg-emerald-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
