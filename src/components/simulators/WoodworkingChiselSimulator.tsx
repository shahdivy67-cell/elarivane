import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Sparkles, Undo2 } from 'lucide-react';

interface WoodworkingProps {
  onCompleteAction: () => void;
  savedState?: any;
  onSaveProgress?: (state: any) => void;
}

export const WoodworkingChiselSimulator: React.FC<WoodworkingProps> = ({
  onCompleteAction,
  savedState,
  onSaveProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mortiseDepth, setMortiseDepth] = useState<number>(savedState?.mortiseDepth || 0); // 0 to 100%
  const [grainAlignment, setGrainAlignment] = useState<'with-grain' | 'against-grain'>('with-grain');
  const [chiselBevelAngle, setChiselBevelAngle] = useState<number>(savedState?.chiselBevelAngle || 25); // degrees
  const [tearoutDetected, setTearoutDetected] = useState<boolean>(false);
  const [cleanPassCount, setCleanPassCount] = useState<number>(savedState?.cleanPassCount || 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f1712';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Hardwood Block (White Oak grain pattern)
    const blockX = 50;
    const blockY = 50;
    const blockW = 380;
    const blockH = 150;

    // Wood base
    ctx.fillStyle = '#78350f';
    ctx.fillRect(blockX, blockY, blockW, blockH);

    // Grain lines
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1.8;
    for (let y = blockY + 12; y < blockY + blockH; y += 14) {
      ctx.beginPath();
      ctx.moveTo(blockX, y);
      ctx.bezierCurveTo(blockX + 120, y + 4, blockX + 240, y - 4, blockX + blockW, y);
      ctx.stroke();
    }

    // Carved Mortise Joint Pocket
    const mortiseW = 140;
    const maxMortiseH = 90;
    const currentMortiseH = (mortiseDepth / 100) * maxMortiseH;
    const mortiseX = blockX + (blockW - mortiseW) / 2;

    if (currentMortiseH > 0) {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(mortiseX, blockY + 20, mortiseW, currentMortiseH);
      ctx.strokeStyle = tearoutDetected ? '#ef4444' : '#b45309';
      ctx.lineWidth = 2;
      ctx.strokeRect(mortiseX, blockY + 20, mortiseW, currentMortiseH);
    }

    // Draw Chisel Blade
    ctx.save();
    ctx.translate(mortiseX + mortiseW / 2, blockY + 18 + currentMortiseH);
    ctx.rotate((chiselBevelAngle - 25) * 0.015);

    // Chisel steel blade
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-15, -60);
    ctx.lineTo(15, -60);
    ctx.lineTo(15, 0);
    ctx.lineTo(-15, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    // Chisel cutting bevel tip
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    if (onSaveProgress) {
      onSaveProgress({ mortiseDepth, chiselBevelAngle, cleanPassCount });
    }
  }, [mortiseDepth, grainAlignment, chiselBevelAngle, tearoutDetected]);

  const executeChiselPass = () => {
    if (grainAlignment === 'against-grain') {
      setTearoutDetected(true);
    } else {
      setTearoutDetected(false);
      setMortiseDepth(d => Math.min(100, d + 15));
      setCleanPassCount(c => c + 1);
    }
  };

  const resetWoodBlock = () => {
    setMortiseDepth(0);
    setTearoutDetected(false);
    setCleanPassCount(0);
  };

  return (
    <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950 pb-3">
        <div>
          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            Joinery & Chisel Mechanics: Grain Orientation
          </h3>
          <p className="text-xs text-stone-300">
            Chiseling mortise joints requires cutting with the wood grain angle to prevent fiber tearout.
          </p>
        </div>

        <button
          onClick={resetWoodBlock}
          className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xl border border-stone-800 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-emerald-950 shadow-inner bg-[#0f1712]">
        <canvas ref={canvasRef} width={480} height={240} className="w-full h-56 block" />
        {tearoutDetected && (
          <div className="absolute top-3 right-3 bg-rose-950/90 border border-rose-700 text-rose-200 px-3 py-1 rounded-xl text-xs shadow-lg animate-bounce">
            ⚠️ Grain Tearout! Chiseling against wood fibers causes ragged splintering.
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1.5">
          <span className="text-stone-300 font-medium block">Cutting Direction:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setGrainAlignment('with-grain');
                setTearoutDetected(false);
              }}
              className={`flex-1 py-1.5 rounded-xl border font-medium ${
                grainAlignment === 'with-grain' ? 'bg-emerald-900 border-emerald-500 text-white' : 'bg-stone-900 border-stone-800 text-stone-400'
              }`}
            >
              With the Grain (Downhill)
            </button>
            <button
              onClick={() => setGrainAlignment('against-grain')}
              className={`flex-1 py-1.5 rounded-xl border font-medium ${
                grainAlignment === 'against-grain' ? 'bg-rose-950 border-rose-600 text-rose-200' : 'bg-stone-900 border-stone-800 text-stone-400'
              }`}
            >
              Against the Grain
            </button>
          </div>
        </div>

        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-stone-300 font-medium">Bevel Angle</span>
            <span className="font-mono text-amber-400 font-bold">{chiselBevelAngle}°</span>
          </div>
          <input
            type="range"
            min="20"
            max="35"
            step="1"
            value={chiselBevelAngle}
            onChange={e => setChiselBevelAngle(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={executeChiselPass}
          className="flex-1 py-2.5 bg-amber-800/80 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow transition-colors"
        >
          🔨 Tap Mallet & Shave Thin Shaving ({mortiseDepth}% cut)
        </button>
        <button
          onClick={onCompleteAction}
          disabled={cleanPassCount < 3}
          className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" /> Start Joinery Quiz (3 MCQs)
        </button>
      </div>
    </div>
  );
};
