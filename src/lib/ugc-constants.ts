/** Categories blocked for image-based user submissions (copyright risk). */
export const UGC_BLOCKED_CATEGORIES = [
  "movies",
  "anime",
  "memes",
] as const;

export type UgcBlockedCategory = (typeof UGC_BLOCKED_CATEGORIES)[number];
