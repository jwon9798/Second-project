"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { Plus, Zap } from "lucide-react";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home") },
    { href: "/#trending", label: t("trending") },
    { href: "/#how-it-works", label: t("howItWorks") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#07080f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff3366] to-[#ff6b35] shadow-lg shadow-pink-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Clip<span className="text-[#00f5d4]">Quiz</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-white bg-white/8"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <Link
            href="/create"
            className="btn-primary hidden sm:flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            {t("create")}
          </Link>
          <Link
            href="/create"
            className="btn-primary flex sm:hidden h-10 w-10 items-center justify-center rounded-xl"
            aria-label={t("create")}
          >
            <Plus className="h-5 w-5 text-white" />
          </Link>
        </div>
      </div>
    </header>
  );
}
