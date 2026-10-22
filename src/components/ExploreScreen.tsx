import React, { useState } from 'react';
import { Search, Filter, Bookmark, Footprints, Palette, Compass, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivityPath, ActivityCategory } from '../types';

interface ExploreScreenProps {
  onOpenActivity: (id: string) => void;
  initialPathTab?: ActivityPath | 'all';
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onOpenActivity,
  initialPathTab = 'all',
}) => {
  const { activities, isSaved, toggleSaveActivity } = useApp();
  const [selectedPath, setSelectedPath] = useState<ActivityPath | 'all'>(initialPathTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Categories list
  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'move', label: 'Move' },
    { id: 'explore', label: 'Explore' },
    { id: 'make', label: 'Make' },
    { id: 'connect', label: 'Connect' },
    { id: 'reset', label: 'Reset' },
    { id: 'draw', label: 'Drawing' },
    { id: 'pattern', label: 'Pattern' },
    { id: 'sound', label: 'Sound' },
    { id: 'explainer', label: 'Explainers' },
    { id: 'puzzle', label: 'Puzzles' },
  ];

  const filteredActivities = activities.filter(act => {
    if (selectedPath !== 'all' && act.path !== selectedPath) return false;
    if (selectedCategory !== 'all' && act.category !== selectedCategory) return false;
    if (showSavedOnly && !isSaved(act.id)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = act.title.toLowerCase().includes(q);
      const matchSub = act.subtitle.toLowerCase().includes(q);
      const matchDesc = act.description.toLowerCase().includes(q);
      return matchTitle || matchSub || matchDesc;
    }
    return true;
  });

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto px-4 pt-4 md:pt-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white">
          Explore finite experiences
        </h1>
        <p className="text-xs md:text-sm text-stone-300 mt-1">
          Pick a short adventure, creative pause, or fascinating explainer.
        </p>
      </div>

      {/* Search & Saved Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search walks, chimes, origami, illusions..."
            className="w-full bg-[#111914] border border-emerald-950/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-stone-200 placeholder:text-stone-300 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <button
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          className={`px-3.5 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
            showSavedOnly
              ? 'bg-emerald-900/60 border-emerald-600 text-emerald-300'
              : 'bg-[#111914] border-emerald-950/80 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Saved</span>
        </button>
      </div>

      {/* Path Selector Tabs */}
      <div className="flex items-center gap-1.5 bg-[#101813] p-1.5 rounded-2xl border border-emerald-950/60">
        {[
          { id: 'all', label: 'All Paths', icon: null },
          { id: 'go-do', label: 'Go Do', icon: Footprints },
          { id: 'play-unwind', label: 'Play & Unwind', icon: Palette },
          { id: 'curiosity', label: 'Curiosity', icon: Compass },
        ].map(tab => {
          const isActive = selectedPath === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedPath(tab.id as any)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-900 text-emerald-100 shadow-md font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category Pills horizontal scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-stone-200 text-stone-900 font-semibold'
                : 'bg-stone-900/70 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {filteredActivities.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-400 space-y-2">
            <p className="text-sm font-medium">No experiences found for this filter.</p>
            <p className="text-xs text-stone-300">Try loosening your search or category selection.</p>
          </div>
        ) : (
          filteredActivities.map(act => (
            <div
              key={act.id}
              onClick={() => onOpenActivity(act.id)}
              className="bg-[#121c17] hover:bg-[#16241e] border border-emerald-950/70 hover:border-emerald-800/80 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2">
                  <span
                    className={`capitalize px-2 py-0.5 rounded-md font-medium text-[10px] ${
                      act.path === 'go-do'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-900'
                        : act.path === 'play-unwind'
                        ? 'bg-teal-950 text-teal-300 border border-teal-900'
                        : 'bg-amber-950 text-amber-300 border border-amber-900'
                    }`}
                  >
                    {act.category}
                  </span>
                  <span>{act.durationMinutes} min • +{act.xpReward} XP</span>
                </div>

                <h3 className="text-sm font-semibold text-stone-100 group-hover:text-emerald-300 transition-colors">
                  {act.title}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                  {act.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-950/50 text-xs">
                <span className="text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  Open Activity →
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleSaveActivity(act.id);
                  }}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isSaved(act.id)
                      ? 'border-emerald-600 text-emerald-400 bg-emerald-950'
                      : 'border-transparent text-stone-300 hover:text-stone-300'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
