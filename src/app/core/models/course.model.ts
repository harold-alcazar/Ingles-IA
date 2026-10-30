export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ScenarioType = 
  | 'slack' 
  | 'standup' 
  | 'terminal' 
  | 'email' 
  | 'jira' 
  | 'pr_review' 
  | 'pairing' 
  | 'system_design' 
  | 'war_room' 
  | 'exec_pitch';

export interface InteractiveToken {
  text: string;
  translation: string;
  techContext: string;
  audioText?: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  role: string;
  avatarUrl?: string;
  content: (string | InteractiveToken)[];
  fullAudioText: string;
  speakerTone?: 'urgent' | 'casual' | 'formal' | 'inquisitive';
}

export type ChallengeType = 'multiple_choice' | 'fill_blank' | 'decision_tree';

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface DecisionBranch {
  id: string;
  decisionText: string;
  consequence: string;
  isOptimal: boolean;
  feedback: string;
  xpReward: number;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  instruction: string;
  contextSnippet?: string;
  options?: MultipleChoiceOption[];
  blankTarget?: string;
  acceptedAnswers?: string[];
  decisionBranches?: DecisionBranch[];
  xpReward: number;
}

export interface Mission {
  id: string;
  level: CEFRLevel;
  title: string;
  scenarioType: ScenarioType;
  objective: string;
  contextBackground: string;
  dialogue: DialogueLine[];
  challenges: Challenge[];
  xpReward: number;
  order: number;
}

export interface LevelCurriculum {
  level: CEFRLevel;
  name: string;
  badge: string;
  summary: string;
  missions: Mission[];
}
