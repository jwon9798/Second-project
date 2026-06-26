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

export const allSeedQuizzes: Quiz[] = rawSeedQuizzes.filter(
  (quiz) => !isBlockedSeedQuiz(quiz.id),
);
