import React, { useState, useMemo } from 'react';
import {
  Award,
  Calendar,
  Sparkles,
  BarChart3,
  Clock,
  Trash2,
  Info,
  Footprints,
  Palette,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BADGES_LIST, calculateLevel } from '../data/badges';
import { HeatmapDay } from '../types';

export const ProgressScreen: React.FC = () => {
  const { history, totalXp, clearHistory } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'go-do' | 'play-unwind' | 'curiosity'>('all');
  const [dateRange, setDateRange] = useState<'30' | '60' | '90'>('90');
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  const levelInfo = calculateLevel(totalXp);

  // Filter history
  const filteredHistory = useMemo(() => {
    const daysLimit = Number(dateRange);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysLimit);

    return history.filter(item => {
      const itemDate = new Date(item.completedAt);
      if (itemDate < cutoff) return false;
      if (filterType !== 'all' && item.path !== filterType) return false;
      return true;
    });
  }, [history, filterType, dateRange]);

  // Build GitHub-style contribution calendar grid
  const heatmapDays = useMemo(() => {
    const daysLimit = Number(dateRange);
    const result: HeatmapDay[] = [];
    const map = new Map<string, { count: number; categories: any[] }>();

    filteredHistory.forEach(item => {
      const existing = map.get(item.dateKey) || { count: 0, categories: [] };
      existing.count += 1;
      existing.categories.push(item.category);
      map.set(item.dateKey, existing);
    });

    const now = new Date();
    for (let i = daysLimit - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const data = map.get(dateKey);
      const count = data?.count || 0;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count === 3) level = 3;
      else if (count >= 4) level = 4;

      result.push({
        date: dateKey,
        count,
        level,
        categories: data?.categories || [],
      });
    }

    return result;
  }, [filteredHistory, dateRange]);

  // Breakdown statistics
  const breakdown = useMemo(() => {
    const goDoCount = history.filter(h => h.path === 'go-do').length;
    const playCount = history.filter(h => h.path === 'play-unwind').length;
    const curiosityCount = history.filter(h => h.path === 'curiosity').length;

    // Time estimate avoided: estimated roughly 12-18 minutes of mindless scrolling per activity
    const totalMinutesEstimated = history.length * 15;
    const hours = Math.floor(totalMinutesEstimated / 60);
    const mins = totalMinutesEstimated % 60;

    return {
      goDoCount,
      playCount,
      curiosityCount,
      estimatedHoursText: `${hours}h ${mins}m`,
      totalCompleted: history.length,
    };
  }, [history]);

  // Dark green color progression for Heatmap
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-[#153e28] border-[#1f593b]'; // Deep forest
      case 2:
        return 'bg-[#1e613b] border-[#298250]'; // Medium moss
      case 3:
        return 'bg-[#2ea35f] border-[#3ecd78]'; // Bright emerald
      case 4:
        return 'bg-[#4ade80] border-[#86efac] shadow-[0_0_6px_#4ade80]'; // Radiant green
      default:
        return 'bg-[#121914] border-[#18231c]'; // Empty slot
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto px-4 pt-4 md:pt-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white">
          Presence & Progress
        </h1>
        <p className="text-xs md:text-sm text-stone-300 mt-1">
          Meaningful participation over time. No punishment for days away.
        </p>
      </div>

      {/* Level & XP Banner */}
      <div className="bg-gradient-to-br from-[#122218] via-[#101b14] to-[#0c140f] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-xl shadow-inner">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                  Rank: Level {levelInfo.level}
                </span>
                <span className="text-[11px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-700/40">
                  {levelInfo.title}
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white mt-0.5">{totalXp} XP</h3>
            </div>
          </div>
          <span className="text-xs text-stone-300">
            {levelInfo.nextLevelXp - totalXp > 0
              ? `${levelInfo.nextLevelXp - totalXp} XP to Level ${levelInfo.level + 1}`
              : 'Maximum Resonance'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-2.5 w-full bg-stone-900 rounded-full overflow-hidden p-0.5 border border-emerald-950">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* GITHUB-STYLE CONTRIBUTION HEATMAP */}
      <div className="bg-[#101914] border border-emerald-950/80 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Mindful Activity Heatmap
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Intensity reflects completed missions, not minutes staring at the screen.
            </p>
          </div>

          {/* Range selection */}
          <div className="flex items-center gap-1 bg-[#0b130f] p-1 rounded-xl border border-emerald-950">
            {(['30', '60', '90'] as const).map(days => (
              <button
                key={days}
                onClick={() => setDateRange(days)}
                className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors ${
                  dateRange === days
                    ? 'bg-emerald-900 text-emerald-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>

        {/* Activity Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'go-do', label: 'Go Do Missions' },
            { id: 'play-unwind', label: 'Play & Unwind' },
            { id: 'curiosity', label: 'Curiosity Wonders' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterType === f.id
                  ? 'bg-emerald-800 text-white font-medium shadow'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid Heatmap */}
        <div className="bg-[#0b120e] p-3.5 rounded-2xl border border-emerald-950/80 overflow-x-auto">
          <div className="min-w-[320px]">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 justify-start">
              {heatmapDays.map(day => (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-3.5 h-3.5 rounded-sm border cursor-pointer transition-transform hover:scale-125 ${getLevelColor(
                    day.level
                  )}`}
                  title={`${day.date}: ${day.count} activities`}
                />
              ))}
            </div>

            {/* Scale legend */}
            <div className="flex items-center justify-between mt-3 text-[10px] text-stone-300 pt-2 border-t border-emerald-950/60">
              <span className="italic">
                {hoveredDay
                  ? `${hoveredDay.date}: ${hoveredDay.count} completed`
                  : 'Hover over a square for details'}
              </span>
              <div className="flex items-center gap-1">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#121914] border border-[#18231c]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#153e28] border-[#1f593b]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#1e613b] border-[#298250]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2ea35f] border-[#3ecd78]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#4ade80] border-[#86efac]" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Explanation of Data */}
        <div className="flex items-start gap-2 text-xs text-stone-300 bg-stone-900/40 p-3 rounded-xl border border-stone-800">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong>What this data means:</strong> Each filled green square marks a day you logged a real-world mission, creative pause, or learning moment. Missed days have zero penalty and no streak breakage shaming.
          </p>
        </div>
      </div>

      {/* SUMMARY INSIGHTS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#121c17] p-3.5 rounded-2xl border border-emerald-950/80 space-y-1">
          <Footprints className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] text-stone-300">Go Do Missions</span>
          <p className="text-xl font-bold text-white">{breakdown.goDoCount}</p>
        </div>

        <div className="bg-[#121c17] p-3.5 rounded-2xl border border-emerald-950/80 space-y-1">
          <Palette className="w-4 h-4 text-teal-400" />
          <span className="text-[11px] text-stone-300">Creative Sessions</span>
          <p className="text-xl font-bold text-white">{breakdown.playCount}</p>
        </div>

        <div className="bg-[#121c17] p-3.5 rounded-2xl border border-emerald-950/80 space-y-1">
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] text-stone-300">Curiosity Wonders</span>
          <p className="text-xl font-bold text-white">{breakdown.curiosityCount}</p>
        </div>

        <div className="bg-[#121c17] p-3.5 rounded-2xl border border-emerald-950/80 space-y-1">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="text-[11px] text-stone-300">Estimated Reclaimed</span>
          <p className="text-xl font-bold text-white">{breakdown.estimatedHoursText}</p>
        </div>
      </div>

      {/* Explanation of the Estimate */}
      <div className="text-[11px] text-stone-300 bg-[#0d1410] p-3 rounded-xl border border-emerald-950/40">
        <p>
          * <strong>Methodology Note:</strong> "Estimated Reclaimed" is calculated assuming ~15 minutes of infinite feed scrolling displaced per intentional activity. This is an informative estimate, not an empirical surveillance metric.
        </p>
      </div>

      {/* BADGES & ACHIEVEMENTS */}
      <div className="bg-[#101914] border border-emerald-950/80 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Cosmetic Badges & Milestones
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Awarded for presence and curiosity, without manipulative retention loops.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-medium">
            {BADGES_LIST.filter(b => b.unlockedAt).length} / {BADGES_LIST.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {BADGES_LIST.map(badge => {
            const isUnlocked = Boolean(badge.unlockedAt);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isUnlocked
                    ? 'bg-[#14221a] border-emerald-800/60 text-stone-100'
                    : 'bg-stone-900/30 border-stone-800/60 opacity-50 text-stone-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-stone-900/80 border border-stone-700/60 flex items-center justify-center text-xl shrink-0">
                  {badge.icon}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-white">{badge.name}</h4>
                    {isUnlocked && (
                      <span className="text-[10px] text-emerald-300 bg-emerald-950 px-1.5 rounded">
                        Earned
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-300 leading-snug">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Deletion Control */}
      <div className="flex items-center justify-between pt-2 border-t border-emerald-950/60 text-xs">
        <span className="text-stone-300">You have full sovereignty over your history.</span>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear your local activity history?')) {
              clearHistory();
            }
          }}
          className="text-stone-300 hover:text-rose-400 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Activity Log
        </button>
      </div>
    </div>
  );
};
