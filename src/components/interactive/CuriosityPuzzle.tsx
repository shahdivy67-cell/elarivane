import React, { useState } from 'react';
import { Network, Check, Sparkles } from 'lucide-react';

interface CuriosityPuzzleProps {
  onComplete: () => void;
}

export const CuriosityPuzzle: React.FC<CuriosityPuzzleProps> = ({ onComplete }) => {
  // Wood Wide Web mycelium connection puzzle
  // 4 mother trees (nodes 1..4) needing connection to fungal hub
  const [connectedNodes, setConnectedNodes] = useState<number[]>([]);

  const nodes = [
    { id: 1, name: 'Ancient Oak (Carbon Donor)', x: '20%', y: '25%', color: '#10b981' },
    { id: 2, name: 'Douglas Fir (Seedling)', x: '75%', y: '20%', color: '#06b6d4' },
    { id: 3, name: 'Paper Birch (Nitrogen Sync)', x: '30%', y: '75%', color: '#eab308' },
    { id: 4, name: 'Sugar Maple (Sapling)', x: '80%', y: '70%', color: '#ec4899' },
  ];

  const toggleNode = (id: number) => {
    if (connectedNodes.includes(id)) {
      setConnectedNodes(prev => prev.filter(n => n !== id));
    } else {
      setConnectedNodes(prev => [...prev, id]);
    }
  };

  const isComplete = connectedNodes.length === 4;

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-4">
      <div className="text-center space-y-1">
        <p className="text-xs text-emerald-400 font-medium tracking-wide uppercase flex items-center justify-center gap-1.5">
          <Network className="w-3.5 h-3.5" />
          Mycelium Hyphae Router
        </p>
        <p className="text-xs text-stone-300">
          Tap each tree node to weave fungal mycelium strands and balance forest nutrients ({connectedNodes.length}/4).
        </p>
      </div>

      <div className="relative w-full h-64 bg-[#0a110d] rounded-2xl overflow-hidden border border-emerald-950/70 p-4">
        {/* Central Mycorrhizal Fungal Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-xl ${
              isComplete
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-emerald-500/40 animate-pulse'
                : 'bg-stone-900 border-stone-700 text-stone-400'
            }`}
          >
            🍄
          </div>
          <span className="text-[9px] text-stone-300 mt-1 uppercase font-semibold">Central Hub</span>
        </div>

        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connectedNodes.includes(1) && (
            <line x1="20%" y1="25%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
          )}
          {connectedNodes.includes(2) && (
            <line x1="75%" y1="20%" x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="4 2" />
          )}
          {connectedNodes.includes(3) && (
            <line x1="30%" y1="75%" x2="50%" y2="50%" stroke="#eab308" strokeWidth="2.5" strokeDasharray="4 2" />
          )}
          {connectedNodes.includes(4) && (
            <line x1="80%" y1="70%" x2="50%" y2="50%" stroke="#ec4899" strokeWidth="2.5" strokeDasharray="4 2" />
          )}
        </svg>

        {/* Outer Tree Nodes */}
        {nodes.map(node => {
          const isSelected = connectedNodes.includes(node.id);
          return (
            <button
              key={node.id}
              onClick={() => toggleNode(node.id)}
              style={{ left: node.x, top: node.y }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full border-2 transition-all flex flex-col items-center gap-1 group shadow-lg ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-950/80 scale-110 shadow-emerald-900/60'
                  : 'border-stone-700 bg-stone-900/90 hover:border-stone-500'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: isSelected ? node.color : '#57534e' }}
              />
              <span className="text-[9px] max-w-[70px] truncate text-stone-300 font-medium text-center">
                {node.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {isComplete ? (
        <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/40 text-xs text-emerald-200 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Woodland Symbiosis Activated!</strong> Mother trees are transmitting 40% of their photosynthesized sugars directly to understory saplings.
          </span>
        </div>
      ) : (
        <p className="text-xs text-stone-300 text-center">
          Tap each tree to extend mycorrhizal hyphae filaments.
        </p>
      )}

      <button
        onClick={onComplete}
        disabled={!isComplete}
        className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:pointer-events-none text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
      >
        <Check className="w-4 h-4" />
        Finish Network Puzzle
      </button>
    </div>
  );
};
