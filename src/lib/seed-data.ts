import seedQuizzes from "@/data/seed-quizzes.json";
import seedQuizzesExtra from "@/data/seed-quizzes-extra.json";
import seedQuizzesSafe from "@/data/seed-quizzes-safe.json";
import { isBlockedSeedQuiz } from "./seed-filter";
import type { Quiz } from "./types";

const rawSeedQuizzes: Quiz[] = [
  ...(seedQuizzes as Quiz[]),
  ...(seedQuizzesExtra as Quiz[]),
  ...(seedQuizzesSafe as Quiz[]),
];

function modestPlayCount(id: string): number {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 1000;
  return 120 + hash;
}

export const allSeedQuizzes: Quiz[] = rawSeedQuizzes
  .filter((quiz) => !isBlockedSeedQuiz(quiz.id))
  .map((quiz) => ({
    ...quiz,
    playCount: modestPlayCount(quiz.id),
  }));
