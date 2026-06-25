import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { Quiz, QuizResult } from "./types";
import seedQuizzes from "@/data/seed-quizzes.json";

const DATA_DIR = path.join(process.cwd(), "data");
const QUIZZES_FILE = path.join(DATA_DIR, "quizzes.json");
const RESULTS_FILE = path.join(DATA_DIR, "results.json");

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

export async function getQuizzes(): Promise<Quiz[]> {
  const custom = await readJsonFile<Quiz[]>(QUIZZES_FILE, []);
  const seed = seedQuizzes as Quiz[];
  const map = new Map<string, Quiz>();

  for (const quiz of seed) {
    map.set(quiz.id, quiz);
  }
  for (const quiz of custom) {
    map.set(quiz.id, quiz);
  }

  return Array.from(map.values());
}

export async function getQuizById(id: string): Promise<Quiz | null> {
  const quizzes = await getQuizzes();
  return quizzes.find((q) => q.id === id) ?? null;
}

export async function saveQuiz(quiz: Omit<Quiz, "id" | "playCount" | "createdAt">) {
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

export async function incrementPlayCount(quizId: string) {
  const custom = await readJsonFile<Quiz[]>(QUIZZES_FILE, []);
  const seed = seedQuizzes as Quiz[];
  const isSeed = seed.some((q) => q.id === quizId);

  if (isSeed) {
    const plays = await readJsonFile<Record<string, number>>(
      path.join(DATA_DIR, "seed-plays.json"),
      {},
    );
    plays[quizId] = (plays[quizId] ?? 0) + 1;
    await writeJsonFile(path.join(DATA_DIR, "seed-plays.json"), plays);
    return;
  }

  const index = custom.findIndex((q) => q.id === quizId);
  if (index >= 0) {
    custom[index].playCount += 1;
    await writeJsonFile(QUIZZES_FILE, custom);
  }
}

export async function getPlayCount(quizId: string, baseCount: number): Promise<number> {
  const plays = await readJsonFile<Record<string, number>>(
    path.join(DATA_DIR, "seed-plays.json"),
    {},
  );
  return baseCount + (plays[quizId] ?? 0);
}

export async function getResults(quizId?: string): Promise<QuizResult[]> {
  const results = await readJsonFile<QuizResult[]>(RESULTS_FILE, []);
  if (!quizId) return results;
  return results.filter((r) => r.quizId === quizId);
}

export async function saveResult(
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
