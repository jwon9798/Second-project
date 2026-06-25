"use client";

import { useTranslations } from "next-intl";
import { Search, MousePointerClick, Trophy } from "lucide-react";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    { icon: Search, title: t("step1.title"), desc: t("step1.desc"), num: "01" },
    { icon: MousePointerClick, title: t("step2.title"), desc: t("step2.desc"), num: "02" },
    { icon: Trophy, title: t("step3.title"), desc: t("step3.desc"), num: "03" },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display mb-12 text-center text-3xl font-bold sm:text-4xl">
          {t("title")}
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="relative text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <step.icon className="h-7 w-7 text-[#00f5d4]" />
              </div>
              <span className="font-display text-5xl font-bold text-white/5 absolute top-0 right-4 sm:right-8">
                {step.num}
              </span>
              <h3 className="font-display mb-2 text-lg font-bold">{step.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
