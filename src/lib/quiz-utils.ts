import type { CSSProperties } from "react";
import type { Question, QuestionType, QuizResult } from "./types";

export function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['']/g, "'")
    .replace(/[^a-z0-9가-힣ぁ-んァ-ン一-龯\s']/g, "")
    .replace(/\s+/g, " ");
}

export function checkAnswer(input: string, accepted: string[]): boolean {
  const normalized = normalizeAnswer(input);
  if (!normalized) return false;

  return accepted.some((answer) => {
    const target = normalizeAnswer(answer);
    if (!target) return false;
    if (normalized === target) return true;
    if (normalized.replace(/\s/g, "") === target.replace(/\s/g, "")) return true;
    return false;
  });
}

export function calculatePercentile(
  score: number,
  total: number,
  results: QuizResult[],
): number {
  if (results.length === 0) return 100;

  const percentages = results.map((r) =>
    r.total > 0 ? (r.score / r.total) * 100 : 0,
  );
  const myPercent = total > 0 ? (score / total) * 100 : 0;

  const below = percentages.filter((p) => p < myPercent).length;
  const equal = percentages.filter((p) => p === myPercent).length;

  return Math.round(((below + equal * 0.5) / percentages.length) * 100);
}

export function getScoreDistribution(
  results: QuizResult[],
  buckets = 10,
): number[] {
  const distribution = Array.from({ length: buckets }, () => 0);

  for (const result of results) {
    const pct = result.total > 0 ? result.score / result.total : 0;
    const index = Math.min(buckets - 1, Math.floor(pct * buckets));
    distribution[index] += 1;
  }

  return distribution;
}

export function getScoreLabel(
  score: number,
  total: number,
): "legendary" | "elite" | "solid" | "rookie" {
  const ratio = total > 0 ? score / total : 0;
  if (ratio >= 0.9) return "legendary";
  if (ratio >= 0.7) return "elite";
  if (ratio >= 0.5) return "solid";
  return "rookie";
}

export function getQuizQuestionTypes(quiz: { questions: Question[] }): QuestionType[] {
  const types = new Set<QuestionType>();
  for (const q of quiz.questions) {
    types.add(q.type);
  }
  const order: QuestionType[] = ["image", "crop", "audio"];
  return order.filter((t) => types.has(t));
}

export const MAX_ANSWERS_PER_QUESTION = 5;

export function shuffleQuestions<T extends { id: string }>(
  items: T[],
  count: number,
): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

export function getYoutubeEmbedUrl(question: Question): string | null {
  if (!question.youtubeId) return null;
  const start = question.audioStart ?? 0;
  return `https://www.youtube.com/embed/${question.youtubeId}?start=${start}&autoplay=1&controls=0&modestbranding=1&rel=0`;
}

export function getCropStyle(question: Question): CSSProperties {
  const size = question.cropSize ?? 25;
  const x = question.cropX ?? 50;
  const y = question.cropY ?? 50;

  return {
    objectPosition: `${x}% ${y}%`,
    transform: `scale(${100 / size})`,
    transformOrigin: `${x}% ${y}%`,
  };
}
