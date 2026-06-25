"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { fetchQuizzes } from "@/lib/quizzes-client";
import QuizCard from "@/components/QuizCard";
import ModeShowcase from "@/components/ModeShowcase";
import HowItWorks from "@/components/HowItWorks";
import { motion } from "framer-motion";
import { Play, Plus, Search, TrendingUp } from "lucide-react";

export default function HomePage() {
  const t = useTranslations();
  const [quizzes, setQuizzes] = useState<Awaited<ReturnType<typeof fetchQuizzes>>>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes()
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const featured = quizzes.filter((q) => q.featured);
  const categories = Array.from(
    new Set(quizzes.map((q) => q.category.toLowerCase())),
  ).sort();
  const filtered = quizzes.filter((q) => {
    const matchesSearch =
      !search ||
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      !category || q.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ff3366]/30 bg-[#ff3366]/10 px-4 py-1.5 text-sm font-medium text-[#ff6b9d] mb-6">
              <TrendingUp className="h-4 w-4" />
              {t("hero.badge")}
            </span>

            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight mb-4">
              {t("hero.title")}
              <br />
              <span className="gradient-text">{t("hero.titleAccent")}</span>
            </h1>

            <p className="mx-auto max-w-xl text-lg text-white/50 mb-8 leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link
                href="#trending"
                className="btn-primary flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white w-full sm:w-auto justify-center"
              >
                <Play className="h-5 w-5 fill-current" />
                {t("hero.cta")}
              </Link>
              <Link
                href="/create"
                className="btn-secondary flex items-center gap-2 rounded-xl px-8 py-4 text-base font-medium text-white/80 w-full sm:w-auto justify-center"
              >
                <Plus className="h-5 w-5" />
                {t("hero.ctaSecondary")}
              </Link>
            </div>

            <div className="flex justify-center">
              <div className="text-center">
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {loading ? "…" : quizzes.length}
                </p>
                <p className="text-xs text-white/40 mt-1">{t("hero.stats.quizzes")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ModeShowcase />

      <section id="trending" className="py-16 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-3xl font-bold flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              {t("quiz.trending")}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("quiz.search")}
                className="input-field rounded-xl pl-10 pr-4 py-2.5 text-sm text-white w-full sm:w-64"
              />
            </div>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                type="button"
                onClick={() => setCategory(null)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  category === null
                    ? "bg-[#ff3366]/20 text-[#ff6b9d] border border-[#ff3366]/30"
                    : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20"
                }`}
              >
                {t("quiz.allCategories")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    category === cat
                      ? "bg-[#00f5d4]/20 text-[#00f5d4] border border-[#00f5d4]/30"
                      : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl h-52 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-white/40 py-12">{t("quiz.noResults")}</p>
          ) : (
            <>
              {featured.length > 0 && !search && !category && (
                <div className="mb-10">
                  <h3 className="text-sm font-semibold text-[#00f5d4] uppercase tracking-wider mb-4">
                    {t("quiz.featured")}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {featured.map((quiz, i) => (
                      <QuizCard key={quiz.id} quiz={quiz} index={i} />
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
                {t("quiz.all")}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((quiz, i) => (
                  <QuizCard key={quiz.id} quiz={quiz} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <HowItWorks />
    </>
  );
}
