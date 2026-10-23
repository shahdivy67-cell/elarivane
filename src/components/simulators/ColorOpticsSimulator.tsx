import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';

interface ColorOpticsProps {
  onCompleteAction: () => void;
  savedState?: any;
  onSaveProgress?: (state: any) => void;
}

export const ColorOpticsSimulator: React.FC<ColorOpticsProps> = ({
  onCompleteAction,
  savedState,
  onSaveProgress,
}) => {
  const [redIntensity, setRedIntensity] = useState<number>(savedState?.redIntensity || 180);
  const [greenIntensity, setGreenIntensity] = useState<number>(savedState?.greenIntensity || 120);
  const [blueIntensity, setBlueIntensity] = useState<number>(savedState?.blueIntensity || 220);
  const [mode, setMode] = useState<'additive' | 'subtractive'>(savedState?.mode || 'additive');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = mode === 'additive' ? '#070b09' : '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cX = canvas.width / 2;
    const cY = canvas.height / 2;

    if (mode === 'additive') {
      // Light Additive (RGB): Screen pixels, sunlight
      ctx.globalCompositeOperation = 'screen';

      // Red Circle
      ctx.beginPath();
      ctx.arc(cX - 45, cY - 25, 65, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${redIntensity}, 0, 0)`;
      ctx.fill();

      // Green Circle
      ctx.beginPath();
      ctx.arc(cX + 45, cY - 25, 65, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(0, ${greenIntensity}, 0)`;
      ctx.fill();

      // Blue Circle
      ctx.beginPath();
      ctx.arc(cX, cY + 45, 65, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(0, 0, ${blueIntensity})`;
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';
    } else {
      // Pigment Subtractive (CMYK): Watercolor & oil paints
      ctx.globalCompositeOperation = 'multiply';

      // Cyan (absorbs red)
      ctx.beginPath();
      ctx.arc(cX - 45, cY - 25, 65, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(0, ${greenIntensity}, ${blueIntensity})`;
      ctx.fill();

      // Magenta (absorbs green)
      ctx.beginPath();
      ctx.arc(cX + 45, cY - 25, 65, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${redIntensity}, 0, ${blueIntensity})`;
      ctx.fill();

      // Yellow (absorbs blue)
      ctx.beginPath();
      ctx.arc(cX, cY + 45, 65, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${redIntensity}, ${greenIntensity}, 0)`;
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';
    }

    if (onSaveProgress) {
      onSaveProgress({ redIntensity, greenIntensity, blueIntensity, mode });
    }
  }, [redIntensity, greenIntensity, blueIntensity, mode]);

  return (
    <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950 pb-3">
        <div>
          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            Color Theory & Optics: Additive vs Subtractive
          </h3>
          <p className="text-xs text-stone-300">
            Light combines into pure white illumination (additive); paint pigments absorb light and blend toward black (subtractive).
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMode(m => (m === 'additive' ? 'subtractive' : 'additive'))}
            className="px-3 py-1.5 bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-xl font-medium"
          >
            Switch to {mode === 'additive' ? 'Paint (Subtractive)' : 'Light (Additive)'}
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-emerald-950 shadow-inner bg-[#070b09]">
        <canvas ref={canvasRef} width={480} height={250} className="w-full h-56 block" />
        <div className="absolute bottom-2 left-3 text-[11px] font-mono text-stone-400">
          Mode: <strong className="text-emerald-300 uppercase">{mode}</strong> (Center overlap demonstrates physics)
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-rose-400 font-semibold block">Red / Cyan Channel: {redIntensity}</span>
          <input
            type="range"
            min="0"
            max="255"
            value={redIntensity}
            onChange={e => setRedIntensity(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-emerald-400 font-semibold block">Green / Magenta Channel: {greenIntensity}</span>
          <input
            type="range"
            min="0"
            max="255"
            value={greenIntensity}
            onChange={e => setGreenIntensity(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-sky-400 font-semibold block">Blue / Yellow Channel: {blueIntensity}</span>
          <input
            type="range"
            min="0"
            max="255"
            value={blueIntensity}
            onChange={e => setBlueIntensity(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={onCompleteAction}
        className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
      >
        <CheckCircle2 className="w-4 h-4" />
        Finish Color Optics Lab & Test Understanding (3 MCQs)
      </button>
    </div>
  );
};
