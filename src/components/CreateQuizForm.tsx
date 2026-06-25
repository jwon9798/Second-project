"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { saveCustomQuiz } from "@/lib/quizzes-client";
import { MAX_ANSWERS_PER_QUESTION } from "@/lib/quiz-utils";
import type { Difficulty, QuestionType, Quiz } from "@/lib/types";
import { Image, Crop, Music, Plus, Trash2, Eye } from "lucide-react";
import QuestionDisplay from "./QuestionDisplay";

interface DraftQuestion {
  type: QuestionType;
  imageUrl: string;
  cropX: number;
  cropY: number;
  cropSize: number;
  youtubeId: string;
  audioStart: number;
  answers: string;
  hint: string;
}

const emptyQuestion = (): DraftQuestion => ({
  type: "image",
  imageUrl: "",
  cropX: 50,
  cropY: 50,
  cropSize: 25,
  youtubeId: "",
  audioStart: 0,
  answers: "",
  hint: "",
});

function extractYoutubeId(url: string): string {
  if (!url) return "";
  if (url.length === 11 && !url.includes("/")) return url;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match?.[1] ?? url;
}

export default function CreateQuizForm() {
  const t = useTranslations("create");
  const locale = useLocale();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("gaming");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [creator, setCreator] = useState("");
  const [coverEmoji, setCoverEmoji] = useState("🎯");
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    emptyQuestion(),
    emptyQuestion(),
    emptyQuestion(),
  ]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ id: string } | null>(null);

  const categories = [
    "music", "gaming", "anime", "movies", "sports",
    "food", "geography", "travel", "variety", "nature", "memes", "other",
  ] as const;

  function parseAnswers(raw: string): string[] {
    return raw.split("\n").map((a) => a.trim()).filter(Boolean).slice(0, MAX_ANSWERS_PER_QUESTION);
  }

  function updateQuestion(index: number, patch: Partial<DraftQuestion>) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(index: number) {
    if (questions.length <= 3) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function toApiQuestion(q: DraftQuestion, index: number) {
    const base = {
      type: q.type,
      answers: parseAnswers(q.answers),
      hint: q.hint || undefined,
    };

    if (q.type === "audio") {
      return {
        ...base,
        youtubeId: extractYoutubeId(q.youtubeId),
        audioStart: q.audioStart,
        audioDuration: 8,
      };
    }

    return {
      ...base,
      imageUrl: q.imageUrl,
      ...(q.type === "crop"
        ? { cropX: q.cropX, cropY: q.cropY, cropSize: q.cropSize }
        : {}),
    };
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (questions.length < 3) {
      setError(t("minQuestions"));
      return;
    }

    setPublishing(true);
    const payload = {
      title,
      description,
      category,
      language: locale,
      tags: [category],
      creator,
      coverEmoji,
      difficulty,
      questions: questions.map((q, i) => ({
        ...toApiQuestion(q, i),
        id: `q-${i}-${Date.now()}`,
      })),
    };

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const quiz = await res.json();
        setSuccess({ id: quiz.id });
        return;
      }
    } catch {
      // API unavailable — save locally
    } finally {
      setPublishing(false);
    }

    const localQuiz: Quiz = {
      ...payload,
      id: `local-${Date.now()}`,
      playCount: 0,
      createdAt: new Date().toISOString(),
    };
    saveCustomQuiz(localQuiz);
    setSuccess({ id: localQuiz.id });
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-display text-3xl font-bold mb-2">{t("success")}</h2>
        <p className="text-white/50 mb-8">{t("successDesc")}</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push(`/quiz/${success.id}`)}
            className="btn-primary rounded-xl py-4 font-bold text-white"
          >
            {t("viewQuiz")}
          </button>
          <button
            type="button"
            onClick={() => {
              setSuccess(null);
              setTitle("");
              setDescription("");
              setQuestions([emptyQuestion(), emptyQuestion(), emptyQuestion()]);
            }}
            className="btn-secondary rounded-xl py-4 font-medium text-white/70"
          >
            {t("createAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handlePublish} className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-white/50">{t("subtitle")}</p>
        <p className="mt-2 text-xs text-[#00f5d4]">{t("loginNote")}</p>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">{t("quizTitle")}</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("quizTitlePlaceholder")}
              className="input-field w-full rounded-xl px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Emoji</label>
            <input
              value={coverEmoji}
              onChange={(e) => setCoverEmoji(e.target.value)}
              className="input-field w-full rounded-xl px-4 py-3 text-2xl text-center"
              maxLength={4}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">{t("description")}</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("descriptionPlaceholder")}
            rows={2}
            className="input-field w-full rounded-xl px-4 py-3 text-white resize-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">{t("category")}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field w-full rounded-xl px-4 py-3 text-white"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#12131f]">
                  {t(`categories.${c}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">{t("difficulty")}</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="input-field w-full rounded-xl px-4 py-3 text-white"
            >
              <option value="easy" className="bg-[#12131f]">Easy</option>
              <option value="medium" className="bg-[#12131f]">Medium</option>
              <option value="hard" className="bg-[#12131f]">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">{t("creatorName")}</label>
            <input
              required
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              placeholder={t("creatorPlaceholder")}
              className="input-field w-full rounded-xl px-4 py-3 text-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {questions.map((q, index) => (
          <div key={index} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-white/80">Q{index + 1}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewIndex(previewIndex === index ? null : index)}
                  className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                </button>
                {questions.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="rounded-lg p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              {(["image", "crop", "audio"] as QuestionType[]).map((type) => {
                const Icon = type === "image" ? Image : type === "crop" ? Crop : Music;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateQuestion(index, { type })}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      q.type === type
                        ? "bg-[#ff3366]/20 text-[#ff6b9d] border border-[#ff3366]/30"
                        : "bg-white/5 text-white/50 hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {type}
                  </button>
                );
              })}
            </div>

            {q.type !== "audio" && (
              <div className="mb-3">
                <label className="block text-xs text-white/40 mb-1">{t("imageUrl")}</label>
                <input
                  required
                  value={q.imageUrl}
                  onChange={(e) => updateQuestion(index, { imageUrl: e.target.value })}
                  placeholder={t("imageUrlPlaceholder")}
                  className="input-field w-full rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            )}

            {q.type === "audio" && (
              <div className="grid gap-3 sm:grid-cols-2 mb-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">{t("youtubeUrl")}</label>
                  <input
                    required
                    value={q.youtubeId}
                    onChange={(e) => updateQuestion(index, { youtubeId: e.target.value })}
                    placeholder={t("youtubePlaceholder")}
                    className="input-field w-full rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">{t("audioStart")}</label>
                  <input
                    type="number"
                    min={0}
                    value={q.audioStart}
                    onChange={(e) => updateQuestion(index, { audioStart: Number(e.target.value) })}
                    className="input-field w-full rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>
            )}

            {q.type === "crop" && (
              <div className="grid gap-3 sm:grid-cols-3 mb-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">{t("cropPosition")} X</label>
                  <input type="range" min={0} max={100} value={q.cropX}
                    onChange={(e) => updateQuestion(index, { cropX: Number(e.target.value) })}
                    className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">{t("cropPosition")} Y</label>
                  <input type="range" min={0} max={100} value={q.cropY}
                    onChange={(e) => updateQuestion(index, { cropY: Number(e.target.value) })}
                    className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">{t("cropSize")}</label>
                  <input type="range" min={10} max={60} value={q.cropSize}
                    onChange={(e) => updateQuestion(index, { cropSize: Number(e.target.value) })}
                    className="w-full" />
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-white/40 mb-1">{t("answers")}</label>
                <textarea
                  required
                  value={q.answers}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n");
                    const limited =
                      lines.length > MAX_ANSWERS_PER_QUESTION
                        ? lines.slice(0, MAX_ANSWERS_PER_QUESTION).join("\n")
                        : e.target.value;
                    updateQuestion(index, { answers: limited });
                  }}
                  placeholder={t("answersPlaceholder")}
                  rows={3}
                  className="input-field w-full rounded-lg px-3 py-2 text-sm text-white resize-none"
                />
                <p className="text-[10px] text-white/30 mt-1">{t("answersHelp", { max: MAX_ANSWERS_PER_QUESTION })}</p>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">{t("hint")}</label>
                <input
                  value={q.hint}
                  onChange={(e) => updateQuestion(index, { hint: e.target.value })}
                  placeholder={t("hintPlaceholder")}
                  className="input-field w-full rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            {previewIndex === index && q.imageUrl && q.type !== "audio" && (
              <div className="mt-4 border-t border-white/5 pt-4">
                <p className="text-xs text-white/40 mb-2">{t("preview")}</p>
                <QuestionDisplay
                  question={{
                    id: "preview",
                    type: q.type,
                    imageUrl: q.imageUrl,
                    cropX: q.cropX,
                    cropY: q.cropY,
                    cropSize: q.cropSize,
                    answers: [],
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addQuestion}
        className="btn-secondary mb-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white/70"
      >
        <Plus className="h-4 w-4" />
        {t("addQuestion")}
      </button>

      {error && (
        <p className="mb-4 text-center text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={publishing}
        className="btn-primary w-full rounded-xl py-4 text-lg font-bold text-white disabled:opacity-50"
      >
        {publishing ? t("publishing") : t("publish")}
      </button>
    </form>
  );
}
