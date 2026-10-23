import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sliders, Radio, Music } from 'lucide-react';

export const AcousticsResonanceLab: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [frequencyHz, setFrequencyHz] = useState<number>(440); // Standard A4 note
  const [harmonicN, setHarmonicN] = useState<number>(1);
  const [tubeLengthM, setTubeLengthM] = useState<number>(1.0); // 1 meter tube
  const [boundaryType, setBoundaryType] = useState<'open-open' | 'open-closed'>('open-closed');
  const [speedOfSound, setSpeedOfSound] = useState<number>(343); // m/s at 20°C
  const [sandParticlePattern, setSandParticlePattern] = useState<'chladni' | 'tube'>('tube');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Wavelength lambda = (boundary === 'open-closed') ? 4L / (2n - 1) : 2L / n
  const wavelength =
    boundaryType === 'open-closed'
      ? (4 * tubeLengthM) / (2 * harmonicN - 1)
      : (2 * tubeLengthM) / harmonicN;

  const resonantFrequency = speedOfSound / wavelength;

  // Toggle Web Audio API Synthesizer
  const toggleSound = () => {
    if (isPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequencyHz, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime); // Gentle non-harsh volume

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
        setIsPlaying(true);
      } catch (e) {
        console.error('AudioContext error', e);
      }
    }
  };

  useEffect(() => {
    if (oscillatorRef.current && audioCtxRef.current && isPlaying) {
      oscillatorRef.current.frequency.setValueAtTime(frequencyHz, audioCtxRef.current.currentTime);
    }
  }, [frequencyHz, isPlaying]);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
    };
  }, []);

  // Real-time Standing Wave Animation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      phase += 0.08;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.fillStyle = '#0a120e';
      ctx.fillRect(0, 0, width, height);

      if (sandParticlePattern === 'tube') {
        // Draw Resonance Acoustic Tube
        ctx.strokeStyle = '#27523a';
        ctx.lineWidth = 3;
        ctx.strokeRect(40, centerY - 60, width - 80, 120);

        if (boundaryType === 'open-closed') {
          // Closed end cap on right
          ctx.fillStyle = '#1e3a2b';
          ctx.fillRect(width - 45, centerY - 60, 10, 120);
        }

        // Draw Longitudinal/Transverse Standing Pressure Envelope
        const tubeInnerWidth = width - 85;
        const startX = 42;
        const k = (2 * Math.PI) / (wavelength * (tubeInnerWidth / tubeLengthM));

        // Wave 1 (+ amplitude)
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= tubeInnerWidth; x += 2) {
          const amp = Math.sin(k * x) * Math.cos(phase) * 45;
          const y = centerY + amp;
          if (x === 0) ctx.moveTo(startX + x, y);
          else ctx.lineTo(startX + x, y);
        }
        ctx.stroke();

        // Wave 2 (- inverted envelope)
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let x = 0; x <= tubeInnerWidth; x += 2) {
          const amp = -Math.sin(k * x) * Math.cos(phase) * 45;
          const y = centerY + amp;
          if (x === 0) ctx.moveTo(startX + x, y);
          else ctx.lineTo(startX + x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Nodes (zero displacement points)
        ctx.fillStyle = '#facc15';
        for (let x = 0; x <= tubeInnerWidth; x += 4) {
          if (Math.abs(Math.sin(k * x)) < 0.05) {
            ctx.beginPath();
            ctx.arc(startX + x, centerY, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillText('N', startX + x - 4, centerY + 22);
          }
        }
      } else {
        // Chladni 2D Resonance Nodal Plate Simulation
        const plateSize = Math.min(width, height) - 40;
        const startX = (width - plateSize) / 2;
        const startY = (height - plateSize) / 2;

        ctx.strokeStyle = '#1e3a2b';
        ctx.strokeRect(startX, startY, plateSize, plateSize);

        // Generate sand grains clustered at nodal curves: a*cos(nx)*cos(my) - b*cos(mx)*cos(ny) = 0
        const n = harmonicN;
        const m = harmonicN + 1;
        ctx.fillStyle = '#34d399';

        for (let i = 0; i < 350; i++) {
          const u = (i * 1.618) % 1;
          const v = (i * 2.718) % 1;
          const px = startX + u * plateSize;
          const py = startY + v * plateSize;

          const val =
            Math.cos((n * Math.PI * (px - startX)) / plateSize) *
              Math.cos((m * Math.PI * (py - startY)) / plateSize) -
            Math.cos((m * Math.PI * (px - startX)) / plateSize) *
              Math.cos((n * Math.PI * (py - startY)) / plateSize);

          if (Math.abs(val) < 0.2) {
            ctx.fillRect(px, py, 2, 2);
          }
        }
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [wavelength, tubeLengthM, boundaryType, harmonicN, sandParticlePattern]);

  return (
    <div className="bg-[#101b15] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950 pb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
            Acoustics & Wave Physics
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            Harmonic Standing Wave & Resonance Chamber
          </h3>
          <p className="text-xs text-stone-300">
            Displacement nodes (N) and antinodes (A) calculated via $v = f \cdot \lambda$ with Web Audio sound synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-colors ${
              isPlaying
                ? 'bg-rose-700 hover:bg-rose-600 text-white'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
          >
            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlaying ? 'Mute Tone' : 'Play Audio Tone'}</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas Display */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/50 bg-[#090f0c]">
        <canvas ref={canvasRef} width={640} height={240} className="w-full h-60 block" />
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button
            onClick={() => setSandParticlePattern('tube')}
            className={`px-2.5 py-1 rounded-lg text-[10px] border ${
              sandParticlePattern === 'tube'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                : 'bg-stone-900 border-stone-800 text-stone-400'
            }`}
          >
            Acoustic Air Column
          </button>
          <button
            onClick={() => setSandParticlePattern('chladni')}
            className={`px-2.5 py-1 rounded-lg text-[10px] border ${
              sandParticlePattern === 'chladni'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                : 'bg-stone-900 border-stone-800 text-stone-400'
            }`}
          >
            Chladni Plate Nodes
          </button>
        </div>
      </div>

      {/* Numerical Data Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Harmonic Mode (n):</span>
          <p className="text-base font-bold text-white font-mono">
            {harmonicN === 1 ? '1st (Fundamental)' : `${harmonicN}th Harmonic`}
          </p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Resonant Frequency:</span>
          <p className="text-base font-bold text-emerald-400 font-mono">
            {resonantFrequency.toFixed(1)} Hz
          </p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Wavelength ($\lambda$):</span>
          <p className="text-base font-bold text-sky-400 font-mono">{wavelength.toFixed(2)} m</p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Speed of Sound in Air:</span>
          <p className="text-base font-bold text-amber-400 font-mono">{speedOfSound} m/s</p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
        <div className="space-y-1.5">
          <div className="flex justify-between text-stone-300">
            <span>Audio Frequency:</span>
            <span className="text-emerald-400 font-mono font-bold">{frequencyHz} Hz</span>
          </div>
          <input
            type="range"
            min="100"
            max="1200"
            step="5"
            value={frequencyHz}
            onChange={e => setFrequencyHz(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-stone-300">
            <span>Harmonic Number (n):</span>
            <span className="text-sky-400 font-mono font-bold">{harmonicN}</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={harmonicN}
            onChange={e => {
              const n = Number(e.target.value);
              setHarmonicN(n);
              const wl =
                boundaryType === 'open-closed'
                  ? (4 * tubeLengthM) / (2 * n - 1)
                  : (2 * tubeLengthM) / n;
              setFrequencyHz(Math.round(speedOfSound / wl));
            }}
            className="w-full accent-sky-500"
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-stone-300 block">Boundary Conditions:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setBoundaryType('open-closed')}
              className={`p-2 rounded-xl text-center border ${
                boundaryType === 'open-closed'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold'
                  : 'bg-stone-900 border-stone-800 text-stone-400'
              }`}
            >
              Quarter Wave (Closed)
            </button>
            <button
              onClick={() => setBoundaryType('open-open')}
              className={`p-2 rounded-xl text-center border ${
                boundaryType === 'open-open'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold'
                  : 'bg-stone-900 border-stone-800 text-stone-400'
              }`}
            >
              Half Wave (Open)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
