/** Categories blocked for user submissions (copyright risk). */
export const UGC_BLOCKED_CATEGORIES = [
  "music",
  "movies",
  "anime",
  "memes",
] as const;

export type UgcBlockedCategory = (typeof UGC_BLOCKED_CATEGORIES)[number];
