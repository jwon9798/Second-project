import seedQuizzes from "@/data/seed-quizzes.json";
import seedFlags from "@/data/seed-flags.json";
import seedNature from "@/data/seed-nature.json";
import seedGeo from "@/data/seed-geo.json";
import seedCulture from "@/data/seed-culture.json";
import type { Quiz } from "./types";

export const allSeedQuizzes: Quiz[] = [
  ...(seedQuizzes as Quiz[]),
  ...(seedFlags as Quiz[]),
  ...(seedNature as Quiz[]),
  ...(seedGeo as Quiz[]),
  ...(seedCulture as Quiz[]),
];
