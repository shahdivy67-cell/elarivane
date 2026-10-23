import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Sliders, Info } from 'lucide-react';

export const PhysicsOpticsLab: React.FC = () => {
  const [labMode, setLabMode] = useState<'optics-lens' | 'pendulum-mechanics'>('optics-lens');
  const [focalLength, setFocalLength] = useState<number>(100); // mm
  const [objectDistance, setObjectDistance] = useState<number>(220); // mm
  const [objectHeight, setObjectHeight] = useState<number>(45); // mm

  // Lens equation: 1/f = 1/do + 1/di => di = (f * do) / (do - f)
  const isVirtual = objectDistance <= focalLength;
  const imageDistance = isVirtual
    ? Infinity
    : (focalLength * objectDistance) / (objectDistance - focalLength);
  const magnification = isVirtual ? 1 : -imageDistance / objectDistance;
  const imageHeight = objectHeight * magnification;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const lensX = width / 2;

    // Dark optical bench background
    ctx.fillStyle = '#0a120e';
    ctx.fillRect(0, 0, width, height);

    // Principal optical axis
    ctx.strokeStyle = '#27523a';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Convex Lens element
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lensX, centerY - 80);
    ctx.lineTo(lensX, centerY + 80);
    ctx.stroke();

    // Lens curve markers
    ctx.beginPath();
    ctx.arc(lensX, centerY - 80, 5, 0, Math.PI * 2);
    ctx.arc(lensX, centerY + 80, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();

    // Focal Points F1 and F2
    ctx.fillStyle = '#facc15';
    const f1X = lensX - focalLength;
    const f2X = lensX + focalLength;
    ctx.beginPath();
    ctx.arc(f1X, centerY, 4, 0, Math.PI * 2);
    ctx.arc(f2X, centerY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('F1', f1X - 6, centerY + 16);
    ctx.fillText('F2', f2X - 6, centerY + 16);

    // Object Arrow
    const objX = lensX - objectDistance;
    ctx.strokeStyle = '#34d399';
    ctx.fillStyle = '#34d399';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, centerY);
    ctx.lineTo(objX, centerY - objectHeight);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(objX - 5, centerY - objectHeight + 8);
    ctx.lineTo(objX, centerY - objectHeight);
    ctx.lineTo(objX + 5, centerY - objectHeight + 8);
    ctx.fill();

    // Ray 1: Parallel to axis, refracts through F2
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(objX, centerY - objectHeight);
    ctx.lineTo(lensX, centerY - objectHeight);
    if (!isVirtual && Number.isFinite(imageDistance)) {
      const imgX = lensX + imageDistance;
      const imgY = centerY - imageHeight;
      ctx.lineTo(imgX, imgY);
      ctx.stroke();

      // Ray 2: Straight through optical center (lensX, centerY)
      ctx.strokeStyle = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(objX, centerY - objectHeight);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();

      // Formed Real Inverted Image Arrow
      ctx.strokeStyle = '#fbbf24';
      ctx.fillStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(imgX, centerY);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(imgX - 5, imgY - (imgY > centerY ? 8 : -8));
      ctx.lineTo(imgX, imgY);
      ctx.lineTo(imgX + 5, imgY - (imgY > centerY ? 8 : -8));
      ctx.fill();
    } else {
      ctx.lineTo(width, centerY - objectHeight + (width - lensX) * (objectHeight / focalLength));
      ctx.stroke();
    }
  }, [focalLength, objectDistance, objectHeight, isVirtual, imageDistance, imageHeight]);

  return (
    <div className="bg-[#101b15] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-5 shadow-2xl">
      <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
            Optical Physics Bench
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            Thin-Lens Ray Tracing & Focal Imaging
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full">
            Gaussian Lens Model: 1/f = 1/do + 1/di
          </span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/50 bg-[#090f0c]">
        <canvas ref={canvasRef} width={640} height={260} className="w-full h-64 block" />
      </div>

      {/* Numerical readouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Object Distance (do):</span>
          <p className="text-base font-bold text-white font-mono">{objectDistance} mm</p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Focal Length (f):</span>
          <p className="text-base font-bold text-sky-400 font-mono">{focalLength} mm</p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Image Distance (di):</span>
          <p className="text-base font-bold text-amber-400 font-mono">
            {isVirtual ? 'Virtual (< 0)' : `${imageDistance.toFixed(1)} mm`}
          </p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Magnification (m):</span>
          <p className="text-base font-bold text-emerald-400 font-mono">
            {isVirtual ? 'Virtual' : `${magnification.toFixed(2)}x`}
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
        <div className="space-y-1.5">
          <label className="text-stone-300">Object Position Slider:</label>
          <input
            type="range"
            min="60"
            max="300"
            value={objectDistance}
            onChange={e => setObjectDistance(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-stone-300">Lens Curvature / Focal Length:</label>
          <input
            type="range"
            min="50"
            max="180"
            value={focalLength}
            onChange={e => setFocalLength(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-stone-300">Object Height:</label>
          <input
            type="range"
            min="20"
            max="70"
            value={objectHeight}
            onChange={e => setObjectHeight(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
};
