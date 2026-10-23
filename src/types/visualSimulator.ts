export type SkillCategory =
  | 'arts-crafts'
  | 'practical-skills'
  | 'science-engineering'
  | 'psychology-philosophy'
  | 'nature-systems'
  | 'life-skills';

export type VisualInteractionType =
  | 'pottery-wheel'
  | 'origami-fold'
  | 'gardening-growth'
  | 'woodworking-chisel'
  | 'color-optics-mixing'
  | 'circuit-electronics'
  | 'trust-arena'
  | 'mycelium-network'
  | 'gravity-orbits'
  | 'synapse-neurochemistry'
  | 'rule-based-canvas';

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string]; // Exactly 4 options A, B, C, D
  correctAnswerIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface SimulatorMetadata {
  id: string;
  title: string;
  category: SkillCategory;
  interactionType: VisualInteractionType;
  durationMinutes: number;
  xpReward: number;
  subtitle: string;
  learningObjective: string;
  coreLesson: string;
  philosophicalContext: string;
  disclaimer?: string; // e.g. Digital simulation teaches concepts, does not replace physical craft.
  quiz: [QuizQuestion, QuizQuestion, QuizQuestion]; // Exactly three questions
  isCustom?: boolean;
  version: number;
  tags: string[];
  templateId?: string;
  // Custom rule definitions for user-created simulators
  customConfig?: {
    palette?: string[];
    speed?: number;
    targetHeight?: number;
    targetWidth?: number;
    initialProperties?: Record<string, number | string | boolean>;
  };
}

export interface SimulatorCompletionRecord {
  simulatorId: string;
  simulatorTitle: string;
  category: SkillCategory;
  completedAt: string; // ISO
  score: number; // 0, 1, 2, or 3
  totalQuestions: 3;
  xpEarned: number;
  userAnswers: number[];
  simulatorVersion: number;
  coreLessonSummary: string;
}

export interface UnfinishedSimulationProgress {
  simulatorId: string;
  updatedAt: string;
  state: Record<string, any>;
}
