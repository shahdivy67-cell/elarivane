import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Download, Check, Sparkles } from 'lucide-react';

interface CanvasDrawProps {
  onComplete: (dataUrl: string) => void;
}

export const CanvasDraw: React.FC<CanvasDrawProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#22c55e'); // Green
  const [brushSize, setBrushSize] = useState(8);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Handpicked harmonious 3-color palette options
  const palettes = [
    { name: 'Misty Forest', colors: ['#0f3923', '#2d6a4f', '#d8f3dc'] },
    { name: 'Desert Twilight', colors: ['#3a1d28', '#b05338', '#f8d5a3'] },
    { name: 'Deep Oceanic', colors: ['#0b2545', '#134074', '#8da9c4'] },
  ];
  const [activePaletteIndex, setActivePaletteIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill canvas with calm dark background
    ctx.fillStyle = '#0f1713';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSelectedColor(palettes[activePaletteIndex].colors[1]);
  }, [activePaletteIndex]);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f1713';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFinish = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onComplete(dataUrl);
  };

  const currentColors = palettes[activePaletteIndex].colors;

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-4">
      {/* Palette Selector */}
      <div className="flex items-center justify-between w-full text-xs text-stone-300">
        <span className="font-medium">Palette: {palettes[activePaletteIndex].name}</span>
        <div className="flex gap-1.5">
          {palettes.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => setActivePaletteIndex(idx)}
              className={`px-2 py-1 rounded-md text-[11px] transition-all ${
                activePaletteIndex === idx
                  ? 'bg-emerald-800/80 text-emerald-100 font-semibold'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/50 shadow-inner bg-[#0f1713]">
        <canvas
          ref={canvasRef}
          width={340}
          height={300}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="touch-none cursor-crosshair block"
        />

        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-stone-400 text-xs text-center p-4">
            <Sparkles className="w-5 h-5 text-emerald-400/60 mb-2 animate-bounce" />
            <p>Glide with your finger or mouse.</p>
            <p className="text-stone-300">3 colors: Horizon, Mist, Foreground</p>
          </div>
        )}
      </div>

      {/* Palette Colors & Brush Controls */}
      <div className="flex items-center justify-between w-full px-1">
        <div className="flex items-center gap-2">
          {currentColors.map((col, index) => (
            <button
              key={col}
              onClick={() => setSelectedColor(col)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                selectedColor === col
                  ? 'scale-110 border-white shadow-lg'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: col }}
              title={`Color ${index + 1}`}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-1 bg-stone-900/80 px-2 py-1 rounded-lg border border-stone-800">
          {[4, 8, 16].map(size => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                brushSize === size ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span
                className="rounded-full bg-current"
                style={{ width: size / 1.8, height: size / 1.8 }}
              />
            </button>
          ))}
        </div>

        {/* Clear */}
        <button
          onClick={clearCanvas}
          className="p-2 text-stone-400 hover:text-stone-200 bg-stone-900/60 rounded-lg hover:bg-stone-800 transition-colors"
          title="Clear canvas"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Completion */}
      <button
        onClick={handleFinish}
        disabled={!hasDrawn}
        className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:pointer-events-none text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
      >
        <Check className="w-4 h-4" />
        Save Landscape & Finish
      </button>
    </div>
  );
};
