import React from 'react';
import { Zap, Layers, Briefcase } from 'lucide-react';
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
      index: '01',
      label: 'Sprint',
      fullLabel: 'Sprint Station',
      icon: Zap
    },
    {
      id: 'roadmap' as const,
      index: '02',
      label: 'Targets',
      fullLabel: 'Progress & Targets',
      icon: Layers
    },
    {
      id: 'adp-log' as const,
      index: '03',
      label: 'Dossier',
      fullLabel: 'Impact Dossier',
      icon: Briefcase,
      badge: adpLogCount > 0 ? adpLogCount : undefined
    }
  ];

  return (
    <nav className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-40 max-w-[460px] mx-auto pointer-events-auto select-none font-mono">
      <div className={`p-1 border shadow-xl backdrop-blur-xl transition-colors duration-150 flex items-center justify-between ${
        isDark 
          ? 'border-neutral-800 bg-[#09090B]/95 text-neutral-200 shadow-black/60' 
          : 'border-neutral-300 bg-white/95 text-neutral-900 shadow-neutral-400/30'
      }`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playTactileClick();
                onSelectTab(tab.id);
              }}
              className={`relative flex-1 py-2.5 px-1.5 min-h-[46px] flex items-center justify-center gap-1.5 transition-all text-xs ${
                isActive
                  ? isDark 
                    ? 'bg-white text-neutral-950 font-bold shadow-sm' 
                    : 'bg-neutral-950 text-white font-bold shadow-sm'
                  : isDark 
                    ? 'text-neutral-400 hover:text-white active:bg-neutral-800' 
                    : 'text-neutral-600 hover:text-neutral-950 active:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate text-[10px] sm:text-[11px] uppercase tracking-wider font-bold">
                  <span className="sm:hidden">{tab.label}</span>
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                </span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 font-bold border shrink-0 ${
                    isActive 
                      ? isDark ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-white bg-white text-neutral-950' 
                      : 'border-blue-500 bg-blue-600 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
