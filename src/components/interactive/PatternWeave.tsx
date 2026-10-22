import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Check, RotateCcw } from 'lucide-react';

interface PatternWeaveProps {
  onComplete: () => void;
}

export const PatternWeave: React.FC<PatternWeaveProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stones, setStones] = useState<{ x: number; y: number; r: number }[]>([
    { x: 100, y: 120, r: 18 },
    { x: 230, y: 180, r: 24 },
  ]);
  const [dragPoint, setDragPoint] = useState<{ x: number; y: number } | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);

  useEffect(() => {
    drawSand();
  }, [stones, dragPoint]);

  const drawSand = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Soft zen sand base
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1c1b18');
    grad.addColorStop(1, '#141310');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle rake ridges
    ctx.lineWidth = 1.2;
    const spacing = 10;
    for (let y = spacing; y < h; y += spacing) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(215, 204, 180, 0.08)';
      for (let x = 0; x < w; x += 5) {
        let offsetY = 0;
        // Bend rake around placed stones
        stones.forEach(stone => {
          const dx = x - stone.x;
          const dy = y - stone.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < stone.r * 2.8) {
            const factor = (stone.r * 2.8 - dist) / (stone.r * 2.8);
            offsetY += Math.sin(dist * 0.2) * factor * 8;
          }
        });

        // Ripple around cursor/drag
        if (dragPoint) {
          const dx = x - dragPoint.x;
          const dy = y - dragPoint.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            offsetY += Math.sin(dist * 0.4) * 6 * ((80 - dist) / 80);
          }
        }

        if (x === 0) {
          ctx.moveTo(x, y + offsetY);
        } else {
          ctx.lineTo(x, y + offsetY);
        }
      }
      ctx.stroke();
    }

    // Concentric ripple rings around stones
    stones.forEach(stone => {
      for (let r = stone.r + 6; r < stone.r + 34; r += 7) {
        ctx.beginPath();
        ctx.arc(stone.x, stone.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(215, 204, 180, 0.12)';
        ctx.stroke();
      }

      // Draw the smooth river stone
      ctx.beginPath();
      ctx.arc(stone.x, stone.y, stone.r, 0, Math.PI * 2);
      const stoneGrad = ctx.createRadialGradient(
        stone.x - stone.r * 0.3,
        stone.y - stone.r * 0.3,
        stone.r * 0.1,
        stone.x,
        stone.y,
        stone.r
      );
      stoneGrad.addColorStop(0, '#575550');
      stoneGrad.addColorStop(0.7, '#2b2a27');
      stoneGrad.addColorStop(1, '#1b1b19');
      ctx.fillStyle = stoneGrad;
      ctx.fill();
      ctx.strokeStyle = '#44423e';
      ctx.stroke();
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragPoint({ x, y });
    setInteractionCount(prev => prev + 1);
  };

  const handlePointerUp = () => {
    setDragPoint(null);
  };

  const placeStone = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (stones.length < 5) {
      setStones(prev => [...prev, { x, y, r: Math.floor(Math.random() * 8) + 16 }]);
      setInteractionCount(prev => prev + 5);
    }
  };

  const resetZenGarden = () => {
    setStones([
      { x: 100, y: 120, r: 18 },
      { x: 230, y: 180, r: 24 },
    ]);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-4">
      <div className="flex items-center justify-between w-full text-xs text-stone-300">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          Rake harmonic ripples & place stones ({stones.length}/5)
        </span>
        <button
          onClick={resetZenGarden}
          className="p-1 text-stone-400 hover:text-stone-200"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-[#141310]">
        <canvas
          ref={canvasRef}
          width={340}
          height={300}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerUp}
          onClick={placeStone}
          className="touch-none cursor-pointer block"
        />
      </div>

      <p className="text-xs text-stone-300 text-center italic">
        "Drag to rake sand. Tap empty space to seat a smoothed river stone."
      </p>

      <button
        onClick={onComplete}
        disabled={interactionCount < 10}
        className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:pointer-events-none text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
      >
        <Check className="w-4 h-4" />
        {interactionCount < 10 ? 'Rake sand gently first' : 'Finish & Center Mind'}
      </button>
    </div>
  );
};
