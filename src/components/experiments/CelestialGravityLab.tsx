import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Compass, Globe, Sparkles, Sliders } from 'lucide-react';

interface CelestialBody {
  id: string;
  name: string;
  mass: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  trail: { x: number; y: number }[];
}

export const CelestialGravityLab: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [scenario, setScenario] = useState<'sun-earth-moon' | 'figure-eight-three-body' | 'binary-star'>('sun-earth-moon');
  const [timeWarp, setTimeWarp] = useState<number>(1.0);
  const [gravitationalConstant, setGravitationalConstant] = useState<number>(1.2);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bodiesRef = useRef<CelestialBody[]>([]);

  const initScenario = (scen: 'sun-earth-moon' | 'figure-eight-three-body' | 'binary-star') => {
    if (scen === 'sun-earth-moon') {
      bodiesRef.current = [
        {
          id: 'sun',
          name: 'Central Star',
          mass: 8000,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          radius: 14,
          color: '#fbbf24',
          trail: [],
        },
        {
          id: 'earth',
          name: 'Planet',
          mass: 50,
          x: 180,
          y: 0,
          vx: 0,
          vy: 7.2,
          radius: 6,
          color: '#38bdf8',
          trail: [],
        },
        {
          id: 'moon',
          name: 'Satellite',
          mass: 1,
          x: 202,
          y: 0,
          vx: 0,
          vy: 9.3,
          radius: 3,
          color: '#e2e8f0',
          trail: [],
        },
      ];
    } else if (scen === 'figure-eight-three-body') {
      // Periodic figure-8 3-body solution (Chenciner & Montgomery, 2000)
      const m = 800;
      const x1 = -120;
      const y1 = 0;
      const vx3 = -2 * -1.8;
      const vy3 = -2 * -1.5;

      bodiesRef.current = [
        {
          id: 'body1',
          name: 'Body Alpha',
          mass: m,
          x: -120,
          y: 0,
          vx: 1.8,
          vy: 1.5,
          radius: 7,
          color: '#f43f5e',
          trail: [],
        },
        {
          id: 'body2',
          name: 'Body Beta',
          mass: m,
          x: 120,
          y: 0,
          vx: 1.8,
          vy: 1.5,
          radius: 7,
          color: '#38bdf8',
          trail: [],
        },
        {
          id: 'body3',
          name: 'Body Gamma',
          mass: m,
          x: 0,
          y: 0,
          vx: -3.6,
          vy: -3.0,
          radius: 7,
          color: '#34d399',
          trail: [],
        },
      ];
    } else if (scen === 'binary-star') {
      bodiesRef.current = [
        {
          id: 'star1',
          name: 'Star Alpha',
          mass: 4000,
          x: -70,
          y: 0,
          vx: 0,
          vy: -4.5,
          radius: 10,
          color: '#f97316',
          trail: [],
        },
        {
          id: 'star2',
          name: 'Star Beta',
          mass: 4000,
          x: 70,
          y: 0,
          vx: 0,
          vy: 4.5,
          radius: 10,
          color: '#38bdf8',
          trail: [],
        },
        {
          id: 'circumbinary',
          name: 'Exoplanet',
          mass: 1,
          x: 220,
          y: 0,
          vx: 0,
          vy: 6.8,
          radius: 4,
          color: '#a7f3d0',
          trail: [],
        },
      ];
    }
  };

  useEffect(() => {
    initScenario(scenario);
  }, [scenario]);

  // Numerical Verlet / Euler-Cromer Symplectic Integrator Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#060d09';
      ctx.fillRect(0, 0, width, height);

      // Starfield dots
      ctx.fillStyle = '#1e3827';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 123) % width);
        const sy = ((i * 321) % height);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      const bodies = bodiesRef.current;
      const dt = 0.04 * timeWarp;
      const G = gravitationalConstant;

      if (isRunning) {
        // Calculate pair-wise gravitational forces: F = G * m1 * m2 / (r^2 + eps)
        const eps = 40; // Softening parameter to prevent infinite velocity at singularity

        for (let i = 0; i < bodies.length; i++) {
          let ax = 0;
          let ay = 0;
          for (let j = 0; j < bodies.length; j++) {
            if (i === j) continue;
            const dx = bodies[j].x - bodies[i].x;
            const dy = bodies[j].y - bodies[i].y;
            const distSq = dx * dx + dy * dy + eps;
            const dist = Math.sqrt(distSq);
            const force = (G * bodies[j].mass) / distSq;
            ax += force * (dx / dist);
            ay += force * (dy / dist);
          }

          // Symplectic Euler step
          bodies[i].vx += ax * dt;
          bodies[i].vy += ay * dt;
        }

        for (let i = 0; i < bodies.length; i++) {
          bodies[i].x += bodies[i].vx * dt;
          bodies[i].y += bodies[i].vy * dt;

          // Append trail
          bodies[i].trail.push({ x: bodies[i].x, y: bodies[i].y });
          if (bodies[i].trail.length > 70) {
            bodies[i].trail.shift();
          }
        }
      }

      // Render Trails & Bodies
      bodies.forEach(body => {
        // Trail
        if (body.trail.length > 1) {
          ctx.strokeStyle = body.color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          body.trail.forEach((p, idx) => {
            const screenX = cx + p.x;
            const screenY = cy + p.y;
            ctx.globalAlpha = idx / body.trail.length;
            if (idx === 0) ctx.moveTo(screenX, screenY);
            else ctx.lineTo(screenX, screenY);
          });
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }

        // Body
        const screenX = cx + body.x;
        const screenY = cy + body.y;

        ctx.fillStyle = body.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, body.radius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#a7f3d0';
        ctx.font = '10px monospace';
        ctx.fillText(body.name, screenX + body.radius + 4, screenY + 3);
      });
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isRunning, timeWarp, gravitationalConstant]);

  return (
    <div className="bg-[#101b15] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950 pb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
            Celestial Mechanics & Astrophysics
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            N-Body Gravitational Orbital Dynamics
          </h3>
          <p className="text-xs text-stone-300">
            Real-time orbital integration via Newton's law of universal gravitation with softening parameter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-colors ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Freeze Time' : 'Resume Orbits'}</span>
          </button>
          <button
            onClick={() => initScenario(scenario)}
            className="p-2 rounded-xl bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
            title="Reset Positions"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orbit Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/50 bg-[#060d09]">
        <canvas ref={canvasRef} width={640} height={280} className="w-full h-72 block" />
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button
            onClick={() => setScenario('sun-earth-moon')}
            className={`px-2.5 py-1 rounded-lg text-[10px] border ${
              scenario === 'sun-earth-moon'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                : 'bg-stone-900 border-stone-800 text-stone-400'
            }`}
          >
            Sun-Planet-Moon
          </button>
          <button
            onClick={() => setScenario('binary-star')}
            className={`px-2.5 py-1 rounded-lg text-[10px] border ${
              scenario === 'binary-star'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                : 'bg-stone-900 border-stone-800 text-stone-400'
            }`}
          >
            Binary Stars
          </button>
          <button
            onClick={() => setScenario('figure-eight-three-body')}
            className={`px-2.5 py-1 rounded-lg text-[10px] border ${
              scenario === 'figure-eight-three-body'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                : 'bg-stone-900 border-stone-800 text-stone-400'
            }`}
          >
            Figure-8 3-Body
          </button>
        </div>
      </div>

      {/* Dynamic Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
        <div className="space-y-1.5">
          <div className="flex justify-between text-stone-300">
            <span>Simulation Time Warp:</span>
            <span className="text-emerald-400 font-mono font-bold">{timeWarp.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={timeWarp}
            onChange={e => setTimeWarp(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-stone-300">
            <span>Gravitational Strength (G):</span>
            <span className="text-sky-400 font-mono font-bold">{gravitationalConstant.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={gravitationalConstant}
            onChange={e => setGravitationalConstant(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>
      </div>
    </div>
  );
};
