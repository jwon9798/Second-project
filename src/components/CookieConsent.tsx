"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { isAdSenseConfigured } from "@/lib/site";

const CONSENT_KEY = "clipquiz_cookie_consent";

export default function CookieConsent() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-[#0a0b14]/95 p-4 backdrop-blur-xl sm:p-5">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-white/70">
          {isAdSenseConfigured() ? t("messageAds") : t("message")}
          {" "}
          <Link href="/privacy" className="text-[#00f5d4] underline underline-offset-2">
            {t("privacyLink")}
          </Link>
        </p>
        <button
          type="button"
          onClick={accept}
          className="btn-primary shrink-0 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
