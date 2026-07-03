export type ConsentValue = "accepted" | "rejected" | null;

const CONSENT_KEY = "clipquiz_cookie_consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function updateGoogleConsent(value: "accepted" | "rejected") {
  if (typeof window === "undefined") return;
  const granted = value === "accepted" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
    analytics_storage: granted,
  });
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
