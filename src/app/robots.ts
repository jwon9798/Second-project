import { getSiteUrl } from "@/lib/site";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
