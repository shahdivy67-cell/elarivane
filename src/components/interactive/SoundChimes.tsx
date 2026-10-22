import React, { useState } from 'react';
import { Volume2, Check, Bell } from 'lucide-react';

interface SoundChimesProps {
  onComplete: () => void;
}

export const SoundChimes: React.FC<SoundChimesProps> = ({ onComplete }) => {
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [ringCount, setRingCount] = useState(0);

  // Pentatonic scale frequencies in Hz (A4 = 432Hz calming tuning)
  const notes = [
    { name: 'C5 (Root)', freq: 513.7, label: 'Earth', color: '#10b981' },
    { name: 'D5', freq: 577.3, label: 'Water', color: '#06b6d4' },
    { name: 'E5', freq: 648.0, label: 'Wood', color: '#84cc16' },
    { name: 'G5', freq: 768.9, label: 'Wind', color: '#eab308' },
    { name: 'A5', freq: 864.0, label: 'Sky', color: '#a855f7' },
  ];

  const playTone = (freq: number, index: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Gentle warm bell waveform
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Bell decay envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.9);

      setActiveNote(index);
      setRingCount(prev => prev + 1);
      setTimeout(() => setActiveNote(null), 400);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-1">
        <p className="text-xs text-emerald-400 font-medium tracking-wide uppercase flex items-center justify-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5" />
          432 Hz Pentatonic Wind Chimes
        </p>
        <p className="text-xs text-stone-300">
          Every note harmonizes with the others. Tap individual chimes or sweep across them.
        </p>
      </div>

      {/* Floating Wind Chime Tubes */}
      <div className="w-full bg-[#111915] p-6 rounded-2xl border border-emerald-950/60 shadow-xl flex items-end justify-center gap-4 h-64 relative overflow-hidden">
        {/* Overhead beam */}
        <div className="absolute top-4 left-6 right-6 h-2 bg-[#2d3a32] rounded-full shadow-md" />

        {notes.map((note, idx) => {
          const heightPercent = 90 - idx * 10;
          const isActive = activeNote === idx;

          return (
            <div key={note.name} className="flex flex-col items-center relative group">
              {/* String from beam */}
              <div className="w-[1.5px] h-6 bg-stone-500 mb-0.5" />

              {/* Chime Tube */}
              <button
                onClick={() => playTone(note.freq, idx)}
                className={`w-9 rounded-full transition-all duration-300 transform flex flex-col items-center justify-between py-3 shadow-lg ${
                  isActive
                    ? 'scale-110 -translate-y-2 ring-4 ring-emerald-400/40'
                    : 'hover:scale-105 hover:-translate-y-1'
                }`}
                style={{
                  height: `${heightPercent * 1.6}px`,
                  background: isActive
                    ? `linear-gradient(to bottom, #d1fae5, ${note.color})`
                    : `linear-gradient(to bottom, #1f2e26, #2d4538)`,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-white/40" />
                <span className={`text-[10px] font-semibold ${isActive ? 'text-black' : 'text-stone-300'}`}>
                  {note.label}
                </span>
                <div className="w-2 h-2 rounded-full bg-black/30" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Play All Strum */}
      <button
        onClick={() => {
          notes.forEach((note, idx) => {
            setTimeout(() => playTone(note.freq, idx), idx * 250);
          });
        }}
        className="text-xs px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1.5"
      >
        <Bell className="w-3.5 h-3.5 text-emerald-400" />
        Harmonic Gentle Arpeggio
      </button>

      <button
        onClick={onComplete}
        disabled={ringCount < 4}
        className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:pointer-events-none text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
      >
        <Check className="w-4 h-4" />
        {ringCount < 4 ? 'Strike a few chimes' : 'Done & Rested'}
      </button>
    </div>
  );
};
