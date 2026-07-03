import { allSeedQuizzes } from "@/lib/seed-data";
import { isSupabaseConfigured } from "./supabase/admin";
import type { Quiz, QuizResult } from "./types";
import * as fileStorage from "./storage-file";
import * as supabaseStorage from "./storage-supabase";

const seed = allSeedQuizzes;

function isSeedQuizId(quizId: string): boolean {
  return seed.some((q) => q.id === quizId);
}

function mergeQuizzes(custom: Quiz[]): Quiz[] {
  const map = new Map<string, Quiz>();

  for (const quiz of seed) {
    map.set(quiz.id, quiz);
  }
  for (const quiz of custom) {
    map.set(quiz.id, quiz);
  }

  return Array.from(map.values());
}

export function getStorageBackend(): "supabase" | "file" {
  return isSupabaseConfigured() ? "supabase" : "file";
}

function isPublicCustomQuiz(quiz: Quiz): boolean {
  return quiz.featured === true;
}

export async function getQuizzes(): Promise<Quiz[]> {
  const custom = isSupabaseConfigured()
    ? await supabaseStorage.getCustomQuizzesFromSupabase()
    : await fileStorage.getCustomQuizzesFromFile();

  return mergeQuizzes(custom.filter(isPublicCustomQuiz));
}

export async function getQuizById(id: string): Promise<Quiz | null> {
  const seedQuiz = seed.find((q) => q.id === id);
  if (seedQuiz) return seedQuiz;

  if (isSupabaseConfigured()) {
    return supabaseStorage.getCustomQuizByIdFromSupabase(id);
  }

  const custom = await fileStorage.getCustomQuizzesFromFile();
  return custom.find((q) => q.id === id) ?? null;
}

export async function saveQuiz(quiz: Omit<Quiz, "id" | "playCount" | "createdAt">) {
  const publishedQuiz = { ...quiz, featured: true };
  if (isSupabaseConfigured()) {
    return supabaseStorage.saveQuizToSupabase(publishedQuiz);
  }
  return fileStorage.saveQuizToFile(publishedQuiz);
}

export async function incrementPlayCount(quizId: string) {
  if (isSeedQuizId(quizId)) {
    if (isSupabaseConfigured()) {
      await supabaseStorage.incrementSeedPlayCountInSupabase(quizId);
    } else {
      await fileStorage.incrementSeedPlayCountInFile(quizId);
    }
    return;
  }

  if (isSupabaseConfigured()) {
    await supabaseStorage.incrementCustomPlayCountInSupabase(quizId);
  } else {
    await fileStorage.incrementCustomPlayCountInFile(quizId);
  }
}

export async function getPlayCount(quizId: string, baseCount: number): Promise<number> {
  const extra = isSupabaseConfigured()
    ? await supabaseStorage.getSeedPlayCountFromSupabase(quizId)
    : await fileStorage.getSeedPlayCountFromFile(quizId);

  if (isSeedQuizId(quizId)) {
    return baseCount + extra;
  }

  if (isSupabaseConfigured()) {
    const quiz = await supabaseStorage.getCustomQuizByIdFromSupabase(quizId);
    return quiz?.playCount ?? baseCount;
  }

  const custom = await fileStorage.getCustomQuizzesFromFile();
  const quiz = custom.find((q) => q.id === quizId);
  return quiz?.playCount ?? baseCount;
}

export async function getResults(quizId?: string): Promise<QuizResult[]> {
  if (isSupabaseConfigured()) {
    return supabaseStorage.getResultsFromSupabase(quizId);
  }
  return fileStorage.getResultsFromFile(quizId);
}

export async function saveResult(
  quizId: string,
  score: number,
  total: number,
): Promise<QuizResult> {
  if (isSupabaseConfigured()) {
    return supabaseStorage.saveResultToSupabase(quizId, score, total);
  }
  return fileStorage.saveResultToFile(quizId, score, total);
}

export async function countReportsForQuiz(quizId: string): Promise<{
  total: number;
  hasCopyrightReport: boolean;
}> {
  if (isSupabaseConfigured()) {
    return supabaseStorage.countReportsForQuizInSupabase(quizId);
  }
  return { total: 0, hasCopyrightReport: false };
}

export async function hideQuiz(quizId: string): Promise<void> {
  if (isSeedQuizId(quizId)) return;
  if (isSupabaseConfigured()) {
    await supabaseStorage.setQuizFeaturedInSupabase(quizId, false);
  } else {
    await fileStorage.setQuizFeaturedInFile(quizId, false);
  }
}

export async function deleteQuiz(quizId: string): Promise<void> {
  if (isSeedQuizId(quizId)) return;
  if (isSupabaseConfigured()) {
    await supabaseStorage.deleteQuizFromSupabase(quizId);
  } else {
    await fileStorage.deleteQuizFromFile(quizId);
  }
}
