export type QuestionType = "image" | "crop" | "audio";
export type Difficulty = "easy" | "medium" | "hard";
export type SortOption = "popular" | "newest" | "trending";

export interface Question {
  id: string;
  type: QuestionType;
  imageUrl?: string;
  cropX?: number;
  cropY?: number;
  cropSize?: number;
  youtubeId?: string;
  audioStart?: number;
  audioDuration?: number;
  answers: string[];
  hint?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  tags: string[];
  questions: Question[];
  creator: string;
  playCount: number;
  createdAt: string;
  coverEmoji: string;
  difficulty: Difficulty;
  featured?: boolean;
}

export interface QuizResult {
  id: string;
  quizId: string;
  score: number;
  total: number;
  createdAt: string;
}

export interface QuizStats {
  totalPlays: number;
  averageScore: number;
  distribution: number[];
}
