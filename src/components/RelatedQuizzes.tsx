"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { fetchQuizzes } from "@/lib/quizzes-client";
import type { Quiz } from "@/lib/types";
import QuizCard from "./QuizCard";

interface RelatedQuizzesProps {
  currentId: string;
  category?: string;
}

export default function RelatedQuizzes({ currentId, category }: RelatedQuizzesProps) {
  const t = useTranslations("results");
  const [related, setRelated] = useState<Quiz[]>([]);

  useEffect(() => {
    fetchQuizzes()
      .then((all) => {
        setRelated(
          all
            .filter((q) => q.id !== currentId)
            .sort((a, b) => {
              const am = category && a.category === category ? 1 : 0;
              const bm = category && b.category === category ? 1 : 0;
              return bm - am || b.playCount - a.playCount;
            })
            .slice(0, 3),
        );
      })
      .catch(() => {});
  }, [currentId, category]);

  if (!related.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 border-t border-white/5">
      <h2 className="font-display mb-6 text-center text-2xl font-bold">{t("relatedTitle")}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((quiz, i) => (
          <QuizCard key={quiz.id} quiz={quiz} index={i} />
        ))}
      </div>
      <p className="mt-6 text-center">
        <Link href="/#trending" className="text-sm font-semibold text-[#00f5d4] hover:underline">
          {t("browseMore")} →
        </Link>
      </p>
    </section>
  );
}
