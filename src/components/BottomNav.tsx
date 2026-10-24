import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Timer, TrendingUp, Briefcase } from 'lucide-react';
import { sound } from '../utils/sound';

interface BottomNavProps {
  activeTab: 'plan' | 'timer' | 'roadmap' | 'adp-log';
  onSelectTab: (tab: 'plan' | 'timer' | 'roadmap' | 'adp-log') => void;
  isDark: boolean;
  adpLogCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  isDark,
  adpLogCount
}) => {
  const tabs = [
    {
      id: 'plan' as const,
      label: 'Weekend Plan',
      icon: Calendar
    },
    {
      id: 'timer' as const,
      label: 'Sprint Timer',
      icon: Timer
    },
    {
      id: 'roadmap' as const,
      label: '20 LPA Roadmap',
      icon: TrendingUp
    },
    {
      id: 'adp-log' as const,
      label: 'ADP Impact Log',
      icon: Briefcase,
      badge: adpLogCount > 0 ? adpLogCount : undefined
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto pointer-events-auto">
      <div className={`border-t px-2 py-2 backdrop-blur-2xl transition-colors ${
        isDark 
          ? 'bg-midnight-950/95 border-white/[0.08] text-zinc-400' 
          : 'bg-white/95 border-zinc-200 text-zinc-500 shadow-lg'
      }`}>
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.88 }}
                onClick={() => {
                  sound.playTactileClick();
                  onSelectTab(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[70px] min-h-[48px] transition-colors ${
                  isActive
                    ? isDark ? 'text-white' : 'text-brand-primary'
                    : isDark ? 'hover:text-zinc-200' : 'hover:text-zinc-800'
                }`}
              >
                {/* Active Indicator Top Glow Pill */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavPill"
                    className="absolute -top-2 w-7 h-1 rounded-full bg-brand-primary shadow-subtle-glow"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <div className="relative">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand-primaryLight' : ''}`} />
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2.5 bg-emerald-500 text-zinc-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span className={`text-[10px] mt-1 tracking-tight truncate ${
                  isActive ? 'text-brand-primaryLight font-black' : 'font-semibold text-zinc-400'
                }`}>
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
