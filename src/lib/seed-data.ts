import seedQuizzes from "@/data/seed-quizzes.json";
import seedQuizzesExtra from "@/data/seed-quizzes-extra.json";
import seedQuizzesSafe from "@/data/seed-quizzes-safe.json";
import seedFlags from "@/data/seed-flags.json";
import seedNature from "@/data/seed-nature.json";
import seedGeo from "@/data/seed-geo.json";
import seedCulture from "@/data/seed-culture.json";
import seedFood from "@/data/seed-food.json";
import { isBlockedSeedQuiz } from "./seed-filter";
import type { Quiz } from "./types";

/** Later sources override earlier ones when IDs collide. */
const SEED_SOURCES: Quiz[][] = [
  seedQuizzes as Quiz[],
  seedQuizzesExtra as Quiz[],
  seedQuizzesSafe as Quiz[],
  seedFlags as Quiz[],
  seedNature as Quiz[],
  seedGeo as Quiz[],
  seedCulture as Quiz[],
  seedFood as Quiz[],
];

function mergeSeedQuizzes(sources: Quiz[][]): Quiz[] {
  const map = new Map<string, Quiz>();
  for (const list of sources) {
    for (const quiz of list) {
      map.set(quiz.id, quiz);
    }
  }
  return Array.from(map.values());
}

function modestPlayCount(id: string): number {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 1000;
  return 120 + hash;
}

export const allSeedQuizzes: Quiz[] = mergeSeedQuizzes(SEED_SOURCES)
  .filter((quiz) => !isBlockedSeedQuiz(quiz.id))
  .map((quiz) => ({
    ...quiz,
    playCount: modestPlayCount(quiz.id),
  }));
