import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Plus,
  Compass,
  Play,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  Sliders,
  CheckCircle2,
  Wand2
} from 'lucide-react';
import { SimulatorItem, SimulatorDomain } from '../types/simulator';
import { generateEcosystemSimulators } from '../data/simulatorsCatalog';
import { SimulatorPlayerModal } from './SimulatorPlayerModal';
import { SimulatorCreatorStudio } from './SimulatorCreatorStudio';
import { useApp } from '../context/AppContext';

export const SimulatorsScreen: React.FC = () => {
  const { showToast } = useApp();

  // Load simulator catalog + custom simulators stored in localStorage
  const [customSimulators, setCustomSimulators] = useState<SimulatorItem[]>(() => {
    try {
      const saved = localStorage.getItem('alivane_custom_simulators_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allSimulators = useMemo(() => {
    const base = generateEcosystemSimulators();
    return [...customSimulators, ...base];
  }, [customSimulators]);

  const [selectedDomain, setSelectedDomain] = useState<SimulatorDomain | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18;

  // Active playing modal
  const [activeSimulator, setActiveSimulator] = useState<SimulatorItem | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Filtered simulators
  const filteredSimulators = useMemo(() => {
    return allSimulators.filter(sim => {
      if (selectedDomain !== 'all' && sim.domain !== selectedDomain) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = sim.title.toLowerCase().includes(q);
        const matchSubtitle = sim.subtitle.toLowerCase().includes(q);
        const matchLesson = sim.coreLesson.toLowerCase().includes(q);
        return matchTitle || matchSubtitle || matchLesson;
      }
      return true;
    });
  }, [allSimulators, selectedDomain, searchQuery]);

  const totalPages = Math.ceil(filteredSimulators.length / pageSize);
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSimulators.slice(start, start + pageSize);
  }, [filteredSimulators, currentPage, pageSize]);

  const handleSaveCustomSimulator = (newSim: SimulatorItem) => {
    const updated = [newSim, ...customSimulators];
    setCustomSimulators(updated);
    try {
      localStorage.setItem('alivane_custom_simulators_v1', JSON.stringify(updated));
    } catch {
      // Local storage fallback
    }
    setIsCreatorOpen(false);
    showToast(`Created simulator "${newSim.title}"! (+50 Creator XP)`);
    setActiveSimulator(newSim);
  };

  const domainsList: { id: SimulatorDomain | 'all'; label: string }[] = [
    { id: 'all', label: 'All (1,036+)' },
    { id: 'human-psychology', label: 'Psychology' },
    { id: 'systems-ecology', label: 'Ecology' },
    { id: 'game-theory', label: 'Game Theory' },
    { id: 'physics-cosmos', label: 'Physics' },
    { id: 'mindful-habits', label: 'Mindfulness' },
    { id: 'finance-patience', label: 'Patience & Money' },
    { id: 'philosophy-ethics', label: 'Philosophy' },
    { id: 'social-dynamics', label: 'Social Dynamics' }
  ];

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4 md:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold font-mono">
              Alivane Simulators & Micro-Laboratories
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1">
            1,000+ Wisdom Simulators
          </h1>
          <p className="text-xs md:text-sm text-stone-300 mt-1 max-w-xl">
            Interactive scenarios that teach profound real-world truths—dopamine baselines, compound growth, game theory, and ecosystem stewardship—never mindless timepass.
          </p>
        </div>

        <button
          onClick={() => setIsCreatorOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/60 self-start sm:self-auto shrink-0"
        >
          <Wand2 className="w-4 h-4" />
          <span>Make Simulator</span>
        </button>
      </div>

      {/* Creator Studio Modal if Open */}
      {isCreatorOpen && (
        <SimulatorCreatorStudio
          onSaveNewSimulator={handleSaveCustomSimulator}
          onCancel={() => setIsCreatorOpen(false)}
        />
      )}

      {/* Search & Domain Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search over 1,000 simulators by topic, lesson, or psychological insight..."
            className="w-full bg-[#111914] border border-emerald-950/80 rounded-2xl pl-10 pr-4 py-3 text-xs text-stone-200 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 shadow-inner"
          />
        </div>

        {/* Domain Tabs Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {domainsList.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedDomain(item.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                selectedDomain === item.id
                  ? 'bg-emerald-800 text-white font-semibold shadow'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {paginatedList.map(sim => (
          <div
            key={sim.id}
            onClick={() => setActiveSimulator(sim)}
            className="bg-[#121c17] hover:bg-[#16251e] border border-emerald-950/80 hover:border-emerald-700/80 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] text-stone-400 mb-2">
                <span className="capitalize px-2 py-0.5 rounded-md font-semibold bg-emerald-950 text-emerald-300 border border-emerald-900/60">
                  {sim.domain.replace('-', ' ')}
                </span>
                <span>{sim.durationMinutes} min • +{sim.xpReward} XP</span>
              </div>

              <h3 className="text-sm font-semibold text-stone-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                {sim.title}
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                {sim.subtitle}
              </p>
            </div>

            {/* Core Lesson Pill */}
            <div className="p-2.5 rounded-xl bg-[#0c140f] border border-emerald-950/60 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-emerald-400 block tracking-wider">
                Lesson:
              </span>
              <p className="text-[11px] text-stone-300 line-clamp-2 italic leading-snug">
                "{sim.coreLesson}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-950/60 text-xs">
              <span className="text-emerald-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Launch Simulator →
              </span>
              <span className="text-[10px] text-stone-400">
                {sim.isCustomCreated ? 'User Created' : `${sim.timesCompleted} runs`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-emerald-950/60 text-xs text-stone-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, filteredSimulators.length)} of {filteredSimulators.length} simulators
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-30 border border-stone-800 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 py-1 text-emerald-300 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-30 border border-stone-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Active Simulator Modal */}
      {activeSimulator && (
        <SimulatorPlayerModal
          simulator={activeSimulator}
          onClose={() => setActiveSimulator(null)}
          onCompleted={xp => {
            showToast(`Completed simulator "${activeSimulator.title}". +${xp} XP!`);
          }}
        />
      )}
    </div>
  );
};
