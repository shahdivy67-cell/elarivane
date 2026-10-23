export type SimulatorDomain =
  | 'human-psychology'
  | 'systems-ecology'
  | 'physics-cosmos'
  | 'game-theory'
  | 'mindful-habits'
  | 'finance-patience'
  | 'philosophy-ethics'
  | 'social-dynamics';

export type SimulatorEngineType =
  | 'interactive-slider-system' // Differential/dynamic feedback model with instant curves
  | 'choice-branching'          // Sequential moral/strategic dilemmas with consequence cascades
  | 'particle-ecosystem'        // Cellular automata / multi-agent visual playground
  | 'equilibrium-scale'         // Trade-off balancing acts (risk vs reward, speed vs stability)
  | 'algorithmic-puzzle';       // Problem-solving with verifiable insights

export interface SimulatorVariable {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  description: string;
}

export interface SimulatorChoiceNode {
  id: string;
  prompt: string;
  options: {
    label: string;
    impactDescription: string;
    metricsDelta: { [key: string]: number };
    lessonSnippet: string;
    nextNodeId?: string;
  }[];
}

export interface SimulatorItem {
  id: string;
  title: string;
  domain: SimulatorDomain;
  engineType: SimulatorEngineType;
  durationMinutes: number;
  xpReward: number;
  subtitle: string;
  coreLesson: string; // The profound real-world takeaway
  philosophicalContext: string;
  variables: SimulatorVariable[];
  initialMetrics: { [key: string]: number };
  metricLabels: { [key: string]: string };
  choiceStory?: SimulatorChoiceNode[];
  evaluatorFnKey: string; // Key mapping to interactive computational model
  creator?: string; // 'Alivane Wisdom Core' or community user
  isCustomCreated?: boolean;
  timesCompleted: number;
  favorite?: boolean;
}
