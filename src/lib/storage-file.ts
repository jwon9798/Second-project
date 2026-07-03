import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { Quiz, QuizResult } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const QUIZZES_FILE = path.join(DATA_DIR, "quizzes.json");
const RESULTS_FILE = path.join(DATA_DIR, "results.json");
const SEED_PLAYS_FILE = path.join(DATA_DIR, "seed-plays.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getCustomQuizzesFromFile(): Promise<Quiz[]> {
  return readJsonFile<Quiz[]>(QUIZZES_FILE, []);
}

export async function saveQuizToFile(
  quiz: Omit<Quiz, "id" | "playCount" | "createdAt">,
): Promise<Quiz> {
  const custom = await readJsonFile<Quiz[]>(QUIZZES_FILE, []);
  const newQuiz: Quiz = {
    ...quiz,
    id: uuidv4(),
    playCount: 0,
    createdAt: new Date().toISOString(),
  };

  custom.unshift(newQuiz);
  await writeJsonFile(QUIZZES_FILE, custom);
  return newQuiz;
}

export async function incrementCustomPlayCountInFile(quizId: string) {
  const custom = await readJsonFile<Quiz[]>(QUIZZES_FILE, []);
  const index = custom.findIndex((q) => q.id === quizId);
  if (index >= 0) {
    custom[index].playCount += 1;
    await writeJsonFile(QUIZZES_FILE, custom);
  }
}

export async function incrementSeedPlayCountInFile(quizId: string) {
  const plays = await readJsonFile<Record<string, number>>(SEED_PLAYS_FILE, {});
  plays[quizId] = (plays[quizId] ?? 0) + 1;
  await writeJsonFile(SEED_PLAYS_FILE, plays);
}

export async function getSeedPlayCountFromFile(quizId: string): Promise<number> {
  const plays = await readJsonFile<Record<string, number>>(SEED_PLAYS_FILE, {});
  return plays[quizId] ?? 0;
}

export async function getResultsFromFile(quizId?: string): Promise<QuizResult[]> {
  const results = await readJsonFile<QuizResult[]>(RESULTS_FILE, []);
  if (!quizId) return results;
  return results.filter((r) => r.quizId === quizId);
}

export async function saveResultToFile(
  quizId: string,
  score: number,
  total: number,
): Promise<QuizResult> {
  const results = await readJsonFile<QuizResult[]>(RESULTS_FILE, []);
  const result: QuizResult = {
    id: uuidv4(),
    quizId,
    score,
    total,
    createdAt: new Date().toISOString(),
  };

  results.push(result);
  await writeJsonFile(RESULTS_FILE, results);
  return result;
}

export async function setQuizFeaturedInFile(
  quizId: string,
  featured: boolean,
): Promise<void> {
  const custom = await readJsonFile<Quiz[]>(QUIZZES_FILE, []);
  const index = custom.findIndex((q) => q.id === quizId);
  if (index < 0) return;
  custom[index].featured = featured;
  await writeJsonFile(QUIZZES_FILE, custom);
}

export async function deleteQuizFromFile(quizId: string): Promise<void> {
  const custom = await readJsonFile<Quiz[]>(QUIZZES_FILE, []);
  await writeJsonFile(
    QUIZZES_FILE,
    custom.filter((q) => q.id !== quizId),
  );
}
