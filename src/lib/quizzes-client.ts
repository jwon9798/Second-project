import { allSeedQuizzes } from "@/lib/seed-data";
import type { Quiz, QuizResult } from "./types";
import { calculatePercentile } from "./quiz-utils";

const QUIZZES_KEY = "clipquiz_custom_quizzes";

function getCustomQuizzes(): Quiz[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUIZZES_KEY) ?? "[]") as Quiz[];
  } catch {
    return [];
  }
}

export function getAllQuizzes(): Quiz[] {
  const map = new Map<string, Quiz>();
  for (const quiz of allSeedQuizzes) {
    map.set(quiz.id, quiz);
  }
  for (const quiz of getCustomQuizzes()) {
    map.set(quiz.id, quiz);
  }
  return Array.from(map.values());
}

export function getQuizById(id: string): Quiz | null {
  return getAllQuizzes().find((q) => q.id === id) ?? null;
}

export function saveCustomQuiz(quiz: Quiz) {
  const custom = getCustomQuizzes();
  custom.unshift(quiz);
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(custom));
}

function getStoredResults(quizId: string): QuizResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      localStorage.getItem(`clipquiz_results_${quizId}`) ?? "[]",
    ) as QuizResult[];
  } catch {
    return [];
  }
}

export function saveQuizResult(quizId: string, score: number, total: number) {
  const results = getStoredResults(quizId);
  const entry: QuizResult = {
    id: `${Date.now()}`,
    quizId,
    score,
    total,
    createdAt: new Date().toISOString(),
  };
  results.push(entry);
  localStorage.setItem(`clipquiz_results_${quizId}`, JSON.stringify(results));
  return {
    percentile: calculatePercentile(score, total, results),
    distribution: getDistribution(results),
  };
}

function getDistribution(results: QuizResult[], buckets = 10): number[] {
  const distribution = Array.from({ length: buckets }, () => 0);
  for (const result of results) {
    const pct = result.total > 0 ? result.score / result.total : 0;
    const index = Math.min(buckets - 1, Math.floor(pct * buckets));
    distribution[index] += 1;
  }
  return distribution;
}

export async function fetchQuizzes(): Promise<Quiz[]> {
  try {
    const res = await fetch("/api/quizzes?sort=trending");
    if (res.ok) return res.json();
  } catch {
    // API unavailable on static/Vercel misconfig — use local data
  }
  return getAllQuizzes().sort((a, b) => b.playCount - a.playCount);
}

export async function fetchQuizById(id: string): Promise<Quiz | null> {
  try {
    const res = await fetch(`/api/quizzes/${id}`);
    if (res.ok) return res.json();
  } catch {
    // fallback below
  }
  return getQuizById(id);
}
