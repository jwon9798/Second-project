"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import type { Quiz } from "@/lib/types";
import { fetchQuizById } from "@/lib/quizzes-client";
import QuizPlayer from "@/components/QuizPlayer";
import AdSlot from "@/components/ads/AdSlot";
import { Play, Users, Clock } from "lucide-react";

export default function QuizPlayPage() {
  const t = useTranslations("quiz");
  const params = useParams();
  const id = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizById(id)
      .then((data) => {
        setQuiz(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#00f5d4]" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/50">
        Quiz not found
      </div>
    );
  }

  if (questionCount === null) {
    const presets = [5, 10, 15, 20];
    const options = [
      ...presets.filter((n) => n < quiz.questions.length),
      quiz.questions.length,
    ].filter((v, i, arr) => arr.indexOf(v) === i);

    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">{quiz.coverEmoji}</span>
          <h1 className="font-display text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-white/50 mb-4">{quiz.description}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-white/40">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {t("plays", { count: quiz.playCount.toLocaleString() })}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold difficulty-${quiz.difficulty}`}
            >
              {t(`difficulty.${quiz.difficulty}`)}
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-lg font-bold mb-4 text-center">
            {t("selectCount")}
          </h2>
          <div className="flex flex-col gap-3">
            {options.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className="btn-secondary flex items-center justify-between rounded-xl px-5 py-4 text-left hover:border-[#00f5d4]/30 transition-all group"
              >
                <span className="font-medium text-white/80">
                  {count === quiz.questions.length
                    ? t("allQuestions", { count })
                    : t("questions", { count })}
                </span>
                <Play className="h-5 w-5 text-white/30 group-hover:text-[#00f5d4] transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <AdSlot label="quiz" />
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mx-auto max-w-2xl px-4 mb-4 flex items-center gap-3">
        <span className="text-2xl">{quiz.coverEmoji}</span>
        <div>
          <h1 className="font-display font-bold text-lg leading-tight">{quiz.title}</h1>
          <p className="text-xs text-white/40 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t("questions", { count: questionCount })}
          </p>
        </div>
      </div>
      <QuizPlayer quiz={quiz} questionCount={questionCount} />
    </div>
  );
}
