/** Public AdSense IDs — visible in page source by design */
export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "ca-pub-4911271163170466";

export const ADSENSE_PUBLISHER_ID =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "pub-4911271163170466";

export const GA4_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "G-TRNR6LECH2";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "jwon9798@gmail.com";

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "https://clipquiz.jwonlabs.com";
}

export function isAdSenseEnabled(): boolean {
  return Boolean(ADSENSE_CLIENT_ID);
}

export function isGa4Enabled(): boolean {
  return Boolean(GA4_MEASUREMENT_ID);
}
