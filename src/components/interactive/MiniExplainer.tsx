import React, { useState } from 'react';
import { Sparkles, Check, Info } from 'lucide-react';

interface MiniExplainerProps {
  activityId: string;
  onComplete: () => void;
}

export const MiniExplainer: React.FC<MiniExplainerProps> = ({ activityId, onComplete }) => {
  // Ponzo illusion interactive scaling
  const [horizonDistance, setHorizonDistance] = useState(50);
  const [revealed, setRevealed] = useState(false);

  // If Kintsugi or Moon
  const isKintsugi = activityId === 'curio_kintsugi';

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-5">
      {!isKintsugi ? (
        // Moon Horizon Illusion Interactive
        <div className="w-full space-y-4">
          <div className="relative h-56 bg-gradient-to-b from-[#060c11] via-[#0d1c24] to-[#1a2d2a] rounded-2xl overflow-hidden border border-emerald-950/60 p-4 flex flex-col justify-between">
            {/* High Zenith Moon */}
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-stone-300">Zenith (High Overhead)</span>
              <div className="w-10 h-10 rounded-full bg-amber-100 shadow-[0_0_15px_#fde68a] flex items-center justify-center text-[10px] text-stone-800 font-bold">
                1x
              </div>
            </div>

            {/* Horizon Moon whose perceived scale changes vs real scale */}
            <div className="flex flex-col items-center justify-end h-28 relative">
              {/* Silhouette skyline */}
              <div className="absolute bottom-0 w-full flex items-end justify-around text-stone-900 pointer-events-none z-10 opacity-70">
                <div className="w-6 h-14 bg-stone-900 rounded-t" />
                <div className="w-8 h-20 bg-stone-950 rounded-t" />
                <div className="w-5 h-10 bg-stone-900 rounded-t" />
                <div className="w-10 h-16 bg-stone-950 rounded-t" />
                <div className="w-7 h-12 bg-stone-900 rounded-t" />
              </div>

              {/* Horizon Moon */}
              <div
                className="rounded-full bg-amber-200 shadow-[0_0_24px_#fef08a] transition-all duration-300 flex items-center justify-center font-bold text-stone-800"
                style={{
                  width: revealed ? '40px' : `${40 + (horizonDistance / 100) * 36}px`,
                  height: revealed ? '40px' : `${40 + (horizonDistance / 100) * 36}px`,
                  fontSize: '11px',
                }}
              >
                {revealed ? '1x' : `${(1 + (horizonDistance / 100) * 0.9).toFixed(1)}x`}
              </div>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-300">
              <span>Perceived Horizon Magnification</span>
              <span className="text-amber-400 font-mono font-medium">+{horizonDistance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={horizonDistance}
              onChange={e => setHorizonDistance(Number(e.target.value))}
              disabled={revealed}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <button
              onClick={() => setRevealed(!revealed)}
              className="w-full py-1.5 px-3 bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              {revealed ? 'Resume Illusion Simulation' : 'Reveal Physical Optical Truth'}
            </button>
          </div>

          <div className="text-xs text-stone-300 space-y-2 leading-relaxed bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-900/30">
            <p>
              <strong className="text-emerald-300 font-medium">The Insight: </strong>
              The moon is roughly <strong>384,400 km</strong> away whether high or low. Its angular diameter is always exactly 0.5 degrees.
            </p>
            <p className="text-stone-300">
              Because your brain sees houses and trees near the horizon, it assumes that anything behind them must be enormous to appear at that size. Overhead in empty sky, there are no distance cues, so your perceptual system shrinks it down.
            </p>
          </div>
        </div>
      ) : (
        // Kintsugi visual interactive
        <div className="w-full space-y-4">
          <div className="relative h-56 bg-[#161514] rounded-2xl overflow-hidden border border-amber-900/30 p-4 flex flex-col items-center justify-center">
            {/* Ceramic bowl with glowing gold veins */}
            <div className="relative w-36 h-36 rounded-full border-4 border-stone-700/80 bg-gradient-to-tr from-stone-800 via-stone-700 to-stone-900 shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Gold Urushi repair fissures */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <path
                  d="M20 20 Q 45 40 50 50 T 80 85"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_6px_#f59e0b]"
                />
                <path
                  d="M50 50 Q 65 30 75 25"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_5px_#f59e0b]"
                />
                <path
                  d="M50 50 Q 30 65 25 80"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_5px_#f59e0b]"
                />
              </svg>
              <span className="text-[10px] text-amber-200/80 font-serif tracking-widest uppercase">
                金継ぎ
              </span>
            </div>
          </div>

          <div className="text-xs text-stone-300 space-y-2 leading-relaxed bg-amber-950/20 p-3.5 rounded-xl border border-amber-900/30">
            <p>
              <strong className="text-amber-300 font-medium">Philosophy of Wabi-Sabi: </strong>
              Rather than disguising fractures, Kintsugi illuminates them with 24k gold powder. The fracture is not seen as the end of the vessel, but as the moment it became unique.
            </p>
            <p className="text-stone-300">
              Take this moment to forgive an imperfect day or a broken habit without self-criticism.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={onComplete}
        className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
      >
        <Check className="w-4 h-4" />
        Finish Curiosity Explainer
      </button>
    </div>
  );
};
