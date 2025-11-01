export enum AssessmentType {
  RedFlags = 'red_flags',
  StartBack = 'start_back',
  RMDQ = 'rmdq',
  VAS = 'vas'
}

export interface Assessment {
  id: string;
  userId: string;
  assessmentType: AssessmentType;
  score?: number;
  rawAnswers: Record<string, any>;
  createdAt: string;
}

export interface RedFlagAnswer {
  questionId: string;
  answer: boolean;
}

export interface StartBackAnswer {
  questionId: number;
  answer: number; // 0 or 1
}

export interface RMDQAnswer {
  questionId: number;
  answer: boolean;
}

export interface PainLocalization {
  anterior: number[];
  posterior: number[];
}

export interface StartBackResult {
  totalScore: number;
  psychosocialScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

