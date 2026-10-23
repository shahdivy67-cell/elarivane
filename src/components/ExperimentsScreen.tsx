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
import { AcousticsResonanceLab } from './experiments/AcousticsResonanceLab';
import { CelestialGravityLab } from './experiments/CelestialGravityLab';
import { MechanicalRoboticsLab } from './experiments/MechanicalRoboticsLab';
import { ChemistryMolecularLab } from './experiments/ChemistryMolecularLab';

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
    description: 'Explore resonant frequencies, audio wavelength dispersion, and constructive/destructive interference in localized wave chambers with live Web Audio tone generation.',
    badge: 'Wave Mechanics',
    iconName: 'Radio',
  },
  {
    id: 'astronomy-lab',
    title: 'Celestial Mechanics & Gravity Lab',
    subtitle: 'N-Body Keplerian Orbit Integration & Lagrange Points',
    category: 'Cosmology & Orbital Mechanics',
    description: 'Simulate gravitational multi-body interactions with Euler-Cromer orbital mechanics, softening parameters, and binary star systems.',
    badge: 'Orbital Solver',
    iconName: 'Compass',
  },
  {
    id: 'mechanical-lab',
    title: 'Mechanical Engineering & Robotics',
    subtitle: '2-DOF Robotic Arm Kinematics & Gear Torque Mesh',
    category: 'Mechanics & Robotics',
    description: 'Forward kinematics planar manipulator paired with gear ratio mechanical reduction and motor torque dissipation calculations.',
    badge: 'Kinematics',
    iconName: 'Layers',
  },
  {
    id: 'chemistry-lab',
    title: 'Physical Chemistry & Calorimetry Lab',
    subtitle: 'Stoichiometric Aqueous Reactions & Enthalpy of Neutralization',
    category: 'Chemical Sciences',
    description: 'Explore aqueous precipitation, displacement redox, and enthalpy of neutralization using thermodynamic calorimetry models.',
    badge: 'Calorimetry',
    iconName: 'Atom',
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
            {lab.id === 'mechanical-lab' && <Layers className="w-4 h-4 text-teal-400" />}
            {lab.id === 'chemistry-lab' && <Atom className="w-4 h-4 text-rose-400" />}
            <span>{lab.title}</span>
          </button>
        ))}
      </div>

      {/* Active Lab Environment */}
      {activeLab === 'ec-lab' && <EcEngineeringLab />}

      {activeLab === 'optics-lab' && <PhysicsOpticsLab />}

      {activeLab === 'acoustics-lab' && <AcousticsResonanceLab />}

      {activeLab === 'astronomy-lab' && <CelestialGravityLab />}

      {activeLab === 'mechanical-lab' && <MechanicalRoboticsLab />}

      {activeLab === 'chemistry-lab' && <ChemistryMolecularLab />}
    </div>
  );
};
