"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getScoreLabel } from "@/lib/quiz-utils";
import { motion } from "framer-motion";
import { Share2, RotateCcw, Grid3X3, Trophy, Check } from "lucide-react";

interface ResultScreenProps {
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  percentile: number;
  distribution?: number[];
}

export default function ResultScreen({
  quizId,
  quizTitle,
  score,
  total,
  percentile,
  distribution = [],
}: ResultScreenProps) {
  const t = useTranslations("results");
  const [copied, setCopied] = useState(false);
  const rank = getScoreLabel(score, total);
  const ratio = total > 0 ? score / total : 0;

  const shareText = t("shareText", {
    score,
    total,
    title: quizTitle,
    percent: percentile,
  });

  async function handleShare() {
    const url = window.location.href;
    const text = `${shareText}\n${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "ClipQuiz", text: shareText, url });
        return;
      } catch {
        // fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const maxDist = Math.max(...distribution, 1);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#ff3366] to-[#ff6b35] shadow-xl shadow-pink-500/30">
          <Trophy className="h-10 w-10 text-white" />
        </div>

        <p className="text-sm font-bold uppercase tracking-widest text-[#00f5d4] mb-2">
          {t(`rank.${rank}`)}
        </p>
        <h1 className="font-display text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-5xl font-display font-bold gradient-text mb-1">
          {score}/{total}
        </p>
        <p className="text-white/50">{t("score", { score, total })}</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6 mb-6 text-center"
      >
        <p className="text-sm text-white/50 mb-1">
          {percentile >= 50 ? t("percentile", { percent: percentile }) : t("percentileLow", { percent: percentile })}
        </p>
        <p className="font-display text-4xl font-bold text-[#00f5d4]">
          {percentile >= 50 ? `TOP ${100 - percentile}%` : `${percentile}th`}
        </p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#ff3366] to-[#00f5d4]"
            initial={{ width: 0 }}
            animate={{ width: `${ratio * 100}%` }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
        </div>
      </motion.div>

      {distribution.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <h3 className="text-sm font-semibold text-white/50 mb-4">{t("distribution")}</h3>
          <div className="flex items-end gap-1.5 h-24">
            {distribution.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t bg-gradient-to-t from-[#8b5cf6] to-[#00f5d4] min-h-[4px]"
                  initial={{ height: 0 }}
                  animate={{ height: `${(count / maxDist) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                />
                <span className="text-[10px] text-white/30">{i * 10}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="btn-primary flex items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white"
        >
          {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
          {copied ? t("copied") : t("share")}
        </button>
        <Link
          href={`/quiz/${quizId}`}
          className="btn-secondary flex items-center justify-center gap-2 rounded-xl py-4 text-base font-medium text-white/80"
        >
          <RotateCcw className="h-5 w-5" />
          {t("playAgain")}
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 py-3 text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          <Grid3X3 className="h-4 w-4" />
          {t("browseMore")}
        </Link>
      </div>
    </div>
  );
}
