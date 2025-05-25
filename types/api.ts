// Types for the Quiz API response
export interface QuizQuestion {
  is_correct: boolean;
  stimulus: string;
  order: number;
  user_answers: string[];
  feedback: string;
}

export interface QuizRound {
  round_title: string;
  order: number;
  questions: QuizQuestion[];
}

export interface Activity {
  activity_name: string;
  order: number;
  questions: (QuizQuestion | QuizRound)[];
}

export interface QuizApiResponse {
  name: string;
  heading: string;
  activities: Activity[];
}

// Helper type guard to distinguish between QuizQuestion and QuizRound
export function isQuizRound(item: QuizQuestion | QuizRound): item is QuizRound {
  return (item as QuizRound).round_title !== undefined;
}

// Helper types for the quiz state
export interface QuizState {
  currentActivity: number;
  currentQuestion: number;
  currentRound: number;
  answers: Record<string, boolean>;
  isComplete: boolean;
  score: number;
}

export type UserAnswer = boolean;