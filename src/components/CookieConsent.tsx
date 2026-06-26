"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { setConsent } from "@/lib/consent";

export default function CookieConsent() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("clipquiz_cookie_consent");
    if (!stored) setVisible(true);
  }, []);

  if (!visible) return null;

  function choose(value: "accepted" | "rejected") {
    setConsent(value);
    setVisible(false);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-[#0a0b14]/95 p-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-white/70">
          {t("message")}{" "}
          <Link href="/privacy" className="text-[#00f5d4] underline underline-offset-2">
            {t("privacyLink")}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="btn-secondary rounded-xl px-5 py-2.5 text-sm font-medium text-white/70"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
