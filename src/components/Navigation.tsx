import React from 'react';
import { Compass, Sparkles, BrainCircuit, Users, Award, User, Settings, WifiOff, Cpu, FlaskConical } from 'lucide-react';
import { useApp } from '../context/AppContext';

export type NavTab = 'home' | 'explore' | 'simulators' | 'experiments' | 'friends' | 'progress' | 'profile' | 'settings';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const { isOnline, pendingOfflineSyncsCount } = useApp();

  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'explore', label: 'Explore', icon: Sparkles },
    { id: 'simulators', label: 'Simulators', icon: Cpu },
    { id: 'experiments', label: 'Labs', icon: FlaskConical },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'progress', label: 'Progress', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Subtle Status bar (Offline indicator) */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-950/90 text-amber-200 text-xs px-3 py-1 flex items-center justify-between backdrop-blur-md border-b border-amber-800/40">
          <div className="flex items-center gap-1.5 font-medium">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Offline Mode Active • Missions save locally</span>
          </div>
          {pendingOfflineSyncsCount > 0 && (
            <span className="bg-amber-800/60 px-2 py-0.5 rounded text-[11px]">
              {pendingOfflineSyncsCount} queued
            </span>
          )}
        </div>
      )}

      {/* Bottom Navigation for Mobile, Floating dock for Tablets & Desktop */}
      <nav aria-label="Main Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d1612]/95 backdrop-blur-xl border-t border-emerald-950/60 pb-safe md:pb-3 md:bottom-4 md:max-w-xl md:mx-auto md:rounded-2xl md:border md:shadow-2xl md:shadow-black/70">
        <div className="flex items-center justify-around px-2 py-2 md:py-2.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-200 relative group ${
                  isActive
                    ? 'text-emerald-300 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {/* Active Indicator dot */}
                {isActive && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                )}
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive ? 'bg-emerald-950/80' : 'group-hover:bg-stone-800/40'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
