export type ConsentValue = "accepted" | "rejected" | null;

const CONSENT_KEY = "clipquiz_cookie_consent";

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

export function setConsent(value: "accepted" | "rejected") {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("clipquiz-consent-change", { detail: value }));
}

export function hasAdConsent(): boolean {
  return getConsent() === "accepted";
}
