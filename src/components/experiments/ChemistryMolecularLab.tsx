import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Flame, Droplets, Info } from 'lucide-react';

interface ChemicalReaction {
  id: string;
  name: string;
  equation: string;
  type: 'acid-base' | 'precipitation' | 'exothermic-redox';
  colorA: string;
  colorB: string;
  productColor: string;
  deltaH: number; // kJ/mol (negative is exothermic)
  description: string;
}

const REACTIONS: ChemicalReaction[] = [
  {
    id: 'acid-base-neutralization',
    name: 'Hydrochloric Acid + Sodium Hydroxide',
    equation: 'HCl (aq) + NaOH (aq) ➔ NaCl (aq) + H2O (l) + ΔH',
    type: 'acid-base',
    colorA: '#ef4444', // Red acidic
    colorB: '#3b82f6', // Blue basic
    productColor: '#10b981', // Neutral green
    deltaH: -57.1,
    description: 'Enthalpy of neutralization releasing heat as hydronium and hydroxide ions combine into water.',
  },
  {
    id: 'lead-iodide-precipitate',
    name: 'Golden Rain Precipitation',
    equation: 'Pb(NO3)2 (aq) + 2 KI (aq) ➔ PbI2 (s)↓ + 2 KNO3 (aq)',
    type: 'precipitation',
    colorA: '#e2e8f0', // Clear colorless
    colorB: '#e2e8f0', // Clear colorless
    productColor: '#facc15', // Golden crystalline yellow precipitate
    deltaH: -42.0,
    description: 'Spontaneous insoluble yellow lead iodide crystals precipitate out of clear aqueous solutions.',
  },
  {
    id: 'copper-sulfate-zinc',
    name: 'Single Displacement Redox',
    equation: 'Zn (s) + CuSO4 (aq) ➔ ZnSO4 (aq) + Cu (s)↓',
    type: 'exothermic-redox',
    colorA: '#38bdf8', // Deep blue cupric ions
    colorB: '#94a3b8', // Metallic zinc
    productColor: '#b45309', // Reddish elemental copper precipitate
    deltaH: -218.0,
    description: 'Electrochemical displacement releasing elemental copper and substantial thermal energy.',
  },
];

export const ChemistryMolecularLab: React.FC = () => {
  const [selectedReaction, setSelectedReaction] = useState<ChemicalReaction>(REACTIONS[0]);
  const [mixProgress, setMixProgress] = useState<number>(0); // 0 to 1
  const [beakerTempC, setBeakerTempC] = useState<number>(22.0); // ambient
  const [concentrationMolar, setConcentrationMolar] = useState<number>(1.0); // 0.1 to 3.0 M

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calorimetry: Delta T = (-deltaH * moles) / (mass * specific_heat)
  const moles = concentrationMolar * 0.05; // 50 mL solution
  const heatJoules = -selectedReaction.deltaH * 1000 * moles * mixProgress;
  const deltaT = heatJoules / (100 * 4.184); // 100g water, 4.184 J/g°C
  const currentTemp = 22.0 + deltaT;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let bubblePhase = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      bubblePhase += 0.05;

      const width = canvas.width;
      const height = canvas.height;
      ctx.fillStyle = '#0a120e';
      ctx.fillRect(0, 0, width, height);

      // Glass Beaker Outline
      const beakerX = width / 2 - 80;
      const beakerY = 50;
      const beakerW = 160;
      const beakerH = 180;

      // Beaker glass wall
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(beakerX, beakerY);
      ctx.lineTo(beakerX, beakerY + beakerH);
      ctx.lineTo(beakerX + beakerW, beakerY + beakerH);
      ctx.lineTo(beakerX + beakerW, beakerY);
      ctx.stroke();

      // Measurement graduation marks
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      for (let y = beakerY + 30; y < beakerY + beakerH; y += 30) {
        ctx.beginPath();
        ctx.moveTo(beakerX + 5, y);
        ctx.lineTo(beakerX + 25, y);
        ctx.stroke();
      }

      // Liquid Solution Fill
      const liquidH = (beakerH - 30) * Math.min(1.0, 0.4 + mixProgress * 0.5);
      const liquidY = beakerY + beakerH - liquidH;

      // Color interpolation from Reactant A/B to Product
      ctx.fillStyle = mixProgress < 0.2 ? selectedReaction.colorA : selectedReaction.productColor;
      ctx.globalAlpha = 0.75;
      ctx.fillRect(beakerX + 3, liquidY, beakerW - 6, liquidH - 3);
      ctx.globalAlpha = 1.0;

      // Reaction Bubbles / Precipitate flakes if active
      if (mixProgress > 0.3) {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 20; i++) {
          const bx = beakerX + 15 + ((i * 37) % (beakerW - 30));
          const by = liquidY + ((i * 43 + bubblePhase * 30) % liquidH);
          ctx.beginPath();
          ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Thermometer dipped in beaker
      const thX = beakerX + beakerW - 30;
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(thX, 30, 8, beakerH);
      // Mercury/Alcohol column
      const mercuryH = Math.min(beakerH - 10, (currentTemp / 90) * (beakerH - 20));
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(thX + 1, 30 + beakerH - mercuryH, 6, mercuryH);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mixProgress, selectedReaction, currentTemp]);

  return (
    <div className="bg-[#101b15] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950 pb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
            Physical Chemistry & Thermodynamics
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            Stoichiometric Reaction & Calorimetry Bench
          </h3>
          <p className="text-xs text-stone-300">
            Aqueous solution kinetics with thermodynamic enthalpy release $q = m \cdot c \cdot \Delta T$.
          </p>
        </div>

        <button
          onClick={() => setMixProgress(0)}
          className="p-2 rounded-xl bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
          title="Reset Solution"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map(r => (
          <button
            key={r.id}
            onClick={() => {
              setSelectedReaction(r);
              setMixProgress(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
              selectedReaction.id === r.id
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                : 'bg-stone-900 border-stone-800 text-stone-400'
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/50 bg-[#060d09]">
        <canvas ref={canvasRef} width={640} height={260} className="w-full h-64 block" />
      </div>

      {/* Numerical Data */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Chemical Equation:</span>
          <p className="text-[11px] font-bold text-emerald-400 font-mono truncate">
            {selectedReaction.equation}
          </p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Enthalpy ($\Delta H^\circ$):</span>
          <p className="text-base font-bold text-rose-400 font-mono">
            {selectedReaction.deltaH} kJ/mol
          </p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Beaker Temperature:</span>
          <p className="text-base font-bold text-amber-400 font-mono">
            {currentTemp.toFixed(1)}°C
          </p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Reactant Molarity:</span>
          <p className="text-base font-bold text-sky-400 font-mono">
            {concentrationMolar.toFixed(1)} M
          </p>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
        <div className="space-y-1.5">
          <div className="flex justify-between text-stone-300">
            <span>Reagent Addition / Mixing Progress:</span>
            <span className="text-emerald-400 font-mono font-bold">
              {(mixProgress * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={mixProgress}
            onChange={e => setMixProgress(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-stone-300">
            <span>Solute Concentration:</span>
            <span className="text-sky-400 font-mono font-bold">
              {concentrationMolar.toFixed(1)} M
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={concentrationMolar}
            onChange={e => setConcentrationMolar(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>
      </div>
    </div>
  );
};
