import React, { useRef, useState, useEffect } from 'react';
import { RotateCw, Undo2, RefreshCw, CheckCircle2, Sparkles, Palette, Eye, AlertCircle } from 'lucide-react';

interface PotteryWheelProps {
  onCompleteAction: () => void;
  savedState?: any;
  onSaveProgress?: (state: any) => void;
}

export const PotteryWheelSimulator: React.FC<PotteryWheelProps> = ({
  onCompleteAction,
  savedState,
  onSaveProgress,
}) => {
  // Vessel Profile: 12 vertical segment radii (from top rim to base)
  const defaultRadii = [48, 52, 60, 68, 75, 78, 76, 70, 62, 54, 48, 45];
  const [radii, setRadii] = useState<number[]>(savedState?.radii || defaultRadii);
  const [history, setHistory] = useState<number[][]>([]);
  const [heightMultiplier, setHeightMultiplier] = useState<number>(savedState?.heightMultiplier || 1.0);
  const [wheelSpeed, setWheelSpeed] = useState<number>(savedState?.wheelSpeed || 2.2);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [wallThickness, setWallThickness] = useState<number>(savedState?.wallThickness || 8); // mm
  const [selectedClayColor, setSelectedClayColor] = useState<string>(savedState?.clayColor || '#a0522d'); // Terracotta
  const [selectedGrooveColor, setSelectedGrooveColor] = useState<string>('#fde047'); // Glaze yellow
  const [decorations, setDecorations] = useState<{ yPercent: number; color: string; width: number }[]>(
    savedState?.decorations || []
  );
  const [symmetryWarning, setSymmetryWarning] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragSegmentIdxRef = useRef<number | null>(null);

  // Pottery colors
  const clayHues = [
    { name: 'Terracotta', color: '#a0522d' },
    { name: 'Stoneware Cream', color: '#d8cca3' },
    { name: 'Graphite Charcoal', color: '#374151' },
    { name: 'Celadon Sage', color: '#4d7c5f' },
  ];

  const glazeHues = ['#fde047', '#38bdf8', '#f43f5e', '#ffffff'];

  // Save progress helper
  useEffect(() => {
    if (onSaveProgress) {
      onSaveProgress({
        radii,
        heightMultiplier,
        wheelSpeed,
        wallThickness,
        clayColor: selectedClayColor,
        decorations,
      });
    }
  }, [radii, heightMultiplier, wheelSpeed, wallThickness, selectedClayColor, decorations]);

  // Wheel rotation continuous loop
  useEffect(() => {
    let animId: number;
    const step = () => {
      setRotationAngle(a => (a + wheelSpeed * 0.03) % (Math.PI * 2));
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [wheelSpeed]);

  // Render on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a120e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const baseY = canvas.height - 45;
    const topY = baseY - 220 * heightMultiplier;
    const totalHeight = baseY - topY;
    const segHeight = totalHeight / (radii.length - 1);

    // 1. Draw rotating wheel head platter (isometric ellipse)
    ctx.save();
    ctx.translate(centerX, baseY + 15);
    ctx.beginPath();
    ctx.ellipse(0, 0, 115, 24, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1e2922';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2d4a36';
    ctx.stroke();

    // Wheel circular rotation radial notches
    for (let i = 0; i < 8; i++) {
      const angle = rotationAngle + (i * Math.PI) / 4;
      const nx = Math.cos(angle) * 105;
      const ny = Math.sin(angle) * 20;
      ctx.beginPath();
      ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#4ade8055';
      ctx.fill();
    }
    ctx.restore();

    // 2. Render Clay Body Profile with smooth 3D gradient illusion
    ctx.save();

    // Draw clay profile path
    ctx.beginPath();
    // Left profile going from top to bottom
    ctx.moveTo(centerX - radii[0], topY);
    for (let i = 1; i < radii.length; i++) {
      const y = topY + i * segHeight;
      const prevY = topY + (i - 1) * segHeight;
      const midY = (y + prevY) / 2;
      ctx.quadraticCurveTo(centerX - radii[i - 1], midY, centerX - radii[i], y);
    }
    // Bottom base line
    ctx.lineTo(centerX + radii[radii.length - 1], baseY);
    // Right profile going from bottom to top
    for (let i = radii.length - 2; i >= 0; i--) {
      const y = topY + i * segHeight;
      const nextY = topY + (i + 1) * segHeight;
      const midY = (y + nextY) / 2;
      ctx.quadraticCurveTo(centerX + radii[i + 1], midY, centerX + radii[i], y);
    }
    // Top rim ellipse
    ctx.closePath();

    // Linear horizontal lighting gradient to simulate cylindrical roundness
    const grad = ctx.createLinearGradient(centerX - 90, 0, centerX + 90, 0);
    grad.addColorStop(0, '#1c1917');
    grad.addColorStop(0.2, selectedClayColor);
    grad.addColorStop(0.55, '#fef08a44'); // Highlight reflection
    grad.addColorStop(0.8, selectedClayColor);
    grad.addColorStop(1, '#1c1917');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#052e16';
    ctx.stroke();

    // 3. Draw Top Rim Interior Opening
    ctx.beginPath();
    ctx.ellipse(centerX, topY, radii[0], radii[0] * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#0f1713';
    ctx.fill();
    ctx.lineWidth = wallThickness / 4;
    ctx.strokeStyle = selectedClayColor;
    ctx.stroke();

    // 4. Draw User Carved Grooves / Glaze Bands
    decorations.forEach(dec => {
      const decY = topY + dec.yPercent * totalHeight;
      // Interpolate radius at this height
      const segIndex = Math.min(radii.length - 2, Math.floor(dec.yPercent * (radii.length - 1)));
      const t = (dec.yPercent * (radii.length - 1)) - segIndex;
      const localRadius = radii[segIndex] * (1 - t) + radii[segIndex + 1] * t;

      ctx.beginPath();
      ctx.ellipse(centerX, decY, localRadius, localRadius * 0.24, 0, 0, Math.PI * 2);
      ctx.lineWidth = dec.width;
      ctx.strokeStyle = dec.color;
      ctx.stroke();
    });

    // 5. Draw interactive drag control handles on left & right profile
    for (let i = 0; i < radii.length; i++) {
      const y = topY + i * segHeight;
      // Right handle
      ctx.beginPath();
      ctx.arc(centerX + radii[i], y, 4, 0, Math.PI * 2);
      ctx.fillStyle = dragSegmentIdxRef.current === i ? '#fde047' : '#34d399';
      ctx.fill();
      // Left handle
      ctx.beginPath();
      ctx.arc(centerX - radii[i], y, 4, 0, Math.PI * 2);
      ctx.fillStyle = dragSegmentIdxRef.current === i ? '#fde047' : '#34d399';
      ctx.fill();
    }

    ctx.restore();

    // Check physical structural stability
    const maxR = Math.max(...radii);
    const minR = Math.min(...radii);
    const rimRadius = radii[0];
    const baseRadius = radii[radii.length - 1];

    if (maxR > 92 && wallThickness < 5) {
      setSymmetryWarning('Vessel profile is overly flared with thin walls; risk of kiln collapse.');
    } else if (rimRadius > baseRadius * 2.2) {
      setSymmetryWarning('Top-heavy rim: center of gravity is precarious.');
    } else if (wallThickness > 14) {
      setSymmetryWarning('Wall thickness is heavy; require extensive drying to avoid cracking.');
    } else {
      setSymmetryWarning(null);
    }
  }, [radii, heightMultiplier, wheelSpeed, wallThickness, selectedClayColor, decorations, rotationAngle]);

  // Pointer interactions for pulling clay
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const baseY = canvas.height - 45;
    const topY = baseY - 220 * heightMultiplier;
    const totalHeight = baseY - topY;
    const segHeight = totalHeight / (radii.length - 1);

    // Save history for undo
    setHistory(prev => [...prev.slice(-10), [...radii]]);

    // Find nearest vertical segment
    let bestIdx = 0;
    let bestDist = 9999;
    for (let i = 0; i < radii.length; i++) {
      const segY = topY + i * segHeight;
      const dist = Math.abs(segY - y);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    isDraggingRef.current = true;
    dragSegmentIdxRef.current = bestIdx;
    updateRadiusAt(bestIdx, Math.abs(x - centerX));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || dragSegmentIdxRef.current === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const centerX = canvas.width / 2;

    updateRadiusAt(dragSegmentIdxRef.current, Math.abs(x - centerX));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    dragSegmentIdxRef.current = null;
  };

  const updateRadiusAt = (index: number, newR: number) => {
    const clampedR = Math.max(20, Math.min(95, newR));
    setRadii(prev => {
      const copy = [...prev];
      copy[index] = clampedR;
      // Gentle smoothing of neighboring segments
      if (index > 0) copy[index - 1] = Math.round(copy[index - 1] * 0.7 + clampedR * 0.3);
      if (index < copy.length - 1) copy[index + 1] = Math.round(copy[index + 1] * 0.7 + clampedR * 0.3);
      return copy;
    });
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRadii(prev);
    setHistory(h => h.slice(0, -1));
  };

  const resetVessel = () => {
    setRadii(defaultRadii);
    setDecorations([]);
    setHeightMultiplier(1.0);
    setWallThickness(8);
  };

  const addGrooveAtMiddle = () => {
    const yPercent = 0.2 + (decorations.length * 0.18) % 0.6;
    setDecorations(prev => [...prev, { yPercent, color: selectedGrooveColor, width: 2.5 }]);
  };

  return (
    <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl p-4 md:p-6 space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950 pb-3">
        <div>
          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            Pottery Wheel: Centering, Pulling & Shaping Clay
          </h3>
          <p className="text-xs text-stone-300">
            Touch and drag directly on the spinning clay wall to widen or neck the vessel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={history.length === 0}
            className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-300 text-xs rounded-xl border border-stone-800 flex items-center gap-1.5 transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Undo
          </button>
          <button
            onClick={resetVessel}
            className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xl border border-stone-800 transition-colors"
            title="Reset Clay Shape"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Wheel Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-950 shadow-inner bg-[#0a120e]">
        <canvas
          ref={canvasRef}
          width={480}
          height={290}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-64 touch-none cursor-ew-resize block"
        />

        <div className="absolute top-2 left-3 text-[10px] text-stone-400 font-mono bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
          Wheel RPM: {Math.round(wheelSpeed * 28)} | Wall Thickness: {wallThickness}mm
        </div>

        {symmetryWarning && (
          <div className="absolute top-2 right-3 max-w-[240px] bg-amber-950/90 border border-amber-700 text-amber-200 px-2.5 py-1 rounded-xl text-[11px] flex items-center gap-1.5 shadow-lg">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{symmetryWarning}</span>
          </div>
        )}
      </div>

      {/* Controls Bar: Sliders, Clay Hue, Glaze Lines */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Clay & Glaze Pickers */}
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-2">
          <span className="text-[11px] font-semibold text-stone-300 block">Clay Body Type:</span>
          <div className="flex items-center gap-2">
            {clayHues.map(c => (
              <button
                key={c.name}
                onClick={() => setSelectedClayColor(c.color)}
                style={{ backgroundColor: c.color }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  selectedClayColor === c.color ? 'scale-110 border-white' : 'border-transparent'
                }`}
                title={c.name}
              />
            ))}
          </div>

          <span className="text-[11px] font-semibold text-stone-300 block pt-1">Glaze Grooves:</span>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {glazeHues.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedGrooveColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-5 h-5 rounded-full border ${
                    selectedGrooveColor === color ? 'border-white scale-110' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={addGrooveAtMiddle}
              className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[10px] rounded-lg"
            >
              + Draw Band
            </button>
          </div>
        </div>

        {/* Height & Wall Thickness Slider */}
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-stone-300">Vessel Height Ratio</span>
            <span className="font-mono text-emerald-400">{heightMultiplier.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.25"
            step="0.05"
            value={heightMultiplier}
            onChange={e => setHeightMultiplier(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] pt-1">
            <span className="text-stone-300">Clay Wall Thickness</span>
            <span className="font-mono text-emerald-400">{wallThickness} mm</span>
          </div>
          <input
            type="range"
            min="4"
            max="16"
            step="1"
            value={wallThickness}
            onChange={e => setWallThickness(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Wheel Speed & Rotation */}
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-stone-300">Wheel Rotation Speed</span>
            <span className="font-mono text-amber-400">{wheelSpeed.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.5"
            step="0.2"
            value={wheelSpeed}
            onChange={e => setWheelSpeed(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />

          <p className="text-[10px] text-stone-400 leading-snug pt-1">
            * Higher speeds assist in rapid centering; slower speeds give precise control when necking narrow bottle rims.
          </p>
        </div>
      </div>

      {/* Real Pottery Principle Insight */}
      <div className="bg-[#14221a] p-3.5 rounded-2xl border border-emerald-800/60 text-xs space-y-1">
        <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          The Pottery Lesson (Centering & Wall Uniformity):
        </span>
        <p className="text-stone-200 leading-relaxed">
          In physical pottery, if the walls are unevenly thick, water evaporates at different rates during drying, causing the vessel to crack in the kiln. Centering the clay lump is 80% of the battle—mastery begins before the shaping ever starts.
        </p>
        <p className="text-[10px] text-stone-400 italic pt-0.5">
          Disclaimer: This digital simulator teaches structural symmetry and wall thickness principles, but does not replace tactile physical wheel practice with wet clay.
        </p>
      </div>

      {/* Completion Button to proceed to 3 MCQs */}
      <button
        onClick={onCompleteAction}
        className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/60"
      >
        <CheckCircle2 className="w-4 h-4" />
        Finish Vessel & Take Skill Assessment (3 MCQs)
      </button>
    </div>
  );
};
