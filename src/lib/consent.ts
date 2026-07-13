export type ConsentValue = "accepted" | "rejected" | null;

const CONSENT_KEY = "clipquiz_cookie_consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

import { isAdSenseEnabled } from "@/lib/site";

function updateGoogleConsent(value: "accepted" | "rejected") {
  if (typeof window === "undefined") return;
  const granted = value === "accepted" ? "granted" : "denied";
  const update: Record<string, string> = {
    analytics_storage: granted,
  };
  if (isAdSenseEnabled()) {
    update.ad_storage = granted;
    update.ad_user_data = granted;
    update.ad_personalization = granted;
  }
  window.gtag?.("consent", "update", update);
}

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

export function setConsent(value: "accepted" | "rejected") {
  localStorage.setItem(CONSENT_KEY, value);
  updateGoogleConsent(value);
  window.dispatchEvent(new CustomEvent("clipquiz-consent-change", { detail: value }));
}

export function hasAdConsent(): boolean {
  return getConsent() === "accepted";
}

export function syncConsentOnLoad() {
  const stored = getConsent();
  if (stored) updateGoogleConsent(stored);
}
