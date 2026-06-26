"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:items-start">
          <div className="text-center sm:text-left">
            <p className="font-display text-lg font-bold mb-2">
              Clip<span className="text-[#00f5d4]">Quiz</span>
            </p>
            <p className="text-sm text-white/50 max-w-xs">{t("tagline")}</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/50">
            <Link href="/about" className="hover:text-[#00f5d4]">{t("about")}</Link>
            <Link href="/guide" className="hover:text-[#00f5d4]">{t("guide")}</Link>
            <Link href="/faq" className="hover:text-[#00f5d4]">{t("faq")}</Link>
            <Link href="/contact" className="hover:text-[#00f5d4]">{t("contact")}</Link>
            <Link href="/privacy" className="hover:text-[#00f5d4]">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-[#00f5d4]">{t("terms")}</Link>
            <Link href="/guidelines" className="hover:text-[#00f5d4]">{t("guidelines")}</Link>
            <Link href="/copyright" className="hover:text-[#00f5d4]">{t("copyright")}</Link>
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="hover:text-white/70">
              {t("adChoices")}
            </a>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-white/25 max-w-lg mx-auto">{t("disclaimer")}</p>
        <p className="mt-4 text-center text-xs text-white/30">{t("rights", { year })}</p>
      </div>
    </footer>
  );
}
