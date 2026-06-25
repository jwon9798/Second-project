"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <p className="font-display text-lg font-bold mb-2">
          Clip<span className="text-[#00f5d4]">Quiz</span>
        </p>
        <p className="text-sm text-white/50 mb-4">{t("tagline")}</p>
        <p className="text-xs text-white/30">{t("rights", { year })}</p>
      </div>
    </footer>
  );
}
