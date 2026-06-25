"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const legal = [
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
    { href: "/privacy", label: t("privacy") },
    { href: "/terms", label: t("terms") },
  ];

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
            {legal.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[#00f5d4] transition-colors">
                {item.label}
              </Link>
            ))}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              {t("adChoices")}
            </a>
          </nav>
        </div>

        <p className="mt-8 text-center text-xs text-white/30">{t("rights", { year })}</p>
      </div>
    </footer>
  );
}
