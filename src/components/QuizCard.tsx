"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Quiz } from "@/lib/types";
import { getQuizQuestionTypes } from "@/lib/quiz-utils";
import { Image, Crop, Music, Play, Users } from "lucide-react";
import { motion } from "framer-motion";

const MODE_ICONS = { image: Image, crop: Crop, audio: Music } as const;

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

interface QuizCardProps {
  quiz: Quiz;
  index?: number;
}

export default function QuizCard({ quiz, index = 0 }: QuizCardProps) {
  const t = useTranslations("quiz");
  const modes = getQuizQuestionTypes(quiz);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        href={`/quiz/${quiz.id}`}
        className="glass-card group flex flex-col rounded-2xl p-5 transition-all hover:border-white/15 hover:bg-white/[0.06] hover:-translate-y-0.5"
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl">
            {quiz.coverEmoji}
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold difficulty-${quiz.difficulty}`}>
            {t(`difficulty.${quiz.difficulty}`)}
          </span>
        </div>

        <h3 className="font-display mb-1 text-lg font-bold leading-snug group-hover:text-[#00f5d4] transition-colors">
          {quiz.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-white/50">{quiz.description}</p>

        <div className="mt-auto flex items-center justify-between text-xs text-white/40">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              {modes.map((mode) => {
                const Icon = MODE_ICONS[mode];
                return (
                  <span key={mode} title={t(`modes.${mode}`)}>
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                );
              })}
              {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)}
            </span>
            <span>{t("questions", { count: quiz.questions.length })}</span>
          </div>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {formatCount(quiz.playCount)}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-sm font-semibold text-white/80 group-hover:bg-[#ff3366]/20 group-hover:text-[#ff6b9d] transition-all">
          <Play className="h-4 w-4 fill-current" />
          {t("play")}
        </div>
      </Link>
    </motion.div>
  );
}
