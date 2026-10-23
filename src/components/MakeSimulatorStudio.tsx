import React, { useState } from 'react';
import {
  Wand2,
  BookOpen,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Sliders,
  Copy,
  Trash2
} from 'lucide-react';
import { SimulatorMetadata, SkillCategory, VisualInteractionType, QuizQuestion } from '../types/visualSimulator';

interface MakeSimulatorStudioProps {
  onPublishSimulator: (sim: SimulatorMetadata) => void;
  onCancel: () => void;
  initialTemplate?: Partial<SimulatorMetadata>;
}

export const MakeSimulatorStudio: React.FC<MakeSimulatorStudioProps> = ({
  onPublishSimulator,
  onCancel,
  initialTemplate,
}) => {
  const [title, setTitle] = useState(initialTemplate?.title || '');
  const [category, setCategory] = useState<SkillCategory>(initialTemplate?.category || 'arts-crafts');
  const [interactionType, setInteractionType] = useState<VisualInteractionType>(
    initialTemplate?.interactionType || 'pottery-wheel'
  );
  const [subtitle, setSubtitle] = useState(initialTemplate?.subtitle || '');
  const [learningObjective, setLearningObjective] = useState(initialTemplate?.learningObjective || '');
  const [coreLesson, setCoreLesson] = useState(initialTemplate?.coreLesson || '');
  const [philosophicalContext, setPhilosophicalContext] = useState(initialTemplate?.philosophicalContext || '');

  // Exactly 3 Multiple Choice Questions
  const [q1Question, setQ1Question] = useState(initialTemplate?.quiz?.[0]?.question || '');
  const [q1Options, setQ1Options] = useState<[string, string, string, string]>(
    initialTemplate?.quiz?.[0]?.options || [
      'Foundational preparation dictates 80% of outcome quality',
      'Rushing the process yields equal results',
      'Ignoring material properties saves energy',
      'Symmetry is purely an accident'
    ]
  );
  const [q1Correct, setQ1Correct] = useState<0 | 1 | 2 | 3>(initialTemplate?.quiz?.[0]?.correctAnswerIndex || 0);
  const [q1Exp, setQ1Exp] = useState(
    initialTemplate?.quiz?.[0]?.explanation || 'Preparation creates the structural base that resists failure under load.'
  );

  const [q2Question, setQ2Question] = useState(initialTemplate?.quiz?.[1]?.question || '');
  const [q2Options, setQ2Options] = useState<[string, string, string, string]>(
    initialTemplate?.quiz?.[1]?.options || [
      'Uneven stress distribution leads to structural cracking',
      'Materials never deform under heat or moisture',
      'Random adjustments are better than calculated steps',
      'Tools do not need proper maintenance'
    ]
  );
  const [q2Correct, setQ2Correct] = useState<0 | 1 | 2 | 3>(initialTemplate?.quiz?.[1]?.correctAnswerIndex || 0);
  const [q2Exp, setQ2Exp] = useState(
    initialTemplate?.quiz?.[1]?.explanation || 'Physical materials obey thermodynamic and mechanical laws regardless of intention.'
  );

  const [q3Question, setQ3Question] = useState(initialTemplate?.quiz?.[2]?.question || '');
  const [q3Options, setQ3Options] = useState<[string, string, string, string]>(
    initialTemplate?.quiz?.[2]?.options || [
      'Digital simulation builds mental intuition before tactile practice',
      'Simulation completely replaces physical muscle memory',
      'There is no value in practicing fundamental models',
      'Physical crafts require zero mental schemas'
    ]
  );
  const [q3Correct, setQ3Correct] = useState<0 | 1 | 2 | 3>(initialTemplate?.quiz?.[2]?.correctAnswerIndex || 0);
  const [q3Exp, setQ3Exp] = useState(
    initialTemplate?.quiz?.[2]?.explanation || 'Simulations instill deep theoretical intuition, preparing the mind for real physical craft.'
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  // Template Quick Loader
  const loadPresetTemplate = (preset: 'pottery' | 'origami' | 'garden' | 'woodwork' | 'color') => {
    if (preset === 'pottery') {
      setTitle('Raku Teabowl Shaping Lab');
      setCategory('arts-crafts');
      setInteractionType('pottery-wheel');
      setSubtitle('Forming an organic Japanese tea ceremony bowl on the wheel.');
      setLearningObjective('Understand how low center of gravity and organic rim undulation balance.');
      setCoreLesson('Wabi-sabi aesthetics honor natural asymmetry while maintaining wall thickness.');
      setPhilosophicalContext('Sen no Rikyu’s tea ceremony philosophy of unadorned simplicity.');
      setQ1Question('Why do Raku teabowls feature slightly thicker bases?');
      setQ2Question('What happens if the clay rim is trimmed razor-thin?');
      setQ3Question('How does Raku firing contrast with industrial ceramic production?');
    } else if (preset === 'garden') {
      setTitle('Micro-Greens Hydroponic Aeration');
      setCategory('practical-skills');
      setInteractionType('gardening-growth');
      setSubtitle('Balancing dissolved oxygen and nutrient electrical conductivity.');
      setLearningObjective('Maintain root oxygenation to prevent stem damping off.');
      setCoreLesson('Roots require gas exchange; stagnation breeds anaerobic pathogens.');
      setPhilosophicalContext('Living flow systems: stagnation breeds rot, movement breeds vitality.');
      setQ1Question('Why must hydroponic reservoirs have air bubblers or water circulation?');
      setQ2Question('What causes white mold along the stem base of micro-greens?');
      setQ3Question('How does root surface area correlate with nutrient absorption?');
    } else if (preset === 'color') {
      setTitle('Atmospheric Perspective & Aerial Haze');
      setCategory('arts-crafts');
      setInteractionType('color-optics-mixing');
      setSubtitle('Simulating Rayleigh scattering across receding mountain ranges.');
      setLearningObjective('Shift distant values cooler and less saturated to simulate depth.');
      setCoreLesson('Distance cools and softens contrast; nearby foregrounds hold rich warmth.');
      setPhilosophicalContext('Leonardo da Vinci’s Treatise on Painting: Sfumato and aerial perspective.');
      setQ1Question('Why do distant mountains appear bluish to human eyes?');
      setQ2Question('What happens to color saturation as objects recede toward the horizon?');
      setQ3Question('In painting, how is atmospheric depth created in landscape backgrounds?');
    }
  };

  const handleValidateAndPublish = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation checks
    if (!title.trim() || title.length < 4) {
      setValidationError('Simulator title must be at least 4 characters long.');
      return;
    }
    if (!coreLesson.trim() || coreLesson.length < 15) {
      setValidationError('Core Lesson is mandatory and must explain the real-world insight (15+ chars).');
      return;
    }
    if (!q1Question.trim() || !q2Question.trim() || !q3Question.trim()) {
      setValidationError('All 3 multiple choice questions must have valid non-empty question prompts.');
      return;
    }

    // Construct exactly 3 verified questions
    const quiz: [QuizQuestion, QuizQuestion, QuizQuestion] = [
      {
        id: `custom_q1_${Date.now()}`,
        question: q1Question.trim(),
        options: q1Options,
        correctAnswerIndex: q1Correct,
        explanation: q1Exp.trim() || 'Correct understanding of foundational principles.',
      },
      {
        id: `custom_q2_${Date.now()}`,
        question: q2Question.trim(),
        options: q2Options,
        correctAnswerIndex: q2Correct,
        explanation: q2Exp.trim() || 'Correct deduction of stress and material behavior.',
      },
      {
        id: `custom_q3_${Date.now()}`,
        question: q3Question.trim(),
        options: q3Options,
        correctAnswerIndex: q3Correct,
        explanation: q3Exp.trim() || 'Correct synthesis of digital intuition and physical application.',
      },
    ];

    const newSimulator: SimulatorMetadata = {
      id: `custom_sim_${Date.now()}`,
      title: title.trim(),
      category,
      interactionType,
      durationMinutes: 4,
      xpReward: 60,
      subtitle: subtitle.trim() || 'User-crafted visual skill lab in Alivane Studio.',
      learningObjective: learningObjective.trim() || 'Master essential mechanics and principles.',
      coreLesson: coreLesson.trim(),
      philosophicalContext: philosophicalContext.trim() || 'Self-directed educational inquiry.',
      quiz,
      isCustom: true,
      version: 1,
      tags: [category, 'user-lab', 'custom'],
    };

    onPublishSimulator(newSimulator);
  };

  return (
    <div className="bg-[#121c17] border border-emerald-900/70 rounded-3xl p-5 md:p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-300">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-white">Make Visual Simulator Studio</h2>
            <p className="text-xs text-stone-300">
              Create an offline, deterministic interactive skill lab with exactly 3 assessable MCQs.
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Starter Template Pills */}
      <div className="space-y-1.5 bg-[#0b130f] p-3 rounded-2xl border border-emerald-950">
        <span className="text-[11px] text-stone-400 font-medium block">
          Load Starter Template (Zero AI - Instant Offline Presets):
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => loadPresetTemplate('pottery')}
            className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg text-xs border border-stone-800"
          >
            🏺 Raku Teabowl Wheel
          </button>
          <button
            type="button"
            onClick={() => loadPresetTemplate('garden')}
            className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg text-xs border border-stone-800"
          >
            🌱 Hydroponic Aeration
          </button>
          <button
            type="button"
            onClick={() => loadPresetTemplate('color')}
            className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg text-xs border border-stone-800"
          >
            🎨 Atmospheric Depth
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleValidateAndPublish} className="space-y-4 text-xs">
        {/* Basic Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-stone-300 font-medium">Simulator Name *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Japanese Mortise Chisel Alignment"
              className="w-full bg-[#0d1410] border border-emerald-950 rounded-xl p-2.5 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-stone-300 font-medium">Skill Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-[#0d1410] border border-emerald-950 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-emerald-500 capitalize"
            >
              <option value="arts-crafts">Arts & Crafts</option>
              <option value="practical-skills">Practical Skills</option>
              <option value="science-engineering">Science & Engineering</option>
              <option value="psychology-philosophy">Psychology & Philosophy</option>
              <option value="nature-systems">Nature & Systems</option>
              <option value="life-skills">Life Skills</option>
            </select>
          </div>
        </div>

        {/* Visual Engine Type */}
        <div className="space-y-1">
          <label className="text-stone-300 font-medium">Visual Interaction Engine *</label>
          <select
            value={interactionType}
            onChange={e => setInteractionType(e.target.value as any)}
            className="w-full bg-[#0d1410] border border-emerald-950 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-emerald-500 capitalize"
          >
            <option value="pottery-wheel">Rotating Pottery Wheel (Centrifugal 2D Mesh)</option>
            <option value="origami-fold">Origami Geometric Fold Lab (Multi-step Vector)</option>
            <option value="gardening-growth">Permaculture Soil & Growth Lab (Cross-section)</option>
            <option value="woodworking-chisel">Hardwood Chisel & Grain Mechanics</option>
            <option value="color-optics-mixing">Color Optics & Additive/Subtractive Wavelengths</option>
            <option value="trust-arena">Trust Arena Game Theory (Agent Collision Physics)</option>
            <option value="mycelium-network">Woodland Mycelium Network (Interactive Weaving)</option>
            <option value="gravity-orbits">Orbital Gravity Resonance (Newtonian Flight)</option>
            <option value="synapse-neurochemistry">Synaptic Cleft Neurochemistry Simulator</option>
          </select>
        </div>

        {/* Core Lesson (Mandatory) */}
        <div className="space-y-1 bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-900/40">
          <label className="text-emerald-300 font-semibold flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Mandatory Core Lesson (What essential real-world truth is unlocked?) *
          </label>
          <textarea
            required
            rows={2}
            value={coreLesson}
            onChange={e => setCoreLesson(e.target.value)}
            placeholder="e.g. Centering the clay lump solidly in the exact axis of rotation dictates 80% of whether the walls will collapse or stand."
            className="w-full bg-[#0b130f] border border-emerald-950 rounded-xl p-2.5 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-emerald-500 resize-none mt-1"
          />
        </div>

        {/* Exactly 3 MCQs Builder Section */}
        <div className="space-y-3 pt-2 border-t border-emerald-950">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-emerald-400 uppercase tracking-wider block">
              Exactly Three Assessment Questions (A-D):
            </span>
            <span className="text-[10px] text-stone-400">Validated 4 options per question</span>
          </div>

          {/* Question 1 */}
          <div className="bg-[#0b130f] p-3.5 rounded-2xl border border-emerald-950 space-y-2">
            <span className="font-semibold text-white">Q1 Prompt *</span>
            <input
              type="text"
              required
              value={q1Question}
              onChange={e => setQ1Question(e.target.value)}
              placeholder="e.g. What is the consequence of uneven wall thickness during kiln firing?"
              className="w-full bg-[#121c17] border border-emerald-950 rounded-lg p-2 text-stone-100"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {q1Options.map((opt, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-stone-400">{['A', 'B', 'C', 'D'][i]}</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => {
                      const copy = [...q1Options] as [string, string, string, string];
                      copy[i] = e.target.value;
                      setQ1Options(copy);
                    }}
                    className="flex-1 bg-[#121c17] border border-emerald-950 rounded-lg px-2 py-1 text-stone-200 text-[11px]"
                  />
                  <input
                    type="radio"
                    name="q1_correct"
                    checked={q1Correct === i}
                    onChange={() => setQ1Correct(i as any)}
                    title="Mark as correct answer"
                    className="accent-emerald-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <input
              type="text"
              value={q1Exp}
              onChange={e => setQ1Exp(e.target.value)}
              placeholder="Explanation for correct answer"
              className="w-full bg-[#121c17] border border-emerald-950 rounded-lg p-1.5 text-stone-400 text-[11px]"
            />
          </div>

          {/* Question 2 */}
          <div className="bg-[#0b130f] p-3.5 rounded-2xl border border-emerald-950 space-y-2">
            <span className="font-semibold text-white">Q2 Prompt *</span>
            <input
              type="text"
              required
              value={q2Question}
              onChange={e => setQ2Question(e.target.value)}
              placeholder="e.g. What occurs when cutting against hardwood grain?"
              className="w-full bg-[#121c17] border border-emerald-950 rounded-lg p-2 text-stone-100"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {q2Options.map((opt, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-stone-400">{['A', 'B', 'C', 'D'][i]}</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => {
                      const copy = [...q2Options] as [string, string, string, string];
                      copy[i] = e.target.value;
                      setQ2Options(copy);
                    }}
                    className="flex-1 bg-[#121c17] border border-emerald-950 rounded-lg px-2 py-1 text-stone-200 text-[11px]"
                  />
                  <input
                    type="radio"
                    name="q2_correct"
                    checked={q2Correct === i}
                    onChange={() => setQ2Correct(i as any)}
                    title="Mark as correct answer"
                    className="accent-emerald-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <input
              type="text"
              value={q2Exp}
              onChange={e => setQ2Exp(e.target.value)}
              placeholder="Explanation for correct answer"
              className="w-full bg-[#121c17] border border-emerald-950 rounded-lg p-1.5 text-stone-400 text-[11px]"
            />
          </div>

          {/* Question 3 */}
          <div className="bg-[#0b130f] p-3.5 rounded-2xl border border-emerald-950 space-y-2">
            <span className="font-semibold text-white">Q3 Prompt *</span>
            <input
              type="text"
              required
              value={q3Question}
              onChange={e => setQ3Question(e.target.value)}
              placeholder="e.g. How does spatial intuition transfer to physical practice?"
              className="w-full bg-[#121c17] border border-emerald-950 rounded-lg p-2 text-stone-100"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {q3Options.map((opt, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-stone-400">{['A', 'B', 'C', 'D'][i]}</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => {
                      const copy = [...q3Options] as [string, string, string, string];
                      copy[i] = e.target.value;
                      setQ3Options(copy);
                    }}
                    className="flex-1 bg-[#121c17] border border-emerald-950 rounded-lg px-2 py-1 text-stone-200 text-[11px]"
                  />
                  <input
                    type="radio"
                    name="q3_correct"
                    checked={q3Correct === i}
                    onChange={() => setQ3Correct(i as any)}
                    title="Mark as correct answer"
                    className="accent-emerald-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <input
              type="text"
              value={q3Exp}
              onChange={e => setQ3Exp(e.target.value)}
              placeholder="Explanation for correct answer"
              className="w-full bg-[#121c17] border border-emerald-950 rounded-lg p-1.5 text-stone-400 text-[11px]"
            />
          </div>
        </div>

        {/* Publish Action */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-colors"
          >
            <Check className="w-4 h-4" />
            Validate & Publish Simulator to Device (+60 Creator XP)
          </button>
        </div>
      </form>
    </div>
  );
};
