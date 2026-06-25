"use client";

import { useTranslations } from "next-intl";
import { Image, Crop, Music } from "lucide-react";

export default function ModeShowcase() {
  const t = useTranslations("modes");

  const modes = [
    {
      icon: Image,
      title: t("image.title"),
      desc: t("image.desc"),
      color: "from-[#ff3366] to-[#ff6b35]",
      glow: "shadow-pink-500/20",
    },
    {
      icon: Crop,
      title: t("crop.title"),
      desc: t("crop.desc"),
      color: "from-[#8b5cf6] to-[#6366f1]",
      glow: "shadow-purple-500/20",
    },
    {
      icon: Music,
      title: t("audio.title"),
      desc: t("audio.desc"),
      color: "from-[#00f5d4] to-[#00c4a7]",
      glow: "shadow-cyan-500/20",
    },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display mb-10 text-center text-3xl font-bold sm:text-4xl">
          {t("title")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {modes.map((mode) => (
            <div
              key={mode.title}
              className={`glass-card rounded-2xl p-6 shadow-xl ${mode.glow}`}
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${mode.color}`}
              >
                <mode.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-display mb-2 text-xl font-bold">{mode.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{mode.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
