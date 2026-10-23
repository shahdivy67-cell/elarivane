import React, { useState } from 'react';
import { Sparkles, Footprints, Palette, Compass, ArrowRight, Bookmark, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivityPath } from '../types';

interface HomeScreenProps {
  onOpenActivity: (id: string) => void;
  onNavigateExplore: (pathTab: ActivityPath) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenActivity, onNavigateExplore }) => {
  const { activities, history, isSaved, toggleSaveActivity, user } = useApp();

  // Find a prompt for each of the 3 core paths
  const goDoMissions = activities.filter(a => a.path === 'go-do');
  const playActivities = activities.filter(a => a.path === 'play-unwind');
  const curiosities = activities.filter(a => a.path === 'curiosity');

  const todayCompletedCount = history.filter(
    h => h.dateKey === new Date().toISOString().split('T')[0]
  ).length;

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto px-4 pt-4 md:pt-6">
      {/* Warm, welcoming Header */}
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold font-mono">
              Alivane Presence
            </span>
          </div>
          <span className="text-xs text-stone-300 font-serif italic">
            "Finite, purposeful, easy to leave."
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#f5f2eb] tracking-tight">
            Hello, {user.displayName.split(' ')[0]}.
          </h1>
          <p className="text-stone-300 text-xs md:text-sm leading-relaxed max-w-lg">
            What would nourish you more than an endless feed right now? Pick an enjoyable micro-pause.
          </p>
        </div>

        {todayCompletedCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-900/40 text-emerald-300 text-xs mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {todayCompletedCount} mindful {todayCompletedCount === 1 ? 'pause' : 'pauses'} completed today. No rush, no streak pressure.
            </span>
          </div>
        )}
      </header>

      {/* The 3 Core Activity Paths */}
      <div className="space-y-5">
        {/* PATH 1: GO DO */}
        <section className="bg-gradient-to-br from-[#121c16] via-[#101914] to-[#0c1410] border border-emerald-900/40 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-300 shadow-inner">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-serif font-semibold text-emerald-100">1. Go Do</h2>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full font-medium">
                    Real-World Missions
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  Micro-adventures outside or in your room: move, explore, make, connect, reset.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateExplore('go-do')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Featured Go Do cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {goDoMissions.slice(0, 2).map(act => (
              <div
                key={act.id}
                onClick={() => onOpenActivity(act.id)}
                className="bg-[#142019]/90 hover:bg-[#18281f] border border-emerald-950 hover:border-emerald-800/70 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group/card"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5">
                    <span className="capitalize px-2 py-0.5 rounded-md bg-stone-900/60 text-stone-300">
                      {act.category}
                    </span>
                    <span>{act.durationMinutes} min • +{act.xpReward} XP</span>
                  </div>
                  <h3 className="text-sm font-semibold text-stone-100 group-hover/card:text-emerald-300 transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                    {act.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-emerald-950/40 text-xs">
                  <span className="text-emerald-400 font-medium group-hover/card:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Start Mission →
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleSaveActivity(act.id);
                    }}
                    className={`p-1.5 rounded-lg border ${
                      isSaved(act.id)
                        ? 'border-emerald-600 text-emerald-400 bg-emerald-950'
                        : 'border-transparent text-stone-300 hover:text-stone-300'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PATH 2: PLAY & UNWIND */}
        <section className="bg-gradient-to-br from-[#111c1e] via-[#0f191b] to-[#0a1314] border border-teal-900/40 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-44 h-44 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-300 shadow-inner">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-serif font-semibold text-teal-100">2. Play & Unwind</h2>
                  <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-800/40 px-2 py-0.5 rounded-full font-medium">
                    Creative Breaks
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  Self-contained drawing, sand ripples, and resonant bells. Zero streak pressure.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateExplore('play-unwind')}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium transition-colors"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {playActivities.slice(0, 2).map(act => (
              <div
                key={act.id}
                onClick={() => onOpenActivity(act.id)}
                className="bg-[#122123]/90 hover:bg-[#162a2d] border border-teal-950 hover:border-teal-800/70 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group/card"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5">
                    <span className="capitalize px-2 py-0.5 rounded-md bg-stone-900/60 text-stone-300">
                      {act.category}
                    </span>
                    <span>{act.durationMinutes} min • +{act.xpReward} XP</span>
                  </div>
                  <h3 className="text-sm font-semibold text-stone-100 group-hover/card:text-teal-300 transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                    {act.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-teal-950/40 text-xs">
                  <span className="text-teal-400 font-medium group-hover/card:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Play Now →
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleSaveActivity(act.id);
                    }}
                    className={`p-1.5 rounded-lg border ${
                      isSaved(act.id)
                        ? 'border-teal-600 text-teal-400 bg-teal-950'
                        : 'border-transparent text-stone-300 hover:text-stone-300'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PATH 3: CURIOSITY */}
        <section className="bg-gradient-to-br from-[#1a1811] via-[#16140e] to-[#0e0d09] border border-amber-900/40 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-44 h-44 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-300 shadow-inner">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-serif font-semibold text-amber-100">3. Curiosity</h2>
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded-full font-medium">
                    Bite-Sized Wonders
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  Visual explainers, 1-minute science puzzles, and surprising architecture.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateExplore('curiosity')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {curiosities.slice(0, 2).map(act => (
              <div
                key={act.id}
                onClick={() => onOpenActivity(act.id)}
                className="bg-[#1f1d16]/90 hover:bg-[#28251c] border border-amber-950 hover:border-amber-800/70 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group/card"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5">
                    <span className="capitalize px-2 py-0.5 rounded-md bg-stone-900/60 text-stone-300">
                      {act.category}
                    </span>
                    <span>{act.durationMinutes} min • +{act.xpReward} XP</span>
                  </div>
                  <h3 className="text-sm font-semibold text-stone-100 group-hover/card:text-amber-300 transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                    {act.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-950/40 text-xs">
                  <span className="text-amber-400 font-medium group-hover/card:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Explore Wonder →
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleSaveActivity(act.id);
                    }}
                    className={`p-1.5 rounded-lg border ${
                      isSaved(act.id)
                        ? 'border-amber-600 text-amber-400 bg-amber-950'
                        : 'border-transparent text-stone-300 hover:text-stone-300'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Gentle Footer Reminder */}
      <div className="text-center py-4 text-xs text-stone-300 border-t border-emerald-950/40 space-y-1">
        <p className="flex items-center justify-center gap-1.5 text-stone-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Finite activities designed for fulfillment, not retention algorithms.
        </p>
      </div>
    </div>
  );
};
