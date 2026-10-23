import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Play, Pause, CheckCircle2, Sparkles, Orbit } from 'lucide-react';

export const GravityOrbiterGame: React.FC<{ onFinishLesson: () => void }> = ({ onFinishLesson }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [velocity, setVelocity] = useState(4.2);
  const [gravityMass, setGravityMass] = useState(55);
  const [orbitStatus, setOrbitStatus] = useState<'stable' | 'crashed' | 'escaped'>('stable');
  const [successfulOrbits, setSuccessfulOrbits] = useState(0);

  const satelliteRef = useRef<{ x: number; y: number; vx: number; vy: number; trail: { x: number; y: number }[] }>({
    x: 240,
    y: 60,
    vx: 3.8,
    vy: 0,
    trail: []
  });

  const center = { x: 240, y: 130 };

  const resetOrbit = (customV?: number, customG?: number) => {
    const v = customV ?? velocity;
    satelliteRef.current = {
      x: 240,
      y: 60,
      vx: v,
      vy: 0,
      trail: []
    };
    setOrbitStatus('stable');
  };

  useEffect(() => {
    let anim: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lapCount = 0;
    let prevAngle = 0;

    const loop = () => {
      ctx.fillStyle = '#060a08';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield background points
      ctx.fillStyle = '#ffffff15';
      ctx.fillRect(40, 30, 2, 2);
      ctx.fillRect(400, 50, 1.5, 1.5);
      ctx.fillRect(100, 200, 2, 2);
      ctx.fillRect(430, 190, 1.5, 1.5);

      const sat = satelliteRef.current;

      // Gravity Physics calculation
      const dx = center.x - sat.x;
      const dy = center.y - sat.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 18) {
        setOrbitStatus('crashed');
      } else if (dist > 230) {
        setOrbitStatus('escaped');
      } else {
        // Gravitational force: F = G * M / r^2
        const force = (gravityMass * 60) / (dist * dist);
        const ax = (dx / dist) * force;
        const ay = (dy / dist) * force;

        sat.vx += ax * 0.15;
        sat.vy += ay * 0.15;
        sat.x += sat.vx;
        sat.y += sat.vy;

        // Trail recording
        sat.trail.push({ x: sat.x, y: sat.y });
        if (sat.trail.length > 60) sat.trail.shift();

        // Count revolutions
        const currentAngle = Math.atan2(sat.y - center.y, sat.x - center.x);
        if (prevAngle < 0 && currentAngle >= 0 && sat.x > center.x) {
          lapCount++;
          setSuccessfulOrbits(lapCount);
        }
        prevAngle = currentAngle;
      }

      // Draw Orbit Trail
      if (sat.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(sat.trail[0].x, sat.trail[0].y);
        for (let i = 1; i < sat.trail.length; i++) {
          ctx.lineTo(sat.trail[i].x, sat.trail[i].y);
        }
        ctx.strokeStyle = orbitStatus === 'stable' ? 'rgba(52, 211, 153, 0.4)' : 'rgba(239, 68, 68, 0.3)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Draw Central Attractor (The Anchor / Core Purpose)
      ctx.beginPath();
      ctx.arc(center.x, center.y, 16, 0, Math.PI * 2);
      const sunGrad = ctx.createRadialGradient(center.x, center.y, 4, center.x, center.y, 22);
      sunGrad.addColorStop(0, '#fef08a');
      sunGrad.addColorStop(0.5, '#f59e0b');
      sunGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = sunGrad;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#f59e0b';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Satellite (Forward Momentum)
      ctx.beginPath();
      ctx.arc(sat.x, sat.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.shadowBlur = 0;

      anim = requestAnimationFrame(loop);
    };

    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [gravityMass, velocity]);

  return (
    <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <h3 className="text-base font-serif font-bold text-white">
              Orbital Mechanics: Balance of Gravitational Pull & Momentum
            </h3>
          </div>
          <p className="text-xs text-stone-300">
            Real dynamic gravity simulator. Adjust lateral speed and gravitational anchor mass to achieve continuous flight.
          </p>
        </div>

        <button
          onClick={() => resetOrbit()}
          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs rounded-xl border border-stone-800 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-launch Satellite
        </button>
      </div>

      {/* Physics Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-950 shadow-inner bg-[#060a08]">
        <canvas
          ref={canvasRef}
          width={480}
          height={260}
          className="w-full h-56 block"
        />

        {orbitStatus === 'crashed' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
            <span className="text-rose-400 font-bold text-sm">Collided With Anchor!</span>
            <p className="text-xs text-stone-300 mt-1">Lateral velocity was too sluggish to avoid gravitational collapse.</p>
            <button
              onClick={() => {
                setVelocity(4.4);
                resetOrbit(4.4);
              }}
              className="mt-3 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs rounded-xl"
            >
              Add Velocity & Re-orbit
            </button>
          </div>
        )}

        {orbitStatus === 'escaped' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
            <span className="text-amber-400 font-bold text-sm">Flung Into Deep Space!</span>
            <p className="text-xs text-stone-300 mt-1">Velocity exceeded escape velocity without sufficient gravitational anchor.</p>
            <button
              onClick={() => {
                setVelocity(3.8);
                resetOrbit(3.8);
              }}
              className="mt-3 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs rounded-xl"
            >
              Tune Parameters & Try Again
            </button>
          </div>
        )}

        <div className="absolute bottom-2 left-3 text-[11px] font-mono text-emerald-400">
          Revolutions: <strong className="text-white">{successfulOrbits}</strong>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-[#121c17] p-3 rounded-xl border border-emerald-950 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-stone-300 font-medium">Forward Momentum (Velocity)</span>
            <span className="font-mono text-sky-400 font-bold">{velocity.toFixed(1)} km/s</span>
          </div>
          <input
            type="range"
            min="2.0"
            max="6.5"
            step="0.1"
            value={velocity}
            onChange={e => {
              const val = Number(e.target.value);
              setVelocity(val);
              resetOrbit(val);
            }}
            className="w-full accent-sky-500 cursor-pointer"
          />
        </div>

        <div className="bg-[#121c17] p-3 rounded-xl border border-emerald-950 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-stone-300 font-medium">Gravitational Center Mass</span>
            <span className="font-mono text-amber-400 font-bold">{gravityMass} G</span>
          </div>
          <input
            type="range"
            min="25"
            max="95"
            step="1"
            value={gravityMass}
            onChange={e => {
              const val = Number(e.target.value);
              setGravityMass(val);
              resetOrbit(velocity, val);
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* The Core Lesson */}
      <div className="bg-[#14221a] p-3.5 rounded-2xl border border-emerald-800/60 text-xs space-y-1">
        <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
          Physics & Philosophical Lesson:
        </span>
        <p className="text-stone-200 leading-relaxed">
          An orbit is not a rigid support beam; it is <em>continuous freefall</em> where forward speed exactly offsets gravitational pull.
          In life, true balance is never static hibernation—it is active, dynamic forward action continuously grounded by your deepest values.
        </p>
      </div>

      <button
        onClick={onFinishLesson}
        disabled={successfulOrbits < 2}
        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:pointer-events-none text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
      >
        <CheckCircle2 className="w-4 h-4" />
        {successfulOrbits < 2 ? 'Achieve at least 2 stable orbital laps' : 'Integrate Dynamic Balance (+50 XP)'}
      </button>
    </div>
  );
};
