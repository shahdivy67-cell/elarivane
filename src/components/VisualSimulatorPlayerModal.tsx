import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { SimulatorMetadata } from '../types/visualSimulator';
import { PotteryWheelSimulator } from './simulators/PotteryWheelSimulator';
import { OrigamiFoldSimulator } from './simulators/OrigamiFoldSimulator';
import { GardeningSoilSimulator } from './simulators/GardeningSoilSimulator';
import { WoodworkingChiselSimulator } from './simulators/WoodworkingChiselSimulator';
import { ColorOpticsSimulator } from './simulators/ColorOpticsSimulator';
import { TrustArenaGame } from './simulators/TrustArenaGame';
import { MyceliumForestGame } from './simulators/MyceliumForestGame';
import { GravityOrbiterGame } from './simulators/GravityOrbiterGame';
import { DopamineSynapseGame } from './simulators/DopamineSynapseGame';
import { SimulatorQuizAssessment } from './SimulatorQuizAssessment';
import {
  saveUnfinishedProgress,
  getUnfinishedProgress,
  recordSimulatorCompletion,
  isSimulatorCompleted
} from '../utils/simulatorStorage';
import { awardQuizXp } from '../utils/xpLedger';

interface VisualSimulatorPlayerProps {
  simulator: SimulatorMetadata;
  onClose: () => void;
  onFinishedSuccessfully: (score: number) => void;
  isReviewMode?: boolean;
  previousScore?: number;
}

export const VisualSimulatorPlayerModal: React.FC<VisualSimulatorPlayerProps> = ({
  simulator,
  onClose,
  onFinishedSuccessfully,
  isReviewMode = false,
  previousScore,
}) => {
  const [phase, setPhase] = useState<'interactive-practice' | 'quiz-assessment'>('interactive-practice');
  const [savedProgress, setSavedProgress] = useState<any>(() => getUnfinishedProgress(simulator.id));

  const handleSaveProgress = (state: any) => {
    saveUnfinishedProgress(simulator.id, state);
  };

  const handleInteractiveComplete = () => {
    setPhase('quiz-assessment');
  };

  const handleFinishAssessment = (score: number, userAnswers: number[]) => {
    // Award XP deterministically strictly if not reviewing
    let earnedXp = 0;
    if (!isReviewMode) {
      const awardResult = awardQuizXp(simulator.id, simulator.title, score);
      earnedXp = awardResult.awardedXp;
    }

    // Record completion permanently
    recordSimulatorCompletion({
      simulatorId: simulator.id,
      simulatorTitle: simulator.title,
      category: simulator.category,
      completedAt: new Date().toISOString(),
      score,
      totalQuestions: 3,
      xpEarned: earnedXp,
      userAnswers,
      simulatorVersion: simulator.version,
      coreLessonSummary: simulator.coreLesson,
    });

    onFinishedSuccessfully(score);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto relative max-h-[94vh]">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-950 bg-[#0c130f]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              {simulator.category.replace('-', ' ')}
            </span>
            {isReviewMode && (
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60">
                Archived Review
              </span>
            )}
            <span className="text-xs text-stone-300">
              {simulator.durationMinutes} min • +{simulator.xpReward} XP
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-900 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-4">
          {phase === 'quiz-assessment' ? (
            <SimulatorQuizAssessment
              simulatorTitle={simulator.title}
              quiz={simulator.quiz}
              onFinishAssessment={handleFinishAssessment}
              onRetryLesson={() => setPhase('interactive-practice')}
              isReviewMode={isReviewMode}
              previousScore={previousScore}
            />
          ) : (
            <div className="space-y-4">
              {/* Header Titles */}
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
                  {simulator.title}
                </h2>
                <p className="text-xs text-stone-300">{simulator.subtitle}</p>
              </div>

              {/* Learning Objective Card */}
              <div className="p-3 bg-gradient-to-r from-[#14231a] to-[#0f1d16] rounded-2xl border border-emerald-900/60 flex items-start gap-3">
                <div className="p-2 bg-emerald-950 border border-emerald-700/60 text-emerald-400 rounded-xl shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider block">
                    Learning Objective:
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    {simulator.learningObjective}
                  </p>
                </div>
              </div>

              {/* Render Respective Dynamic Interaction Engine */}
              {simulator.interactionType === 'pottery-wheel' && (
                <PotteryWheelSimulator
                  onCompleteAction={handleInteractiveComplete}
                  savedState={savedProgress}
                  onSaveProgress={handleSaveProgress}
                />
              )}

              {simulator.interactionType === 'origami-fold' && (
                <OrigamiFoldSimulator
                  onCompleteAction={handleInteractiveComplete}
                  savedState={savedProgress}
                  onSaveProgress={handleSaveProgress}
                />
              )}

              {simulator.interactionType === 'gardening-growth' && (
                <GardeningSoilSimulator
                  onCompleteAction={handleInteractiveComplete}
                  savedState={savedProgress}
                  onSaveProgress={handleSaveProgress}
                />
              )}

              {simulator.interactionType === 'woodworking-chisel' && (
                <WoodworkingChiselSimulator
                  onCompleteAction={handleInteractiveComplete}
                  savedState={savedProgress}
                  onSaveProgress={handleSaveProgress}
                />
              )}

              {simulator.interactionType === 'color-optics-mixing' && (
                <ColorOpticsSimulator
                  onCompleteAction={handleInteractiveComplete}
                  savedState={savedProgress}
                  onSaveProgress={handleSaveProgress}
                />
              )}

              {simulator.interactionType === 'trust-arena' && (
                <TrustArenaGame onFinishLesson={handleInteractiveComplete} />
              )}

              {simulator.interactionType === 'mycelium-network' && (
                <MyceliumForestGame onFinishLesson={handleInteractiveComplete} />
              )}

              {simulator.interactionType === 'gravity-orbits' && (
                <GravityOrbiterGame onFinishLesson={handleInteractiveComplete} />
              )}

              {simulator.interactionType === 'synapse-neurochemistry' && (
                <DopamineSynapseGame onFinishLesson={handleInteractiveComplete} />
              )}

              {/* Fallback for parameterized rule-based models */}
              {simulator.interactionType === 'circuit-electronics' && (
                <ColorOpticsSimulator
                  onCompleteAction={handleInteractiveComplete}
                  savedState={savedProgress}
                  onSaveProgress={handleSaveProgress}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
