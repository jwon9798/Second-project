import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { allSeedQuizzes } from "@/lib/seed-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const paths = [
    "",
    "/create",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/faq",
    "/guidelines",
    "/copyright",
    "/guide",
  ];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of paths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "daily" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const quiz of allSeedQuizzes) {
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
