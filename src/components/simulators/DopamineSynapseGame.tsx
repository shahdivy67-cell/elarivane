import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Sparkles, Brain, Award } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'dopamine' | 'calm' | 'distraction';
}

export const DopamineSynapseGame: React.FC<{ onFinishLesson: () => void }> = ({ onFinishLesson }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [synapseReceptors, setSynapseReceptors] = useState<number>(8); // Receptors count
  const [fastMediaPings, setFastMediaPings] = useState<number>(0);
  const [deepPeaceScore, setDeepPeaceScore] = useState<number>(50);
  const [gameTime, setGameTime] = useState<number>(0);

  const particlesRef = useRef<Particle[]>([]);

  // Spawn initial neurotransmitter particles
  useEffect(() => {
    const list: Particle[] = [];
    for (let i = 0; i < 25; i++) {
      list.push({
        x: Math.random() * 450,
        y: Math.random() * 80 + 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 1.2 + 0.5,
        type: Math.random() > 0.4 ? 'calm' : 'dopamine',
      });
    }
    particlesRef.current = list;
  }, []);

  useEffect(() => {
    let anim: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      ctx.fillStyle = '#080d0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Synaptic cleft membrane background
      ctx.strokeStyle = '#1e382b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 50);
      ctx.lineTo(canvas.width, 50);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 190);
      ctx.lineTo(canvas.width, 190);
      ctx.stroke();

      // Post-synaptic Receptors along bottom membrane
      const receptorSpacing = canvas.width / (synapseReceptors + 1);
      for (let i = 1; i <= synapseReceptors; i++) {
        const rx = i * receptorSpacing;
        const ry = 190;
        ctx.beginPath();
        ctx.arc(rx, ry, 9, Math.PI, 0); // Receptor cup
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Update & Draw Neurotransmitter Molecules
      const particles = particlesRef.current;
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 10 || p.x > canvas.width - 10) p.vx *= -1;

        // Collision with receptor membrane
        if (p.y > 182) {
          // Check if caught in receptor
          for (let i = 1; i <= synapseReceptors; i++) {
            const rx = i * receptorSpacing;
            if (Math.abs(p.x - rx) < 12) {
              // Bound to receptor!
              if (p.type === 'calm') {
                setDeepPeaceScore(s => Math.min(100, s + 1));
              }
              break;
            }
          }
          // Recycle to top vesicle
          p.y = 48;
          p.x = Math.random() * canvas.width;
          p.vy = Math.random() * 1.4 + 0.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.type === 'distraction' ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = p.type === 'dopamine' ? '#f59e0b' : p.type === 'calm' ? '#38bdf8' : '#ef4444';
        ctx.shadowBlur = 6;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      anim = requestAnimationFrame(loop);
    };

    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [synapseReceptors]);

  // Click to trigger quick short-form media flash
  const triggerReelsSpike = () => {
    setFastMediaPings(p => p + 1);
    // Blast high-frequency distraction molecules
    for (let i = 0; i < 15; i++) {
      particlesRef.current.push({
        x: Math.random() * 450,
        y: 52,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        type: 'distraction',
      });
    }

    // Downregulate receptors when overstimulated
    setSynapseReceptors(r => Math.max(3, r - 1));
    setDeepPeaceScore(s => Math.max(10, s - 8));
  };

  // Click to induce quiet mindfulness pause (regrows receptors)
  const induceCalmWalk = () => {
    // Clean out noise particles
    particlesRef.current = particlesRef.current.filter(p => p.type !== 'distraction');
    // Add calm molecules
    for (let i = 0; i < 8; i++) {
      particlesRef.current.push({
        x: Math.random() * 450,
        y: 50,
        vx: (Math.random() - 0.5) * 1.2,
        vy: Math.random() * 1 + 0.5,
        type: 'calm',
      });
    }

    // Re-upregulate sensitive receptors
    setSynapseReceptors(r => Math.min(10, r + 1));
    setDeepPeaceScore(s => Math.min(100, s + 12));
  };

  return (
    <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-base font-serif font-bold text-white">
              Synaptic Cleft: Live Neurochemical Downregulation Simulator
            </h3>
          </div>
          <p className="text-xs text-stone-300">
            Interactive biological synapse. Test what happens when you blast the cleft with rapid stimulation vs analog calm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerReelsSpike}
            className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-medium transition-colors"
          >
            ⚡ Blast 100 Short Clips
          </button>
          <button
            onClick={induceCalmWalk}
            className="px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 rounded-xl text-xs font-medium transition-colors"
          >
            🍃 15-Min Analog Pause
          </button>
        </div>
      </div>

      {/* Synapse Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-950 shadow-inner bg-[#080d0a]">
        <canvas
          ref={canvasRef}
          width={480}
          height={220}
          className="w-full h-52 block"
        />

        <div className="absolute top-2 left-3 text-[10px] text-stone-400 font-mono">
          Top: Pre-synaptic release | Bottom: Receptor density ({synapseReceptors} active)
        </div>
      </div>

      {/* Biological Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-[#121c17] p-3 rounded-xl border border-emerald-950">
          <span className="text-stone-400 text-[11px] block">Receptor Sensitivity</span>
          <span className={`text-base font-bold ${synapseReceptors >= 7 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {synapseReceptors >= 7 ? 'High (Rich Everyday Joy)' : 'Downregulated (Numb)'}
          </span>
        </div>
        <div className="bg-[#121c17] p-3 rounded-xl border border-emerald-950">
          <span className="text-stone-400 text-[11px] block">Sustained Peace Index</span>
          <span className="text-base font-bold text-sky-400">{deepPeaceScore} / 100</span>
        </div>
        <div className="bg-[#121c17] p-3 rounded-xl border border-emerald-950 col-span-2 sm:col-span-1">
          <span className="text-stone-400 text-[11px] block">Receptor Count</span>
          <span className="text-base font-mono font-bold text-emerald-300">{synapseReceptors} Receptor Cups</span>
        </div>
      </div>

      {/* The Core Lesson */}
      <div className="bg-[#14221a] p-3.5 rounded-2xl border border-emerald-800/60 text-xs space-y-1">
        <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
          Neuroscience Truth:
        </span>
        <p className="text-stone-200 leading-relaxed">
          The brain maintains homeostasis. When you overload synapses with cheap dopamine floods (scrolling reels, gambling, continuous pings), the post-synaptic neuron <strong>pulls its receptors inward</strong> to avoid burnout.
          The tragic result: normal sunlight, reading a book, or quiet conversations feel boring. Giving your brain an analog break allows receptors to return to the surface, restoring natural joy.
        </p>
      </div>

      <button
        onClick={onFinishLesson}
        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
      >
        <CheckCircle2 className="w-4 h-4" />
        Absorb Neurochemical Recalibration (+50 XP)
      </button>
    </div>
  );
};
