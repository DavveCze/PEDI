export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false'
  | 'secure_unsecure'
  | 'grid_choice';

export type DiagnosticDomain =
  | 'Mediální obsah'
  | 'Ověřování informací'
  | 'Bezpečnost a soukromí'
  | 'Digitální nástroje'
  | 'Kritické využití AI';

export interface Question {
  id: number;
  module?: 'Mediální gramotnost' | 'IT Fitness';
  domain: DiagnosticDomain;
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
  consentTimestamp: string;
  startTime: string;
}

export interface DomainScore {
  score: number;
  max: number;
  percentage: number;
}

export interface ScoreBreakdown {
  totalScore: number;
  maxScore: number;
  percentage: number;
  domainScores: Record<DiagnosticDomain, DomainScore>;
}

export interface QuizSubmission {
  respondent: RespondentInfo;
  questionIds: number[];
  answers: Record<number, string | string[]>;
  score: ScoreBreakdown;
  timeSpentSeconds: number;
  completedAt: string;
  encryptedToken: string;
}
