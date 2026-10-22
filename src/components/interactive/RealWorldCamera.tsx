import React, { useState } from 'react';
import { Camera, Check, Upload, Sparkles } from 'lucide-react';

interface RealWorldCameraProps {
  onComplete: (data: { notes?: string; imageUrl?: string }) => void;
}

export const RealWorldCamera: React.FC<RealWorldCameraProps> = ({ onComplete }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [reflectionNote, setReflectionNote] = useState('');

  // Sample real-world micro photos for demonstration or quick pick
  const sampleMicroShots = [
    {
      title: 'Moss in Brick Seam',
      url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Dew on Golden Leaf',
      url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Aged Weathered Wood',
      url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    onComplete({
      imageUrl: photoPreview || undefined,
      notes: reflectionNote.trim() || 'Observed a subtle nuance in everyday light and texture.',
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-4">
      {/* Photo Frame */}
      {photoPreview ? (
        <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-emerald-800/60 shadow-xl group">
          <img
            src={photoPreview}
            alt="Your real-world find"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setPhotoPreview(null)}
            className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 hover:bg-black/90 text-stone-200 text-xs rounded-lg backdrop-blur-md transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="w-full h-52 rounded-2xl border-2 border-dashed border-emerald-950 hover:border-emerald-800 bg-[#0f1713] flex flex-col items-center justify-center p-4 text-center transition-colors">
          <Camera className="w-8 h-8 text-emerald-400/80 mb-2" />
          <p className="text-xs text-stone-200 font-medium">Photograph or choose what caught your eye</p>
          <p className="text-[11px] text-stone-300 mt-0.5">
            Rust, tree bark, stone grain, or sunlight on a windowsill
          </p>

          <label className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 text-xs rounded-lg cursor-pointer transition-colors border border-emerald-700/50">
            <Upload className="w-3.5 h-3.5" />
            Upload My Photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Quick preset gallery */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] text-stone-300">or sample:</span>
            {sampleMicroShots.map(shot => (
              <button
                key={shot.title}
                onClick={() => setPhotoPreview(shot.url)}
                className="w-7 h-7 rounded-md overflow-hidden border border-stone-700 hover:border-emerald-400 transition-all"
                title={shot.title}
              >
                <img src={shot.url} alt={shot.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Reflection Field */}
      <div className="w-full space-y-1">
        <label className="text-[11px] text-stone-400 block font-medium">
          What did you observe or feel? (Optional note)
        </label>
        <textarea
          rows={2}
          value={reflectionNote}
          onChange={e => setReflectionNote(e.target.value)}
          placeholder="e.g., The orange lichen on the brick wall looked like a golden island in morning fog."
          className="w-full bg-[#131f18] border border-emerald-950 rounded-xl p-2.5 text-xs text-stone-200 placeholder:text-stone-300 focus:outline-none focus:border-emerald-500 resize-none"
        />
      </div>

      <button
        onClick={handleFinish}
        className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
      >
        <Check className="w-4 h-4" />
        Log Real-World Observation
      </button>
    </div>
  );
};
