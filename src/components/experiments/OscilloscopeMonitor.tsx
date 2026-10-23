import React, { useRef, useEffect } from 'react';
import { SimulationSample } from '../../types/experiments';

interface OscilloscopeMonitorProps {
  samples: SimulationSample[];
  vDiv: number; // Volts per division
  timeDivMs: number; // ms per division
  channel1Name?: string;
  channel2Name?: string;
}

export const OscilloscopeMonitor: React.FC<OscilloscopeMonitorProps> = ({
  samples,
  vDiv = 2.0,
  timeDivMs = 5.0,
  channel1Name = 'CH1 (Source V)',
  channel2Name = 'CH2 (Load / Output V)',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark phosphor CRT background
    ctx.fillStyle = '#06110a';
    ctx.fillRect(0, 0, width, height);

    // Draw 8x10 CRT division reticle grid
    ctx.strokeStyle = '#0e2e1c';
    ctx.lineWidth = 1;
    const numRows = 8;
    const numCols = 10;
    const rowH = height / numRows;
    const colW = width / numCols;

    for (let r = 1; r < numRows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * rowH);
      ctx.lineTo(width, r * rowH);
      ctx.stroke();
    }
    for (let c = 1; c < numCols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * colW, 0);
      ctx.lineTo(c * colW, height);
      ctx.stroke();
    }

    // Center crosshair axes
    ctx.strokeStyle = '#1a5032';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    if (samples.length < 2) return;

    const centerY = height / 2;
    const pixelsPerVolt = rowH / vDiv;

    // Draw Channel 1 (Yellow Trace)
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = (i / (samples.length - 1)) * width;
      const y = centerY - s.vSource * pixelsPerVolt;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Channel 2 (Cyan Trace)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = (i / (samples.length - 1)) * width;
      const y = centerY - s.vOut * pixelsPerVolt;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [samples, vDiv, timeDivMs]);

  const latestSample = samples[samples.length - 1] || { vSource: 0, vOut: 0, currentMa: 0 };

  return (
    <div className="bg-[#0b140f] border border-emerald-950 rounded-2xl p-3 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_6px_#facc15]" />
            {channel1Name}: {latestSample.vSource.toFixed(2)} V
          </span>
          <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
            {channel2Name}: {latestSample.vOut.toFixed(2)} V
          </span>
        </div>
        <div className="text-[11px] text-stone-400 font-mono">
          Current: <span className="text-emerald-400">{latestSample.currentMa.toFixed(2)} mA</span>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-emerald-900/50">
        <canvas ref={canvasRef} width={560} height={200} className="w-full h-44 block" />
      </div>

      <div className="flex items-center justify-between text-[10px] text-stone-300">
        <span>Scale: {vDiv.toFixed(1)} V/div</span>
        <span>Timebase: {timeDivMs.toFixed(1)} ms/div</span>
        <span>Phosphor Reticle: 8x10 div</span>
      </div>
    </div>
  );
};
