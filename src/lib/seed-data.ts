import seedQuizzes from "@/data/seed-quizzes.json";
import seedQuizzesExtra from "@/data/seed-quizzes-extra.json";
import type { Quiz } from "./types";

export const allSeedQuizzes: Quiz[] = [
  ...(seedQuizzes as Quiz[]),
  ...(seedQuizzesExtra as Quiz[]),
];
