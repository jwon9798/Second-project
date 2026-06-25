import { getSiteUrl } from "@/lib/site";
import seedQuizzes from "@/data/seed-quizzes.json";

export default function robots() {
  const base = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
