import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Plus,
  Trash2,
  Cpu,
  Layers,
  Thermometer,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  BookOpen,
} from 'lucide-react';
import { CircuitComponentInstance, WireSpec, WireMaterial, SimulationSample } from '../../types/experiments';
import { MnaCircuitSolver } from '../../simulation/MnaCircuitSolver';
import { PRESET_CIRCUITS, CircuitExperimentPreset } from '../../simulation/presetCircuits';
import { COMPONENT_CATALOG, ComponentTemplate } from '../../simulation/componentCatalog';
import { Breadboard3DCanvas } from './Breadboard3DCanvas';
import { OscilloscopeMonitor } from './OscilloscopeMonitor';
import { MATERIAL_PROPERTIES, calculateWireResistance } from '../../simulation/electricalPhysics';

export const EcEngineeringLab: React.FC = () => {
  // Active circuit state initialized with Ohm's law LED preset
  const [components, setComponents] = useState<CircuitComponentInstance[]>(PRESET_CIRCUITS[0].components);
  const [wires, setWires] = useState<WireSpec[]>(PRESET_CIRCUITS[0].wires);
  const [activePreset, setActivePreset] = useState<CircuitExperimentPreset>(PRESET_CIRCUITS[0]);

  // Solver & Simulation controls
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [ambientTempC, setAmbientTempC] = useState<number>(25);
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [connectingPin, setConnectingPin] = useState<string | null>(null);

  // Oscilloscope live sample buffer
  const [samples, setSamples] = useState<SimulationSample[]>([]);
  const [vDiv, setVDiv] = useState<number>(2.0);
  const [timeDivMs, setTimeDivMs] = useState<number>(5.0);

  // Wire configuration modal/settings
  const [wireMaterial, setWireMaterial] = useState<WireMaterial>('copper');
  const [activeTab, setActiveTab] = useState<'3d-bench' | 'schematic-table' | 'troubleshoot'>('3d-bench');

  const solverRef = useRef<MnaCircuitSolver>(new MnaCircuitSolver(components, wires, ambientTempC));
  const simTimeRef = useRef<number>(0);

  // Sync solver configuration whenever components, wires, or temp changes
  useEffect(() => {
    solverRef.current.setCircuit(components, wires, ambientTempC);
  }, [components, wires, ambientTempC]);

  // Real-time deterministic time-stepping loop (60 FPS)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const dt = 0.0005; // 0.5 ms step
      simTimeRef.current += dt;

      const result = solverRef.current.solveStep(simTimeRef.current, dt);

      // Extract sample voltages for oscilloscope
      let vSource = 0;
      let vOut = 0;
      let currentMa = 0;

      // Find primary power source
      const src = components.find(c => c.typeId === 'dc-source' || c.typeId === 'ac-source');
      if (src) {
        const posPin = `${src.id}:pos`;
        vSource = result.nodeVoltages[posPin] || Number(src.properties.voltage || 5);
        currentMa = Math.abs((result.branchCurrents[src.id] || 0) * 1000);
      }

      // Find load / output node
      const load = components.find(c => c.typeId === 'led' || c.typeId === 'resistor' || c.typeId === 'capacitor');
      if (load) {
        if (load.typeId === 'led') {
          vOut = load.state?.pinVoltages?.anode || 0;
          if (load.state?.currentAmps) {
            currentMa = load.state.currentAmps * 1000;
          }
        } else {
          vOut = load.state?.pinVoltages?.['1'] || 0;
        }
      }

      setSamples(prev => {
        const next = [...prev, { timeMs: simTimeRef.current * 1000, vSource, vOut, currentMa }];
        return next.length > 50 ? next.slice(next.length - 50) : next;
      });

      // Force component re-render with updated calculated states
      setComponents(prev => [...prev]);
    }, 25);

    return () => clearInterval(interval);
  }, [isRunning, components]);

  const handleSelectPreset = (preset: CircuitExperimentPreset) => {
    setActivePreset(preset);
    setComponents(preset.components);
    setWires(preset.wires);
    setSelectedCompId(null);
    setConnectingPin(null);
    solverRef.current.resetTransientState();
    simTimeRef.current = 0;
    setSamples([]);
  };

  const handleAddCatalogComponent = (template: ComponentTemplate) => {
    const newComp: CircuitComponentInstance = {
      id: `${template.typeId}_${Date.now()}`,
      name: template.name,
      typeId: template.typeId,
      category: template.category,
      position: [Math.random() * 4 - 2, 0.5, Math.random() * 2 - 1],
      rotation: [0, 0, 0],
      pins: template.pins,
      properties: { ...template.defaultProperties },
    };
    setComponents(prev => [...prev, newComp]);
    setSelectedCompId(newComp.id);
  };

  const handleDeleteSelectedComponent = () => {
    if (!selectedCompId) return;
    setComponents(prev => prev.filter(c => c.id !== selectedCompId));
    setWires(prev => prev.filter(w => !w.fromPin.startsWith(`${selectedCompId}:`) && !w.toPin.startsWith(`${selectedCompId}:`)));
    setSelectedCompId(null);
  };

  const handlePinClick = (pinKey: string) => {
    if (!connectingPin) {
      setConnectingPin(pinKey);
    } else {
      if (connectingPin !== pinKey) {
        // Complete wire connection
        const newWire: WireSpec = {
          id: `wire_${Date.now()}`,
          fromPin: connectingPin,
          toPin: pinKey,
          material: wireMaterial,
          lengthMeters: 0.15,
          crossSectionMm2: 0.5,
          temperatureC: ambientTempC,
          resistanceOhms: calculateWireResistance(wireMaterial, 0.15, 0.5, ambientTempC),
          color: '#34d399',
        };
        setWires(prev => [...prev, newWire]);
      }
      setConnectingPin(null);
    }
  };

  const selectedComp = components.find(c => c.id === selectedCompId);

  return (
    <div className="space-y-6">
      {/* Experiment Lab Top Bar */}
      <div className="bg-[#101b15] border border-emerald-900/60 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold font-mono">
                Deterministic MNA Simulation Engine
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mt-1">
              3D Electronics & Communication Lab
            </h2>
            <p className="text-xs text-stone-300 max-w-xl">
              Construct physical circuits on an 830-tie-point solderless breadboard. Connect wires with material resistivity, measure Kirchhoff node voltages, and view real-time oscilloscope traces.
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
              <span>{isRunning ? 'Pause Engine' : 'Run Circuit'}</span>
            </button>
            <button
              onClick={() => {
                solverRef.current.resetTransientState();
                simTimeRef.current = 0;
                setSamples([]);
              }}
              className="p-2 rounded-xl bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
              title="Reset Circuit State"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preset Experiments Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-950">
          <span className="text-xs text-stone-300 font-medium">Standard Labs:</span>
          {PRESET_CIRCUITS.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                activePreset.id === p.id
                  ? 'bg-emerald-900 border border-emerald-500 text-emerald-100 shadow'
                  : 'bg-[#121c17] text-stone-400 hover:text-stone-200 border border-emerald-950'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas & Oscilloscope Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Breadboard3DCanvas
            components={components}
            wires={wires}
            selectedCompId={selectedCompId}
            onSelectComponent={setSelectedCompId}
            onPinClick={handlePinClick}
            connectingPin={connectingPin}
          />

          {/* Live Oscilloscope Trace Monitor */}
          <OscilloscopeMonitor
            samples={samples}
            vDiv={vDiv}
            timeDivMs={timeDivMs}
            channel1Name={activePreset.id === 'half-wave-rectifier' ? 'AC Input (50Hz)' : 'DC Supply V'}
            channel2Name={activePreset.id === 'half-wave-rectifier' ? 'Rectified Filtered V' : 'Component V'}
          />
        </div>

        {/* Right Sidebar: Component Properties & Environmental Physics */}
        <div className="space-y-4">
          {/* Temperature & Material Environmental Controller */}
          <div className="bg-[#101914] border border-emerald-950 p-4 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-xs border-b border-emerald-950 pb-2">
              <Thermometer className="w-4 h-4 text-emerald-400" />
              <span>Environmental & Material Physics</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-300">
                <span>Ambient Temp:</span>
                <span className="font-mono text-emerald-400 font-bold">{ambientTempC}°C</span>
              </div>
              <input
                type="range"
                min="-20"
                max="80"
                value={ambientTempC}
                onChange={e => setAmbientTempC(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="text-[10px] text-stone-400">
                Temperature directly modulates semiconductor Vbe threshold (-2mV/°C) and wire resistivity.
              </p>
            </div>

            <div className="space-y-1.5 text-xs pt-1">
              <span className="text-stone-300 block">Jumper Wire Conductor:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['copper', 'aluminium', 'silver'] as WireMaterial[]).map(mat => (
                  <button
                    key={mat}
                    onClick={() => setWireMaterial(mat)}
                    className={`py-1 px-2 rounded-lg text-[11px] capitalize border ${
                      wireMaterial === mat
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                        : 'bg-stone-900 border-stone-800 text-stone-400'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-stone-400">
                Resistivity: {MATERIAL_PROPERTIES[wireMaterial].resistivity.toExponential(2)} Ω·m
              </p>
            </div>
          </div>

          {/* Selected Component Parameter Inspector */}
          <div className="bg-[#101914] border border-emerald-950 p-4 rounded-3xl space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-2">
              <span className="text-xs font-semibold text-white">Component Inspector</span>
              {selectedComp && (
                <button
                  onClick={handleDeleteSelectedComponent}
                  className="text-stone-400 hover:text-rose-400 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>

            {selectedComp ? (
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-semibold text-white">{selectedComp.name}</h4>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                    ID: {selectedComp.id}
                  </span>
                </div>

                {/* Live Calculated Electrical State */}
                {selectedComp.state && (
                  <div className="bg-[#0b130f] p-3 rounded-2xl border border-emerald-950 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                      Calculated MNA Result:
                    </span>
                    {selectedComp.state.currentAmps !== undefined && (
                      <div className="flex justify-between text-stone-300">
                        <span>Current:</span>
                        <span className="font-mono text-emerald-300">
                          {(selectedComp.state.currentAmps * 1000).toFixed(2)} mA
                        </span>
                      </div>
                    )}
                    {selectedComp.state.powerWatts !== undefined && (
                      <div className="flex justify-between text-stone-300">
                        <span>Power Dissipation:</span>
                        <span className="font-mono text-emerald-300">
                          {(selectedComp.state.powerWatts * 1000).toFixed(2)} mW
                        </span>
                      </div>
                    )}
                    {selectedComp.state.temperatureC !== undefined && (
                      <div className="flex justify-between text-stone-300">
                        <span>Component Temp:</span>
                        <span className="font-mono text-amber-300">
                          {selectedComp.state.temperatureC.toFixed(1)}°C
                        </span>
                      </div>
                    )}
                    {selectedComp.state.overload && (
                      <div className="p-2 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-[10px] flex items-center gap-1.5 mt-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{selectedComp.state.faultMessage}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Adjustable Parameters */}
                <div className="space-y-2">
                  {selectedComp.typeId === 'resistor' && (
                    <div className="space-y-1">
                      <label className="text-stone-300">Resistance (Ohms):</label>
                      <input
                        type="number"
                        min="1"
                        max="1000000"
                        value={Number(selectedComp.properties.resistance || 1000)}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setComponents(prev =>
                            prev.map(c =>
                              c.id === selectedComp.id
                                ? { ...c, properties: { ...c.properties, resistance: val } }
                                : c
                            )
                          );
                        }}
                        className="w-full bg-[#0b130f] border border-emerald-950 rounded-xl p-2 text-stone-100 font-mono"
                      />
                    </div>
                  )}

                  {selectedComp.typeId === 'dc-source' && (
                    <div className="space-y-1">
                      <label className="text-stone-300">Supply Voltage (V):</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="30"
                        value={Number(selectedComp.properties.voltage || 5.0)}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setComponents(prev =>
                            prev.map(c =>
                              c.id === selectedComp.id
                                ? { ...c, properties: { ...c.properties, voltage: val } }
                                : c
                            )
                          );
                        }}
                        className="w-full bg-[#0b130f] border border-emerald-950 rounded-xl p-2 text-stone-100 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-300 py-6 text-center italic">
                Select a component in the 3D scene or catalog below to inspect and tweak properties.
              </p>
            )}
          </div>

          {/* Quick Component Addition Palette */}
          <div className="bg-[#101914] border border-emerald-950 p-4 rounded-3xl space-y-2.5">
            <span className="text-xs font-semibold text-white block">Add Parts from Catalog:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {COMPONENT_CATALOG.slice(0, 8).map(template => (
                <button
                  key={template.typeId}
                  onClick={() => handleAddCatalogComponent(template)}
                  className="p-2 rounded-xl bg-[#121c17] hover:bg-emerald-950/60 border border-emerald-950 text-left text-[11px] text-stone-300 transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{template.name}</span>
                  <Plus className="w-3 h-3 text-emerald-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Insight Banner */}
      <div className="bg-gradient-to-r from-[#122419] to-[#0f1d16] border border-emerald-900/60 rounded-3xl p-5 flex items-start gap-3.5 shadow-xl">
        <div className="p-2.5 bg-emerald-950 border border-emerald-700/60 text-emerald-400 rounded-2xl shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">
            Current Experiment: {activePreset.title}
          </h4>
          <p className="text-xs text-stone-300 leading-relaxed">
            {activePreset.learningObjective}
          </p>
        </div>
      </div>
    </div>
  );
};
