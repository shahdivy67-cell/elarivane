import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';

interface OrigamiProps {
  onCompleteAction: () => void;
  savedState?: any;
  onSaveProgress?: (state: any) => void;
}

export const OrigamiFoldSimulator: React.FC<OrigamiProps> = ({
  onCompleteAction,
  savedState,
  onSaveProgress,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(savedState?.currentStep || 0);
  const [paperColor, setPaperColor] = useState<string>(savedState?.paperColor || '#ef4444'); // Crimson Red Kami

  const steps = [
    {
      title: 'Step 1: The Valley Diagonal',
      instruction: 'Fold square paper corner to corner into a clean triangular valley crease.',
      svgView: (color: string) => (
        <svg viewBox="0 0 200 200" className="w-full h-48 drop-shadow-xl">
          <polygon points="20,20 180,20 180,180 20,180" fill={color} stroke="#fee2e2" strokeWidth="2" opacity="0.9" />
          <line x1="20" y1="20" x2="180" y2="180" stroke="#fef08a" strokeWidth="2" strokeDasharray="5,5" />
          <path d="M 120 40 Q 150 70 140 100" fill="none" stroke="#fef08a" strokeWidth="2" markerEnd="url(#arrow)" />
        </svg>
      ),
      tip: 'Run your thumbnail along the fold. In origami, an imprecise first crease multiplies errors by tenfold in final steps.',
    },
    {
      title: 'Step 2: Triangle to Square Base',
      instruction: 'Fold in half once more along the center to create a smaller triangle, then squash-fold the pocket.',
      svgView: (color: string) => (
        <svg viewBox="0 0 200 200" className="w-full h-48 drop-shadow-xl">
          <polygon points="20,20 180,20 100,180" fill={color} stroke="#fee2e2" strokeWidth="2" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="#fef08a" strokeWidth="2" strokeDasharray="4,4" />
        </svg>
      ),
      tip: 'Squash folds require gentle finger pressure inside the pocket rather than tearing the corner seam.',
    },
    {
      title: 'Step 3: The Petal Fold (Crane Wings Preparation)',
      instruction: 'Fold the left and right outer flaps to the center crease line, forming a tight kite diamond.',
      svgView: (color: string) => (
        <svg viewBox="0 0 200 200" className="w-full h-48 drop-shadow-xl">
          <polygon points="100,20 150,100 100,180 50,100" fill={color} stroke="#fee2e2" strokeWidth="2" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="#fff" strokeWidth="1.5" />
          <line x1="50" y1="100" x2="150" y2="100" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3,3" />
        </svg>
      ),
      tip: 'Notice how paper geometry locks into place through symmetry. Clean 45-degree angle intersections distribute tension evenly.',
    },
    {
      title: 'Step 4: Neck Reverse Fold & Wing Flare',
      instruction: 'Perform an inside reverse fold for the neck and head, then flare both wings horizontally.',
      svgView: (color: string) => (
        <svg viewBox="0 0 200 200" className="w-full h-48 drop-shadow-xl">
          {/* Origami Crane representation */}
          <polygon points="100,60 175,90 120,135" fill={color} stroke="#fff" strokeWidth="1.5" />
          <polygon points="100,60 25,90 80,135" fill={color} stroke="#fff" strokeWidth="1.5" />
          <polygon points="100,60 120,135 100,170 80,135" fill="#991b1b" stroke="#fff" strokeWidth="1.5" />
          {/* Head & Tail */}
          <line x1="45" y1="110" x2="20" y2="70" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <line x1="20" y1="70" x2="14" y2="78" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <line x1="155" y1="110" x2="185" y2="75" stroke={color} strokeWidth="4" strokeLinecap="round" />
        </svg>
      ),
      tip: 'The traditional Orizuru (Japanese crane) symbolizes hope and patience across hundreds of precise mathematical creases.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (onSaveProgress) onSaveProgress({ currentStep: next, paperColor });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      if (onSaveProgress) onSaveProgress({ currentStep: prev, paperColor });
    }
  };

  return (
    <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
        <div>
          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
            Origami Geometry: The Orizuru Crane Fold
          </h3>
          <p className="text-xs text-stone-300">
            Step-by-step spatial geometry transformation from flat 2D sheet to self-supporting 3D avian form.
          </p>
        </div>

        <div className="flex gap-1.5">
          {['#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map(c => (
            <button
              key={c}
              onClick={() => setPaperColor(c)}
              style={{ backgroundColor: c }}
              className={`w-5 h-5 rounded-full border ${paperColor === c ? 'border-white scale-110' : 'border-transparent'}`}
            />
          ))}
        </div>
      </div>

      {/* Visual Step Viewer */}
      <div className="bg-[#0b130f] border border-emerald-950 p-4 rounded-2xl flex flex-col items-center justify-center relative">
        <span className="absolute top-3 left-3 text-xs font-mono text-emerald-400">
          Step {currentStep + 1} of {steps.length}
        </span>
        {steps[currentStep].svgView(paperColor)}
        <div className="text-center space-y-1 mt-2">
          <h4 className="text-sm font-semibold text-white">{steps[currentStep].title}</h4>
          <p className="text-xs text-stone-300 max-w-sm">{steps[currentStep].instruction}</p>
        </div>
      </div>

      {/* Folding Tip */}
      <div className="p-3 bg-stone-900/60 border border-stone-800 rounded-xl text-xs text-stone-300 italic">
        💡 <strong>Spatial Insight:</strong> {steps[currentStep].tip}
      </div>

      {/* Step Navigation & Completion */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-30 text-stone-300 rounded-xl text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow"
          >
            Next Fold <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onCompleteAction}
            className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4" /> Take Origami Assessment (3 MCQs)
          </button>
        )}
      </div>
    </div>
  );
};
