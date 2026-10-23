import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Wand2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Clock,
  Layers,
  Award,
  Download,
  Upload,
  Archive,
  Play,
  Flame,
  WifiOff
} from 'lucide-react';
import { SimulatorMetadata, SkillCategory, SimulatorCompletionRecord } from '../types/visualSimulator';
import { generateFullVisualSkillLibrary } from '../data/visualSimulatorsRegistry';
import {
  getCompletedSimulatorRecords,
  getAllInProgressSimulatorIds,
  isSimulatorCompleted,
  exportSimulatorsDataPackage,
  importSimulatorsDataPackage
} from '../utils/simulatorStorage';
import { VisualSimulatorPlayerModal } from './VisualSimulatorPlayerModal';
import { MakeSimulatorStudio } from './MakeSimulatorStudio';
import { useApp } from '../context/AppContext';

export const VisualSkillSimulatorsScreen: React.FC = () => {
  const { showToast, isOnline } = useApp();

  // Custom simulators created on this device
  const [customSimulators, setCustomSimulators] = useState<SimulatorMetadata[]>(() => {
    try {
      const raw = localStorage.getItem('alivane_custom_simulators_v2');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Permanently completed records
  const [completionRecords, setCompletionRecords] = useState<SimulatorCompletionRecord[]>(() =>
    getCompletedSimulatorRecords()
  );

  // In-progress simulator IDs
  const [inProgressIds, setInProgressIds] = useState<string[]>(() => getAllInProgressSimulatorIds());

  // Master library: Bundled + User Created
  const masterLibrary = useMemo(() => {
    const bundled = generateFullVisualSkillLibrary();
    return [...customSimulators, ...bundled];
  }, [customSimulators]);

  // View state: 'new' | 'in-progress' | 'custom' | 'completed'
  const [discoveryTab, setDiscoveryTab] = useState<'new' | 'in-progress' | 'custom' | 'completed'>('new');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Modals
  const [activePlayerSimulator, setActivePlayerSimulator] = useState<SimulatorMetadata | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewScore, setReviewScore] = useState<number | undefined>(undefined);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Filtered simulator dataset based on discovery tab
  const filteredSimulators = useMemo(() => {
    return masterLibrary.filter(sim => {
      const isDone = completionRecords.some(r => r.simulatorId === sim.id);
      const isInProg = inProgressIds.includes(sim.id);

      // Strict Completion Exclusion from Active Discovery!
      if (discoveryTab === 'new') {
        if (isDone) return false; // NEVER repeat completed in new queue
      } else if (discoveryTab === 'in-progress') {
        if (!isInProg || isDone) return false;
      } else if (discoveryTab === 'custom') {
        if (!sim.isCustom) return false;
      } else if (discoveryTab === 'completed') {
        if (!isDone) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && sim.category !== selectedCategory) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          sim.title.toLowerCase().includes(q) ||
          sim.subtitle.toLowerCase().includes(q) ||
          sim.learningObjective.toLowerCase().includes(q) ||
          sim.coreLesson.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [masterLibrary, completionRecords, inProgressIds, discoveryTab, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredSimulators.length / pageSize);
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSimulators.slice(start, start + pageSize);
  }, [filteredSimulators, currentPage, pageSize]);

  // Open simulator (distinguishing review vs initial)
  const handleLaunchSimulator = (sim: SimulatorMetadata) => {
    const existingRecord = completionRecords.find(r => r.simulatorId === sim.id);
    if (existingRecord) {
      setIsReviewMode(true);
      setReviewScore(existingRecord.score);
    } else {
      setIsReviewMode(false);
      setReviewScore(undefined);
    }
    setActivePlayerSimulator(sim);
  };

  // Completion callback
  const handleSimulatorFinished = (score: number) => {
    // Refresh completions and progress
    const updated = getCompletedSimulatorRecords();
    setCompletionRecords(updated);
    setInProgressIds(getAllInProgressSimulatorIds());
    setActivePlayerSimulator(null);
    showToast(`Simulator assessment complete! Score: ${score}/3`);
  };

  // Publish custom simulator
  const handlePublishCustomSimulator = (newSim: SimulatorMetadata) => {
    const updated = [newSim, ...customSimulators];
    setCustomSimulators(updated);
    try {
      localStorage.setItem('alivane_custom_simulators_v2', JSON.stringify(updated));
    } catch {}
    setIsStudioOpen(false);
    showToast(`Published "${newSim.title}" locally! (+60 Creator XP)`);
    handleLaunchSimulator(newSim);
  };

  // Backup Data Export
  const handleExportData = () => {
    const jsonStr = exportSimulatorsDataPackage();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alivane-simulators-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Offline simulator records & labs exported.');
  };

  // Categories
  const categoriesList: { id: SkillCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Fields' },
    { id: 'arts-crafts', label: 'Arts & Crafts' },
    { id: 'practical-skills', label: 'Practical Skills' },
    { id: 'science-engineering', label: 'Science & Engineering' },
    { id: 'psychology-philosophy', label: 'Psychology & Philosophy' },
    { id: 'nature-systems', label: 'Nature & Systems' },
    { id: 'life-skills', label: 'Life Skills' },
  ];

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto px-4 pt-4 md:pt-6">
      {/* Top Header & Studio Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold font-mono">
              Alivane Visual Skill Simulators
            </span>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-full font-mono">
              Zero AI • Offline Native
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1">
            Visual Craft & Skill Labs
          </h1>
          <p className="text-xs md:text-sm text-stone-300 mt-1 max-w-xl">
            Hands-on visual models for pottery, joinery, permaculture, optics, and game theory. Every lab ends with 3 conceptual MCQs and is permanently archived upon completion.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsStudioOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all"
          >
            <Wand2 className="w-4 h-4" />
            <span>Make Simulator</span>
          </button>
          <button
            onClick={handleExportData}
            title="Export local backup"
            className="p-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-2xl border border-stone-800 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Make Simulator Studio Modal */}
      {isStudioOpen && (
        <MakeSimulatorStudio
          onPublishSimulator={handlePublishCustomSimulator}
          onCancel={() => setIsStudioOpen(false)}
        />
      )}

      {/* Discovery State Tabs: New (Active) | In-Progress | Created by Me | Completed Archive */}
      <div className="flex items-center gap-1.5 bg-[#101813] p-1.5 rounded-2xl border border-emerald-950/70">
        <button
          onClick={() => {
            setDiscoveryTab('new');
            setCurrentPage(1);
          }}
          className={`flex-1 py-2 text-xs rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 ${
            discoveryTab === 'new'
              ? 'bg-emerald-900 text-emerald-100 font-semibold shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Labs ({masterLibrary.length - completionRecords.length})</span>
        </button>

        <button
          onClick={() => {
            setDiscoveryTab('in-progress');
            setCurrentPage(1);
          }}
          className={`flex-1 py-2 text-xs rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 ${
            discoveryTab === 'in-progress'
              ? 'bg-emerald-900 text-emerald-100 font-semibold shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>In Progress ({inProgressIds.length})</span>
        </button>

        <button
          onClick={() => {
            setDiscoveryTab('custom');
            setCurrentPage(1);
          }}
          className={`flex-1 py-2 text-xs rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 ${
            discoveryTab === 'custom'
              ? 'bg-emerald-900 text-emerald-100 font-semibold shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Created by Me ({customSimulators.length})</span>
        </button>

        <button
          onClick={() => {
            setDiscoveryTab('completed');
            setCurrentPage(1);
          }}
          className={`flex-1 py-2 text-xs rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 ${
            discoveryTab === 'completed'
              ? 'bg-emerald-900 text-emerald-100 font-semibold shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Completed Archive ({completionRecords.length})</span>
        </button>
      </div>

      {/* Search and Category Filter */}
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
            placeholder="Search pottery, joinery, soil aeration, game theory, or color optics..."
            className="w-full bg-[#111914] border border-emerald-950/80 rounded-2xl pl-10 pr-4 py-3 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-emerald-600 shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categoriesList.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedCategory(item.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === item.id
                  ? 'bg-emerald-800 text-white font-semibold shadow'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {paginatedList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-400 space-y-2 bg-[#101914] rounded-3xl border border-emerald-950/60 p-6">
            <Sparkles className="w-8 h-8 text-emerald-500/40 mx-auto" />
            <p className="text-sm font-semibold text-stone-200">
              {discoveryTab === 'completed'
                ? 'No simulators archived yet. Complete a visual lab to store it here.'
                : discoveryTab === 'in-progress'
                ? 'No unfinished simulations. Start any active lab to practice.'
                : 'No simulators match your current filter.'}
            </p>
            <p className="text-xs text-stone-500">
              Simulations you finish are permanently archived and never randomly re-recommended.
            </p>
          </div>
        ) : (
          paginatedList.map(sim => {
            const completedRecord = completionRecords.find(r => r.simulatorId === sim.id);
            const isInProg = inProgressIds.includes(sim.id);

            return (
              <div
                key={sim.id}
                onClick={() => handleLaunchSimulator(sim)}
                className="bg-[#121c17] hover:bg-[#16251e] border border-emerald-950/80 hover:border-emerald-700/80 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 mb-2">
                    <span className="capitalize px-2 py-0.5 rounded-md font-semibold bg-emerald-950 text-emerald-300 border border-emerald-900/60">
                      {sim.category.replace('-', ' ')}
                    </span>
                    {completedRecord ? (
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
                        {completedRecord.score}/3 Quiz Score
                      </span>
                    ) : (
                      <span>{sim.durationMinutes} min • +{sim.xpReward} XP</span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-stone-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {sim.title}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                    {sim.learningObjective}
                  </p>
                </div>

                {/* Lesson Preview */}
                <div className="p-2.5 rounded-xl bg-[#0c140f] border border-emerald-950/60 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-emerald-400 block tracking-wider">
                    Core Truth:
                  </span>
                  <p className="text-[11px] text-stone-300 line-clamp-2 italic leading-snug">
                    "{sim.coreLesson}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-emerald-950/60 text-xs">
                  <span className="text-emerald-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    {completedRecord ? 'Review Archive ↺' : isInProg ? 'Resume Lab →' : 'Launch Simulator →'}
                  </span>
                  <span className="text-[10px] text-stone-500 capitalize">
                    {sim.interactionType.replace('-', ' ')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-emerald-950/60 text-xs text-stone-400">
          <span>
            Page {currentPage} of {totalPages} ({filteredSimulators.length} simulators)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-30 border border-stone-800 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-30 border border-stone-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Active Modal Player */}
      {activePlayerSimulator && (
        <VisualSimulatorPlayerModal
          simulator={activePlayerSimulator}
          onClose={() => setActivePlayerSimulator(null)}
          onFinishedSuccessfully={handleSimulatorFinished}
          isReviewMode={isReviewMode}
          previousScore={reviewScore}
        />
      )}
    </div>
  );
};
