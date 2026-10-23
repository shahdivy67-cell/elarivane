import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Compass,
  Sparkles,
  Zap,
  Activity,
  Atom,
  Eye,
  Radio,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { LabType, LabDefinition } from '../types/experiments';
import { EcEngineeringLab } from './experiments/EcEngineeringLab';
import { PhysicsOpticsLab } from './experiments/PhysicsOpticsLab';

const LABS_DIRECTORY: LabDefinition[] = [
  {
    id: 'ec-lab',
    title: 'Electronics & Communication (EC) Lab',
    subtitle: '3D Breadboard, MNA Circuit Solver & CRT Oscilloscope',
    category: 'Engineering & Circuits',
    description: 'Construct circuits on a solderless breadboard. Connect active semiconductors, diodes, LEDs, and power supplies. Calculate node voltages via deterministic Modified Nodal Analysis with material resistance.',
    badge: '3D Virtual Lab',
    iconName: 'Cpu',
  },
  {
    id: 'optics-lab',
    title: 'Physics & Optics Laboratory',
    subtitle: 'Thin-Lens Ray Tracing, Focal Dispersion & Gaussian Optics',
    category: 'Physical Sciences',
    description: 'Simulate convex/concave lens refraction, real vs virtual inverted focal planes, and optical ray tracing according to verified Gaussian lens models.',
    badge: 'Ray Tracer',
    iconName: 'Eye',
  },
  {
    id: 'acoustics-lab',
    title: 'Acoustics & Wave Resonance Lab',
    subtitle: 'Harmonic Standing Waves & Chladni Nodal Plates',
    category: 'Wave Mechanics',
    description: 'Explore resonant frequencies, audio wavelength dispersion, and constructive/destructive interference in localized wave chambers.',
    badge: 'Wave Mechanics',
    iconName: 'Radio',
  },
  {
    id: 'astronomy-lab',
    title: 'Celestial Mechanics & Gravity Lab',
    subtitle: 'N-Body Keplerian Orbit Integration & Lagrange Points',
    category: 'Cosmology & Orbital Mechanics',
    description: 'Simulate gravitational multi-body interactions with Euler-Cromer orbital mechanics and escape velocities.',
    badge: 'Orbital Solver',
    iconName: 'Compass',
  },
];

export const ExperimentsScreen: React.FC = () => {
  const [activeLab, setActiveLab] = useState<LabType>('ec-lab');

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4 md:pt-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold font-mono">
            Scientific Experiments Hub
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1">
          Virtual Laboratories & Simulations
        </h1>
        <p className="text-xs md:text-sm text-stone-300 mt-1 max-w-2xl">
          Construct real physical circuits, manipulate materials, inspect waveforms, and run deterministic experiments without any cloud or AI dependency.
        </p>
      </div>

      {/* Lab Selection Navigator Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {LABS_DIRECTORY.map(lab => (
          <button
            key={lab.id}
            onClick={() => setActiveLab(lab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeLab === lab.id
                ? 'bg-emerald-900/80 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-950/40'
                : 'bg-[#101914] border-emerald-950 text-stone-400 hover:text-stone-200'
            }`}
          >
            {lab.id === 'ec-lab' && <Cpu className="w-4 h-4 text-emerald-400" />}
            {lab.id === 'optics-lab' && <Eye className="w-4 h-4 text-sky-400" />}
            {lab.id === 'acoustics-lab' && <Radio className="w-4 h-4 text-amber-400" />}
            {lab.id === 'astronomy-lab' && <Compass className="w-4 h-4 text-purple-400" />}
            <span>{lab.title}</span>
          </button>
        ))}
      </div>

      {/* Active Lab Environment */}
      {activeLab === 'ec-lab' && <EcEngineeringLab />}

      {activeLab === 'optics-lab' && <PhysicsOpticsLab />}

      {activeLab === 'acoustics-lab' && (
        <div className="bg-[#101b15] border border-emerald-900/60 rounded-3xl p-6 text-center space-y-3">
          <Radio className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-white">Acoustic Resonance Chamber</h3>
          <p className="text-xs text-stone-300 max-w-md mx-auto">
            Interactive standing wave node builder with harmonic frequency audio synthesizer. Switch to the 3D Electronics Lab or Optics Bench to explore verified mathematical solvers.
          </p>
          <button
            onClick={() => setActiveLab('ec-lab')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            Launch 3D EC Laboratory
          </button>
        </div>
      )}

      {activeLab === 'astronomy-lab' && (
        <div className="bg-[#101b15] border border-emerald-900/60 rounded-3xl p-6 text-center space-y-3">
          <Compass className="w-10 h-10 text-purple-400 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-white">Keplerian Orbital Dynamics</h3>
          <p className="text-xs text-stone-300 max-w-md mx-auto">
            N-body gravitation simulation integrated via Verlet algorithm. Calculate orbital velocities, eccentricity, and perihelion points.
          </p>
          <button
            onClick={() => setActiveLab('ec-lab')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            Launch 3D EC Laboratory
          </button>
        </div>
      )}
    </div>
  );
};
