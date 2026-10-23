import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Play, Pause, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const MyceliumForestGame: React.FC<{ onFinishLesson: () => void }> = ({ onFinishLesson }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [soilNutrient, setSoilNutrient] = useState(65);
  const [droughtLevel, setDroughtLevel] = useState(25);
  const [hyphaeStrandsCount, setHyphaeStrandsCount] = useState(0);
  const [aphidAttack, setAphidAttack] = useState(false);
  const [forestHealth, setForestHealth] = useState(85);

  // Trees: Mother trees & seedlings
  const trees = [
    { x: 70, y: 160, isMother: true, energy: 90, name: 'Ancient Oak' },
    { x: 190, y: 70, isMother: false, energy: 40, name: 'Birch Sapling' },
    { x: 310, y: 170, isMother: true, energy: 95, name: 'Cedar Elder' },
    { x: 420, y: 80, isMother: false, energy: 35, name: 'Pine Seedling' },
  ];

  const [connections, setConnections] = useState<[number, number][]>([]);
  const [dragStart, setDragStart] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a110d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw underground mycorrhizal hyphae fungal connections
    connections.forEach(([t1, t2]) => {
      ctx.beginPath();
      ctx.moveTo(trees[t1].x, trees[t1].y);
      // Gentle wavy fungal filament
      const midX = (trees[t1].x + trees[t2].x) / 2;
      const midY = (trees[t1].y + trees[t2].y) / 2 + 15;
      ctx.quadraticCurveTo(midX, midY, trees[t2].x, trees[t2].y);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#34d399';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Pulse nutrients animation
      const now = Date.now() / 600;
      const flowT = (now % 1);
      const px = (1 - flowT) * (1 - flowT) * trees[t1].x + 2 * (1 - flowT) * flowT * midX + flowT * flowT * trees[t2].x;
      const py = (1 - flowT) * (1 - flowT) * trees[t1].y + 2 * (1 - flowT) * flowT * midY + flowT * flowT * trees[t2].y;

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.fill();
    });

    // Draw trees
    trees.forEach((t, idx) => {
      const isSelected = dragStart === idx;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.isMother ? 22 : 14, 0, Math.PI * 2);
      ctx.fillStyle = t.isMother ? '#166534' : '#15803d';
      ctx.fill();
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.strokeStyle = isSelected ? '#fbbf24' : '#22c55e';
      ctx.stroke();

      // Tree Trunk & Crown icon
      ctx.fillStyle = '#f0fdf4';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t.isMother ? '🌳' : '🌱', t.x, t.y + 5);

      // Name label
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#a7f3d0';
      ctx.fillText(t.name, t.x, t.y + (t.isMother ? 34 : 26));
    });

    // Evaluate health
    const connectedRatio = connections.length / 4;
    const computedHealth = Math.min(100, Math.max(10, Math.round(connectedRatio * 50 + soilNutrient * 0.4 - droughtLevel * 0.3)));
    setForestHealth(computedHealth);
  }, [connections, dragStart, soilNutrient, droughtLevel, aphidAttack]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check tree hit
    const clickedIdx = trees.findIndex(t => Math.hypot(t.x - x, t.y - y) < 25);
    if (clickedIdx !== -1) {
      if (dragStart === null) {
        setDragStart(clickedIdx);
      } else {
        if (dragStart !== clickedIdx) {
          // Add connection if not already present
          const exists = connections.some(
            ([a, b]) => (a === dragStart && b === clickedIdx) || (a === clickedIdx && b === dragStart)
          );
          if (!exists) {
            setConnections(prev => [...prev, [dragStart, clickedIdx]]);
            setHyphaeStrandsCount(c => c + 1);
          }
        }
        setDragStart(null);
      }
    } else {
      setDragStart(null);
    }
  };

  const triggerAphidInvasion = () => {
    setAphidAttack(true);
    setTimeout(() => setAphidAttack(false), 4000);
  };

  return (
    <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base font-serif font-bold text-white">
              Woodland Symbiosis: Drag & Weave Mycelium
            </h3>
          </div>
          <p className="text-xs text-stone-300">
            Click one tree then another to weave subterranean fungal nutrient lines and share sugars with saplings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerAphidInvasion}
            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Simulate Pest Attack
          </button>
          <button
            onClick={() => {
              setConnections([]);
              setHyphaeStrandsCount(0);
            }}
            className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xl border border-stone-800 transition-colors"
            title="Clear threads"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-950 shadow-inner bg-[#0a110d]">
        <canvas
          ref={canvasRef}
          width={490}
          height={230}
          onPointerDown={handlePointerDown}
          className="w-full h-52 cursor-pointer block"
        />

        {aphidAttack && (
          <div className="absolute top-3 right-3 bg-rose-950/90 border border-rose-700 text-rose-200 px-3 py-1 rounded-xl text-xs animate-bounce flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Chemical distress signal propagating across hyphae network!</span>
          </div>
        )}

        <div className="absolute bottom-2 left-3 text-[11px] text-emerald-400 font-mono">
          {connections.length === 0
            ? 'Tap a Mother Tree, then tap a seedling to feed it.'
            : `${connections.length} Mycelium Highway Channels Active`}
        </div>
      </div>

      {/* Forest Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-[#121c17] p-3 rounded-xl border border-emerald-950">
          <span className="text-stone-400 text-[11px] block">Forest Living Vitality</span>
          <span className="text-base font-bold text-emerald-400">{forestHealth}%</span>
        </div>
        <div className="bg-[#121c17] p-3 rounded-xl border border-emerald-950">
          <span className="text-stone-400 text-[11px] block">Subterranean Hyphae</span>
          <span className="text-base font-bold text-cyan-400">{connections.length} Links</span>
        </div>
        <div className="bg-[#121c17] p-3 rounded-xl border border-emerald-950 col-span-2 sm:col-span-1">
          <span className="text-stone-400 text-[11px] block">Sapling Survival Margin</span>
          <span className="text-base font-bold text-amber-400">
            {connections.length >= 2 ? 'Shielded by Canopy' : 'Vulnerable to Sun'}
          </span>
        </div>
      </div>

      {/* The Core Lesson */}
      <div className="bg-[#14221a] p-3.5 rounded-2xl border border-emerald-800/60 text-xs space-y-1">
        <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
          Ecological Teaching:
        </span>
        <p className="text-stone-200 leading-relaxed">
          Trees in a natural forest do not compete in ruthless dog-eat-dog isolation. Older trees pump carbon through subterranean fungal mycelium to shaded young saplings, ensuring the whole canopy remains humid and alive during droughts.
        </p>
      </div>

      <button
        onClick={onFinishLesson}
        disabled={connections.length < 2}
        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:pointer-events-none text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
      >
        <CheckCircle2 className="w-4 h-4" />
        {connections.length < 2 ? 'Weave at least 2 mycelium bridges' : 'Absorb Living Lesson (+50 XP)'}
      </button>
    </div>
  );
};
