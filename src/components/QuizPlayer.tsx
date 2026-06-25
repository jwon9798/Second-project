"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Quiz, Question } from "@/lib/types";
import { checkAnswer, shuffleQuestions } from "@/lib/quiz-utils";
import QuestionDisplay from "./QuestionDisplay";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, Lightbulb } from "lucide-react";

interface QuizPlayerProps {
  quiz: Quiz;
  questionCount: number;
}

type Feedback = "correct" | "wrong" | null;

export default function QuizPlayer({ quiz, questionCount }: QuizPlayerProps) {
  const t = useTranslations("quiz");
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showHint, setShowHint] = useState(false);
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setQuestions(shuffleQuestions(quiz.questions, questionCount));
    fetch(`/api/quizzes/${quiz.id}`, { method: "POST" }).catch(() => {});
  }, [quiz, questionCount]);

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleSubmit = useCallback(() => {
    if (!current || feedback) return;

    const trimmed = answer.trim();
    if (!trimmed) return;

    const isCorrect = checkAnswer(trimmed, current.answers);
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    } else {
      setRevealedAnswer(current.answers[0]);
    }
  }, [answer, current, feedback]);

  const handleNext = useCallback(async () => {
    if (isLast) {
      setSubmitting(true);
      try {
        const finalScore = scoreRef.current;
        const res = await fetch(`/api/quizzes/${quiz.id}/results`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: finalScore, total: questions.length }),
        });

        let percentile = 50;
        let distribution: number[] = [];

        if (res.ok) {
          const data = await res.json();
          percentile = data.percentile;
          distribution = data.distribution;
        }

        const params = new URLSearchParams({
          score: String(finalScore),
          total: String(questions.length),
          percentile: String(percentile),
          distribution: JSON.stringify(distribution),
        });
        router.push(`/quiz/${quiz.id}/results?${params.toString()}`);
      } catch {
        router.push(
          `/quiz/${quiz.id}/results?score=${scoreRef.current}&total=${questions.length}&percentile=50`,
        );
      }
      return;
    }

    setCurrentIndex((i) => i + 1);
    setAnswer("");
    setFeedback(null);
    setShowHint(false);
    setRevealedAnswer(null);
  }, [isLast, quiz.id, questions.length, router]);

  const handleSkip = () => {
    setFeedback("wrong");
    setRevealedAnswer(current?.answers[0] ?? null);
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") {
        if (feedback) handleNext();
        else handleSubmit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feedback, handleSubmit, handleNext]);

  if (!current) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#00f5d4]" />
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto px-4 py-8 ${feedback === "correct" ? "correct-flash" : ""} ${feedback === "wrong" ? "wrong-shake" : ""}`}>
      <div className="mb-6 flex items-center justify-between text-sm text-white/50">
        <span>{t("question", { current: currentIndex + 1, total: questions.length })}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i < currentIndex
                  ? "bg-[#00f5d4]"
                  : i === currentIndex
                    ? "bg-[#ff3366]"
                    : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <QuestionDisplay question={current} />

          {current.hint && !feedback && (
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="mt-4 flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors mx-auto"
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? current.hint : "?"}
            </button>
          )}

          <div className="mt-8">
            {!feedback ? (
              <>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={t("typeAnswer")}
                  className="input-field w-full rounded-xl px-5 py-4 text-lg text-white placeholder:text-white/30"
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!answer.trim()}
                    className="btn-primary flex-1 rounded-xl py-4 text-base font-bold text-white disabled:opacity-40"
                  >
                    {t("submit")}
                  </button>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="btn-secondary rounded-xl px-6 py-4 text-sm font-medium text-white/60"
                  >
                    {t("skip")}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div
                  className={`mb-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-lg font-bold ${
                    feedback === "correct"
                      ? "bg-[#00f5d4]/20 text-[#00f5d4]"
                      : "bg-[#ff3366]/20 text-[#ff3366]"
                  }`}
                >
                  {feedback === "correct" ? (
                    <><Check className="h-5 w-5" /> {t("correct")}</>
                  ) : (
                    <><X className="h-5 w-5" /> {t("wrong")}</>
                  )}
                </div>

                {revealedAnswer && (
                  <p className="mb-6 text-white/60">
                    {t("theAnswerWas")}: <strong className="text-white">{revealedAnswer}</strong>
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={submitting}
                  className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white"
                >
                  {isLast ? t("seeResults") : t("next")}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
