export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://second-project-two-khaki.vercel.app";
}

export function isAdSenseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);
}
