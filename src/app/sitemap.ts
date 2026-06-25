import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";
import seedQuizzes from "@/data/seed-quizzes.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticPaths = ["", "/create", "/about", "/contact", "/privacy", "/terms"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "daily" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }

    for (const quiz of seedQuizzes) {
      entries.push({
        url: `${base}/${locale}/quiz/${quiz.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
