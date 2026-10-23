import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  Sliders,
  Share2,
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { SimulatorItem } from '../types/simulator';
import { evaluateSimulationModel, EvaluationResult } from '../utils/simulationEvaluator';
import { useApp } from '../context/AppContext';

interface SimulatorPlayerModalProps {
  simulator: SimulatorItem;
  onClose: () => void;
  onCompleted: (xpEarned: number) => void;
}

export const SimulatorPlayerModal: React.FC<SimulatorPlayerModalProps> = ({
  simulator,
  onClose,
  onCompleted
}) => {
  const { showToast } = useApp();
  // State for variables
  const [variableValues, setVariableValues] = useState<{ [key: string]: number }>(() => {
    const init: { [key: string]: number } = {};
    simulator.variables.forEach(v => {
      init[v.id] = v.defaultValue;
    });
    return init;
  });

  const [evaluation, setEvaluation] = useState<EvaluationResult>(() =>
    evaluateSimulationModel(simulator, variableValues)
  );

  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [reflectionNotes, setReflectionNotes] = useState('');

  // Re-evaluate on variable change
  useEffect(() => {
    const res = evaluateSimulationModel(simulator, variableValues);
    setEvaluation(res);
  }, [variableValues, simulator]);

  const handleSliderChange = (varId: string, val: number) => {
    setVariableValues(prev => ({ ...prev, [varId]: val }));
    setHasInteracted(true);
  };

  const resetVariables = () => {
    const init: { [key: string]: number } = {};
    simulator.variables.forEach(v => {
      init[v.id] = v.defaultValue;
    });
    setVariableValues(init);
  };

  const handleFinishSimulation = () => {
    setIsFinished(true);
    onCompleted(simulator.xpReward);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto relative max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-950/70 bg-[#0c130f]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              {simulator.domain.replace('-', ' ')}
            </span>
            <span className="text-xs text-stone-300">
              {simulator.durationMinutes} min • +{simulator.xpReward} XP
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={resetVariables}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors"
              title="Reset parameters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll Content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5">
          {isFinished ? (
            /* Completed Insight Screen */
            <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-900/40 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-xl shadow-emerald-950">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif font-semibold text-white">Lesson Integrated</h3>
                <p className="text-sm text-emerald-300 font-medium">+{simulator.xpReward} XP awarded for wisdom</p>
              </div>

              {/* Core Real-World Lesson Card */}
              <div className="bg-[#14221a] p-4 rounded-2xl border border-emerald-800/60 text-left max-w-md w-full space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>The Fundamental Truth:</span>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed font-serif text-sm">
                  "{simulator.coreLesson}"
                </p>
                <p className="text-[11px] text-stone-300 italic pt-1 border-t border-emerald-950/60">
                  {simulator.philosophicalContext}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 w-full max-w-md">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-all shadow-lg"
                >
                  Return to Simulators
                </button>
                <button
                  onClick={() => setIsFinished(false)}
                  className="px-4 py-3 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs rounded-xl border border-stone-800 transition-colors"
                >
                  Explore More Scenarios
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Titles */}
              <div className="space-y-1">
                <h2 className="text-2xl font-serif font-semibold text-white tracking-tight">
                  {simulator.title}
                </h2>
                <p className="text-xs text-stone-300">{simulator.subtitle}</p>
              </div>

              {/* Educational Lesson Header Card */}
              <div className="bg-gradient-to-r from-[#14231a] to-[#0f1d16] p-3.5 rounded-2xl border border-emerald-900/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-400 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                    Core Teaching to Unpack:
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    {simulator.coreLesson}
                  </p>
                </div>
              </div>

              {/* Dynamic Real-Time Simulation Feedback Panel */}
              <div className="bg-[#0c140f] border border-emerald-950/80 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    Emergent System Metrics
                  </span>
                  <span className="text-[11px] text-stone-400 italic">Live dynamic modeling</span>
                </div>

                {/* Metric Gauges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(evaluation.metrics).map(([key, val]) => {
                    const label = simulator.metricLabels[key] || key;
                    const isHigh = val >= 70;
                    return (
                      <div
                        key={key}
                        className="bg-[#121c17] p-3 rounded-xl border border-emerald-950/60 space-y-1.5"
                      >
                        <div className="flex justify-between text-[11px]">
                          <span className="text-stone-300">{label}</span>
                          <span className={`font-mono font-bold ${isHigh ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {val}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-stone-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              isHigh ? 'bg-gradient-to-r from-emerald-600 to-teal-400' : 'bg-gradient-to-r from-amber-600 to-orange-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, val))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Real-time Status / Lesson Insight */}
                <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-xs text-stone-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-stone-100">{evaluation.statusNote}</strong>{' '}
                    <span className="text-stone-400 block pt-0.5">{evaluation.lessonInsight}</span>
                  </p>
                </div>
              </div>

              {/* Interactive Control Levers */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Adjust Variables & Observe Consequences:
                  </h4>
                  <span className="text-[10px] text-stone-400">Drag sliders to test extremes</span>
                </div>

                <div className="space-y-3">
                  {simulator.variables.map(variable => {
                    const currentVal = variableValues[variable.id] ?? variable.defaultValue;
                    return (
                      <div
                        key={variable.id}
                        className="bg-[#131d18] border border-emerald-950/60 p-3.5 rounded-2xl space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-medium text-stone-200">{variable.name}</span>
                            <p className="text-[11px] text-stone-400">{variable.description}</p>
                          </div>
                          <span className="font-mono text-emerald-300 font-bold ml-2 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                            {currentVal} {variable.unit || ''}
                          </span>
                        </div>

                        <input
                          type="range"
                          min={variable.min}
                          max={variable.max}
                          step={variable.step}
                          value={currentVal}
                          onChange={e => handleSliderChange(variable.id, Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Complete & Cement Lesson */}
              <div className="pt-2">
                <button
                  onClick={handleFinishSimulation}
                  className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/60"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  I Have Extracted The Lesson (+{simulator.xpReward} XP)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
