/** Seed quizzes excluded from the public catalog due to copyright/trademark risk. */
export const BLOCKED_SEED_QUIZ_IDS = new Set([
  "pop-hits-2010s",
  "kpop-hits-global",
  "disney-classics-ost",
  "british-rock-legends",
  "latin-pop-global",
  "90s-hits-anthems",
  "tiktok-viral-hits",
  "christmas-songs-global",
  "edm-party-hits",
  "taylor-swift-era",
  "movie-posters-icons",
  "netflix-hit-shows",
  "marvel-heroes",
  "harry-potter-magic",
  "star-wars-galaxy",
  "pixar-magic",
  "hollywood-legends",
  "pokemon-gen1",
  "anime-crop-hard",
  "gaming-icons",
  "meme-internet-culture",
  "fast-food-logos",
  "tech-logos-crop",
  "luxury-car-brands",
  "football-clubs-world",
  "nba-teams",
  "sports-logos-crop",
  "sneaker-brands-crop",
  "variety-mixed-mega",
]);

export function isBlockedSeedQuiz(id: string): boolean {
  return BLOCKED_SEED_QUIZ_IDS.has(id);
}
