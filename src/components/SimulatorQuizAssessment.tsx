import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, HelpCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { QuizQuestion } from '../types/visualSimulator';

interface SimulatorQuizAssessmentProps {
  simulatorTitle: string;
  quiz: [QuizQuestion, QuizQuestion, QuizQuestion];
  onFinishAssessment: (score: number, userAnswers: number[]) => void;
  onRetryLesson: () => void;
  isReviewMode?: boolean;
  previousScore?: number;
}

export const SimulatorQuizAssessment: React.FC<SimulatorQuizAssessmentProps> = ({
  simulatorTitle,
  quiz,
  onFinishAssessment,
  onRetryLesson,
  isReviewMode = false,
  previousScore,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([null, null, null]);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean[]>([false, false, false]);
  const [isAssessmentDone, setIsAssessmentDone] = useState(false);

  const currentQuestion = quiz[currentQIndex];
  const chosenOption = selectedAnswers[currentQIndex];
  const isAnswerRevealed = hasSubmittedAnswer[currentQIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerRevealed) return; // Prevent changing after submitting
    const copy = [...selectedAnswers];
    copy[currentQIndex] = idx;
    setSelectedAnswers(copy);
  };

  const handleConfirmAnswer = () => {
    if (chosenOption === null) return;
    const copy = [...hasSubmittedAnswer];
    copy[currentQIndex] = true;
    setHasSubmittedAnswer(copy);
  };

  const handleNextOrFinish = () => {
    if (currentQIndex < 2) {
      setCurrentQIndex(i => i + 1);
    } else {
      setIsAssessmentDone(true);
    }
  };

  // Calculate score out of 3
  const calculatedScore = selectedAnswers.reduce<number>((acc, ans, i) => {
    return ans === quiz[i].correctAnswerIndex ? acc + 1 : acc;
  }, 0);

  const allThreeAnswered = hasSubmittedAnswer.every(Boolean);
  const potentialXp = calculatedScore * 10;

  if (isAssessmentDone) {
    return (
      <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-300 mx-auto shadow-xl">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">
            Assessment Completed
          </span>
          <h3 className="text-xl font-serif font-bold text-white">{simulatorTitle}</h3>
          <p className="text-sm text-stone-300">
            {isReviewMode ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-700 text-stone-300 text-xs">
                Review Mode: Previously recorded {previousScore ?? 0}/3 correct (+{(previousScore ?? 0) * 10} XP already archived)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-200 text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {calculatedScore}/3 correct · +{potentialXp} XP earned
              </span>
            )}
          </p>
          <p className="text-xs text-stone-300 max-w-md mx-auto pt-1">
            {calculatedScore === 3
              ? 'Flawless concept mastery! You demonstrated complete comprehension of the foundational principles.'
              : calculatedScore >= 1
              ? 'Good effort! Review the explanations below to solidify the lessons you encountered during practice.'
              : 'Review the explanations below and return to the practical simulator to explore the physical reactions again.'}
          </p>
        </div>

        {/* Detailed Breakdown of 3 Questions */}
        <div className="space-y-3 text-left max-w-lg mx-auto">
          {quiz.map((q, idx) => {
            const userChoice = selectedAnswers[idx];
            const isCorrect = userChoice === q.correctAnswerIndex;
            return (
              <div
                key={q.id}
                className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                  isCorrect
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-100'
                    : 'bg-rose-950/20 border-rose-900/40 text-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-white">Q{idx + 1}. {q.question}</span>
                  {isCorrect ? (
                    <span className="text-emerald-400 shrink-0 font-bold">✓ Correct</span>
                  ) : (
                    <span className="text-rose-400 shrink-0 font-bold">✗ Incorrect</span>
                  )}
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed italic">
                  💡 {q.explanation}
                </p>
              </div>
            );
          })}
        </div>

        <div className="pt-3 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
          <button
            onClick={() => onFinishAssessment(calculatedScore, selectedAnswers.map(a => a ?? 0))}
            className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs shadow-lg transition-colors"
          >
            Archive & Finalize Simulator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
        <div>
          <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
            Concept Mastery Check
          </span>
          <h3 className="text-sm font-serif font-bold text-white">
            Question {currentQIndex + 1} of 3
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {[0, 1, 2].map(idx => (
            <div
              key={idx}
              className={`w-6 h-2 rounded-full transition-colors ${
                currentQIndex === idx
                  ? 'bg-emerald-400'
                  : hasSubmittedAnswer[idx]
                  ? 'bg-emerald-900'
                  : 'bg-stone-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question prompt */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white leading-snug">
          {currentQuestion.question}
        </h4>
      </div>

      {/* 4 Multiple Choice Options (A, B, C, D) */}
      <div className="space-y-2 text-xs">
        {currentQuestion.options.map((opt, idx) => {
          const letter = ['A', 'B', 'C', 'D'][idx];
          const isSelected = chosenOption === idx;
          const isCorrect = idx === currentQuestion.correctAnswerIndex;

          let btnClass = 'bg-[#121c17] border-emerald-950 text-stone-300 hover:border-emerald-700';
          if (isSelected) btnClass = 'bg-emerald-950 border-emerald-500 text-emerald-100 ring-1 ring-emerald-400';

          if (isAnswerRevealed) {
            if (isCorrect) {
              btnClass = 'bg-emerald-900/50 border-emerald-500 text-emerald-200 font-semibold';
            } else if (isSelected && !isCorrect) {
              btnClass = 'bg-rose-950/40 border-rose-600 text-rose-300';
            } else {
              btnClass = 'bg-[#121c17] opacity-40 border-stone-800 text-stone-500';
            }
          }

          return (
            <button
              key={opt}
              disabled={isAnswerRevealed}
              onClick={() => handleSelectOption(idx)}
              className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${btnClass}`}
            >
              <span className="w-5 h-5 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {letter}
              </span>
              <span className="flex-1 leading-snug">{opt}</span>
              {isAnswerRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isAnswerRevealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation banner once revealed */}
      {isAnswerRevealed && (
        <div className="p-3.5 bg-stone-900/70 border border-stone-800 rounded-2xl text-xs space-y-1 animate-in fade-in">
          <span className="font-semibold text-emerald-300 block">Explanation:</span>
          <p className="text-stone-300 leading-relaxed">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-emerald-950">
        <button
          onClick={onRetryLesson}
          className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Return to Practical Simulator
        </button>

        {!isAnswerRevealed ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={chosenOption === null}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-30 text-white font-semibold rounded-xl text-xs transition-colors shadow"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextOrFinish}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg"
          >
            <span>{currentQIndex === 2 ? 'View Score' : 'Next Question'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
