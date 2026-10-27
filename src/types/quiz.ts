export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false'
  | 'secure_unsecure'
  | 'grid_choice';

export interface Question {
  id: number;
  module: 'Mediální gramotnost' | 'IT Fitness';
  theme: string;
  prompt: string;
  scenario?: string;
  externalUrl?: string;
  externalUrlLabel?: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string | string[];
  explanation: string;
  images: string[];
}

export interface RespondentInfo {
  respondentId: string;
  grade: string;
  group?: string;
  gender?: 'female' | 'male' | 'other' | 'unspecified';
  age?: number;
  consentGiven: boolean;
  startTime: string;
}

export interface ScoreBreakdown {
  totalScore: number;
  maxScore: number;
  percentage: number;
  mediaGrammarScore: number;
  mediaGrammarMax: number;
  itFitnessScore: number;
  itFitnessMax: number;
}

export interface QuizSubmission {
  respondent: RespondentInfo;
  answers: Record<number, string | string[]>;
  score: ScoreBreakdown;
  timeSpentSeconds: number;
  completedAt: string;
  encryptedToken: string;
}

export interface AggregatedStats {
  totalSubmissions: number;
  averageScore: number;
  averagePercentage: number;
  medianScore: number;
  mediaAvgPercentage: number;
  itAvgPercentage: number;
  questionStats: {
    id: number;
    theme: string;
    module: string;
    correctCount: number;
    totalCount: number;
    successRate: number;
  }[];
}
