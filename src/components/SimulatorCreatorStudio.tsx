import React, { useState } from 'react';
import {
  Wand2,
  Sliders,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  Check,
  RotateCcw,
  Info
} from 'lucide-react';
import { SimulatorItem, SimulatorDomain, SimulatorVariable } from '../types/simulator';

interface SimulatorCreatorStudioProps {
  onSaveNewSimulator: (sim: SimulatorItem) => void;
  onCancel: () => void;
}

export const SimulatorCreatorStudio: React.FC<SimulatorCreatorStudioProps> = ({
  onSaveNewSimulator,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<SimulatorDomain>('human-psychology');
  const [subtitle, setSubtitle] = useState('');
  const [coreLesson, setCoreLesson] = useState('');
  const [philosophicalContext, setPhilosophicalContext] = useState('');

  // Customizable variables
  const [variables, setVariables] = useState<SimulatorVariable[]>([
    {
      id: 'var_primary',
      name: 'Deliberate Effort',
      min: 0,
      max: 100,
      step: 5,
      defaultValue: 60,
      unit: '%',
      description: 'Conscious application of mindful intention'
    },
    {
      id: 'var_friction',
      name: 'Environmental Noise / Temptation',
      min: 0,
      max: 100,
      step: 5,
      defaultValue: 30,
      unit: '%',
      description: 'Superficial digital noise and peer distractions'
    }
  ]);

  // Metric labels
  const [metric1, setMetric1] = useState('Inner Harmony');
  const [metric2, setMetric2] = useState('Resilience to Crisis');
  const [metric3, setMetric3] = useState('Wisdom Yield');

  const addVariable = () => {
    if (variables.length >= 4) return;
    const newId = `var_${Date.now()}`;
    setVariables(prev => [
      ...prev,
      {
        id: newId,
        name: `Dynamic Factor ${prev.length + 1}`,
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 50,
        unit: '%',
        description: 'New customizable parameter'
      }
    ]);
  };

  const removeVariable = (idx: number) => {
    if (variables.length <= 1) return;
    setVariables(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coreLesson.trim()) return;

    const newSim: SimulatorItem = {
      id: `custom_sim_${Date.now()}`,
      title: title.trim(),
      domain,
      engineType: 'interactive-slider-system',
      durationMinutes: 4,
      xpReward: 50,
      subtitle: subtitle.trim() || 'A custom behavioral simulation crafted in Alivane Studio.',
      coreLesson: coreLesson.trim(),
      philosophicalContext: philosophicalContext.trim() || 'Designed to give deep practical wisdom rather than passive entertainment.',
      variables,
      initialMetrics: {
        metricOne: 75,
        metricTwo: 70,
        metricThree: 80
      },
      metricLabels: {
        metricOne: metric1 || 'Primary Harmony',
        metricTwo: metric2 || 'Systemic Resilience',
        metricThree: metric3 || 'Wisdom Yield'
      },
      evaluatorFnKey: 'general-dynamic',
      creator: 'You (Creator Studio)',
      isCustomCreated: true,
      timesCompleted: 1
    };

    onSaveNewSimulator(newSim);
  };

  return (
    <div className="bg-[#121c17] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-emerald-950/70 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-300">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-white">Create a Lesson-Driven Simulator</h2>
            <p className="text-xs text-stone-300">
              Build an interactive mathematical model that teaches a valuable human insight.
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleCreate} className="space-y-4 text-xs">
        {/* Title & Domain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-stone-300 font-medium">Simulator Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., The Feedback Loop of Creative Flow"
              className="w-full bg-[#0d1410] border border-emerald-950 rounded-xl p-2.5 text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-stone-300 font-medium">Wisdom Domain *</label>
            <select
              value={domain}
              onChange={e => setDomain(e.target.value as any)}
              className="w-full bg-[#0d1410] border border-emerald-950 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-emerald-500 capitalize"
            >
              <option value="human-psychology">Human Psychology</option>
              <option value="systems-ecology">Systems Ecology</option>
              <option value="game-theory">Game Theory & Trust</option>
              <option value="physics-cosmos">Physics & Cosmos</option>
              <option value="mindful-habits">Mindful Habits</option>
              <option value="finance-patience">Finance & Patience</option>
              <option value="philosophy-ethics">Philosophy & Ethics</option>
              <option value="social-dynamics">Social Dynamics</option>
            </select>
          </div>
        </div>

        {/* Subtitle */}
        <div className="space-y-1">
          <label className="text-stone-300 font-medium">Short Context</label>
          <input
            type="text"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            placeholder="e.g., How protecting quiet mornings unlocks nonlinear compounding breakthroughs."
            className="w-full bg-[#0d1410] border border-emerald-950 rounded-xl p-2.5 text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* The Mandatory Core Lesson */}
        <div className="space-y-1 bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-900/40">
          <label className="text-emerald-300 font-semibold flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            The Core Real-World Lesson (What should the user walk away learning?) *
          </label>
          <textarea
            required
            rows={2}
            value={coreLesson}
            onChange={e => setCoreLesson(e.target.value)}
            placeholder="e.g., When you sacrifice slow foundational mastery for quick applause, the architecture inevitably fractures under stress."
            className="w-full bg-[#0b130f] border border-emerald-950 rounded-xl p-2.5 text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-emerald-500 resize-none mt-1"
          />
        </div>

        {/* Philosophical context */}
        <div className="space-y-1">
          <label className="text-stone-300 font-medium">Philosophical / Scientific Attribution</label>
          <input
            type="text"
            value={philosophicalContext}
            onChange={e => setPhilosophicalContext(e.target.value)}
            placeholder="e.g., Rooted in Marcus Aurelius’s Meditations and dynamic systems feedback."
            className="w-full bg-[#0d1410] border border-emerald-950 rounded-xl p-2.5 text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Interactive Variables Builder */}
        <div className="space-y-2 pt-2 border-t border-emerald-950/60">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-emerald-400 uppercase tracking-wider">
              Simulation Levers ({variables.length}/4):
            </span>
            {variables.length < 4 && (
              <button
                type="button"
                onClick={addVariable}
                className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 px-2 py-1 rounded-lg bg-emerald-950 border border-emerald-800/60"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Lever
              </button>
            )}
          </div>

          <div className="space-y-2">
            {variables.map((v, idx) => (
              <div
                key={v.id}
                className="bg-[#0e1612] border border-emerald-950 p-3 rounded-xl flex items-center gap-3"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={v.name}
                      onChange={e => {
                        const newName = e.target.value;
                        setVariables(prev =>
                          prev.map((item, i) => (i === idx ? { ...item, name: newName } : item))
                        );
                      }}
                      placeholder="Lever name"
                      className="flex-1 bg-[#131d18] border border-emerald-950 rounded-lg px-2.5 py-1 text-stone-200"
                    />
                    <input
                      type="text"
                      value={v.unit || '%'}
                      onChange={e => {
                        const newUnit = e.target.value;
                        setVariables(prev =>
                          prev.map((item, i) => (i === idx ? { ...item, unit: newUnit } : item))
                        );
                      }}
                      placeholder="Unit"
                      className="w-16 bg-[#131d18] border border-emerald-950 rounded-lg px-2 py-1 text-stone-200 text-center font-mono"
                    />
                  </div>
                  <input
                    type="text"
                    value={v.description}
                    onChange={e => {
                      const newDesc = e.target.value;
                      setVariables(prev =>
                        prev.map((item, i) => (i === idx ? { ...item, description: newDesc } : item))
                      );
                    }}
                    placeholder="Short description of what adjusting this does"
                    className="w-full bg-[#131d18] border border-emerald-950 rounded-lg px-2.5 py-1 text-stone-400 text-[11px]"
                  />
                </div>

                {variables.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariable(idx)}
                    className="p-2 text-stone-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Emergent Metric Gauges */}
        <div className="space-y-2 pt-2 border-t border-emerald-950/60">
          <span className="font-semibold text-emerald-400 uppercase tracking-wider block">
            System Outcome Metrics:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={metric1}
              onChange={e => setMetric1(e.target.value)}
              placeholder="Metric 1"
              className="bg-[#0e1612] border border-emerald-950 rounded-xl p-2 text-stone-200"
            />
            <input
              type="text"
              value={metric2}
              onChange={e => setMetric2(e.target.value)}
              placeholder="Metric 2"
              className="bg-[#0e1612] border border-emerald-950 rounded-xl p-2 text-stone-200"
            />
            <input
              type="text"
              value={metric3}
              onChange={e => setMetric3(e.target.value)}
              placeholder="Metric 3"
              className="bg-[#0e1612] border border-emerald-950 rounded-xl p-2 text-stone-200"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3">
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/60"
          >
            <Check className="w-4 h-4" />
            Publish Simulator to Alivane Library (+50 Creator XP)
          </button>
        </div>
      </form>
    </div>
  );
};
