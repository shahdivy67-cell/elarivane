import React, { useState, useEffect } from 'react';
import { Sun, Droplets, Wind, ShieldAlert, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

interface GardeningProps {
  onCompleteAction: () => void;
  savedState?: any;
  onSaveProgress?: (state: any) => void;
}

export const GardeningSoilSimulator: React.FC<GardeningProps> = ({
  onCompleteAction,
  savedState,
  onSaveProgress,
}) => {
  const [sunlightHours, setSunlightHours] = useState<number>(savedState?.sunlightHours || 6);
  const [moisturePercent, setMoisturePercent] = useState<number>(savedState?.moisturePercent || 50);
  const [soilType, setSoilType] = useState<'loam' | 'clay' | 'sandy'>(savedState?.soilType || 'loam');
  const [growthDays, setGrowthDays] = useState<number>(savedState?.growthDays || 0);
  const [plantState, setPlantState] = useState<'healthy' | 'wilted' | 'root-rot' | 'thriving'>('healthy');

  useEffect(() => {
    // Evaluate plant biological response to conditions
    if (moisturePercent > 85 && soilType === 'clay') {
      setPlantState('root-rot'); // Waterlogged anaerobic roots
    } else if (moisturePercent < 25 || sunlightHours > 10) {
      setPlantState('wilted'); // Dehydration
    } else if (moisturePercent >= 45 && moisturePercent <= 65 && sunlightHours >= 6 && sunlightHours <= 8 && soilType === 'loam') {
      setPlantState('thriving'); // Optimal loam crumb structure
    } else {
      setPlantState('healthy');
    }

    if (onSaveProgress) {
      onSaveProgress({ sunlightHours, moisturePercent, soilType, growthDays });
    }
  }, [sunlightHours, moisturePercent, soilType, growthDays]);

  const advanceDay = () => {
    setGrowthDays(d => d + 1);
  };

  return (
    <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950 pb-3">
        <div>
          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Permaculture & Soil Ecology: Plant Growth Lab
          </h3>
          <p className="text-xs text-stone-300">
            Soil structure governs drainage, aeration, and root respiration. Balance sun, moisture, and loam.
          </p>
        </div>

        <button
          onClick={advanceDay}
          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Day {growthDays} + Advance Growth</span>
        </button>
      </div>

      {/* Visual Plant & Subsurface Soil Cross-section */}
      <div className="h-56 bg-gradient-to-b from-[#081820] via-[#0d2217] to-[#1a150e] rounded-2xl border border-emerald-950 relative overflow-hidden flex flex-col justify-between p-4">
        {/* Above ground Atmosphere (Sun & Foliage) */}
        <div className="flex justify-between items-start z-10">
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-medium bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm">
            <Sun className="w-4 h-4" />
            <span>{sunlightHours} hrs Direct Sunlight</span>
          </div>
          <span
            className={`text-[11px] px-2.5 py-1 rounded-full font-semibold capitalize ${
              plantState === 'thriving'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : plantState === 'healthy'
                ? 'bg-teal-950 text-teal-300'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}
          >
            {plantState === 'root-rot' ? 'Root Rot (Waterlogged)' : plantState}
          </span>
        </div>

        {/* Plant Stem & Foliage Representation */}
        <div className="flex flex-col items-center justify-center my-auto z-10 transition-all duration-300">
          <div
            className="text-4xl transition-transform"
            style={{
              transform: plantState === 'wilted' ? 'rotate(-25deg) scale(0.85)' : 'scale(1.1)',
              filter: plantState === 'root-rot' ? 'hue-rotate(90deg) brightness(0.6)' : 'none',
            }}
          >
            {growthDays > 5 ? '🌿' : growthDays > 2 ? '🌱' : '🫘'}
          </div>
          <span className="text-[10px] text-stone-300 font-mono mt-1">
            Taproot Depth: {(12 + growthDays * 3)} cm
          </span>
        </div>

        {/* Subsurface Soil Texture Banner */}
        <div className="w-full bg-[#18130d]/90 border-t border-amber-950/80 p-2 rounded-xl flex items-center justify-between text-[11px] text-stone-300 z-10">
          <span>Soil Type: <strong className="text-amber-300 capitalize">{soilType}</strong></span>
          <span>Moisture Content: <strong className="text-cyan-400">{moisturePercent}%</strong></span>
        </div>
      </div>

      {/* Interactive Levers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1.5">
          <span className="text-stone-300 font-medium block">Soil Texture Medium:</span>
          <div className="flex gap-1.5">
            {(['loam', 'clay', 'sandy'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSoilType(type)}
                className={`flex-1 py-1 rounded-lg text-[10px] capitalize font-medium border ${
                  soilType === type
                    ? 'bg-emerald-900 border-emerald-500 text-white'
                    : 'bg-stone-900 border-stone-800 text-stone-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-stone-400 block">
            {soilType === 'loam' ? 'Balanced silt, clay & sand.' : soilType === 'clay' ? 'Dense; poor oxygen flow.' : 'Fast drainage; loses water.'}
          </span>
        </div>

        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-stone-300 font-medium">Daily Irrigation Moisture</span>
            <span className="font-mono text-cyan-400 font-bold">{moisturePercent}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={moisturePercent}
            onChange={e => setMoisturePercent(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-stone-300 font-medium">Sunlight Hours</span>
            <span className="font-mono text-amber-400 font-bold">{sunlightHours} hrs</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            value={sunlightHours}
            onChange={e => setSunlightHours(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Lesson Takeaway */}
      <div className="bg-[#14221a] p-3.5 rounded-2xl border border-emerald-800/60 text-xs space-y-1">
        <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          The Soil Ecology Lesson:
        </span>
        <p className="text-stone-200 leading-relaxed">
          Overwatering kills far more houseplants than underwatering. Roots require cellular oxygen; clay soil without organic loam structure becomes an anaerobic swamp that suffocates roots.
        </p>
      </div>

      <button
        onClick={onCompleteAction}
        className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/60"
      >
        <CheckCircle2 className="w-4 h-4" />
        Finish Gardening Lab & Start Assessment (3 MCQs)
      </button>
    </div>
  );
};
