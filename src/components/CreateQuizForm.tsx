"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { UGC_BLOCKED_CATEGORIES } from "@/lib/ugc-constants";
import { MAX_ANSWERS_PER_QUESTION } from "@/lib/quiz-utils";
import {
  extractYoutubeId,
  formatTimestamp,
  minutesPartsToSeconds,
  parseYoutubeInput,
  secondsToMinutesParts,
} from "@/lib/youtube-utils";
import type { Difficulty, QuestionType } from "@/lib/types";
import { Image, Crop, Music, Plus, Trash2, Eye } from "lucide-react";
import QuestionDisplay from "./QuestionDisplay";
import CropPicker from "./create/CropPicker";
import ImageSourceField from "./create/ImageSourceField";

interface DraftQuestion {
  type: QuestionType;
  imageUrl: string;
  cropX: number;
  cropY: number;
  cropSize: number;
  youtubeId: string;
  audioStart: number;
  audioDuration: number;
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
  audioDuration: 8,
  answers: "",
  hint: "",
});

export default function CreateQuizForm() {
  const t = useTranslations("create");
  const locale = useLocale();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("geography");
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
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [success, setSuccess] = useState<{ id: string } | null>(null);

  const categories = [
    "music", "gaming", "anime", "movies", "sports",
    "food", "geography", "travel", "variety", "nature", "memes", "other",
  ] as const;

  const blockedSet = new Set<string>(UGC_BLOCKED_CATEGORIES);

  const allowedCategories = categories.filter((c) => !blockedSet.has(c));

  const categoryRestricted = blockedSet.has(category);

  function handleYoutubeInput(index: number, raw: string) {
    const { youtubeId, audioStart } = parseYoutubeInput(raw);
    const patch: Partial<DraftQuestion> = { youtubeId: raw };
    if (youtubeId && isValidYoutubeIdFromInput(youtubeId)) {
      patch.youtubeId = raw;
    }
    if (audioStart !== null) {
      patch.audioStart = audioStart;
    }
    updateQuestion(index, patch);
  }

  function isValidYoutubeIdFromInput(input: string): boolean {
    return extractYoutubeId(input).length === 11;
  }

  function setAudioStartParts(index: number, minutes: number, seconds: number) {
    updateQuestion(index, {
      audioStart: minutesPartsToSeconds(minutes, seconds),
    });
  }

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
        audioDuration: q.audioDuration,
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

    if (!termsAgreed) {
      setError(t("termsRequired"));
      return;
    }

    if (categoryRestricted) {
      setError(t("categoryRestricted"));
      return;
    }

    for (const [i, q] of questions.entries()) {
      if ((q.type === "image" || q.type === "crop") && !q.imageUrl.trim()) {
        setError(t("imageRequired", { n: i + 1 }));
        return;
      }
      if (q.type === "audio" && extractYoutubeId(q.youtubeId).length !== 11) {
        setError(t("youtubeRequired", { n: i + 1 }));
        return;
      }
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
      termsAgreed: true as const,
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

      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(data?.error ?? t("submitError"));
    } catch {
      setError(t("submitError"));
    } finally {
      setPublishing(false);
    }
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
    <form onSubmit={handlePublish} className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-white/50">{t("subtitle")}</p>
        <p className="mt-2 text-xs text-[#00f5d4]">{t("loginNote")}</p>
      </div>

      <div className="mb-6 rounded-xl border border-[#00f5d4]/20 bg-[#00f5d4]/5 p-4 text-sm text-white/70 leading-relaxed">
        {t("policyBanner")}{" "}
        <Link href="/guidelines" className="text-[#00f5d4] hover:underline">
          {t("policyGuidelines")}
        </Link>
        {" · "}
        <Link href="/copyright" className="text-[#00f5d4] hover:underline">
          {t("policyCopyright")}
        </Link>
        {" · "}
        <Link href="/moderation" className="text-[#00f5d4] hover:underline">
          {t("policyModeration")}
        </Link>
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
              {allowedCategories.map((c) => (
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

            <div className="grid gap-2 sm:grid-cols-3 mb-4">
              {(
                [
                  { type: "image" as const, icon: Image, label: t("typeImage"), desc: t("typeImageDesc") },
                  { type: "crop" as const, icon: Crop, label: t("typeCrop"), desc: t("typeCropDesc") },
                  { type: "audio" as const, icon: Music, label: t("typeAudio"), desc: t("typeAudioDesc") },
                ]
              ).map(({ type, icon: Icon, label, desc }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateQuestion(index, { type })}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    q.type === type
                      ? "border-[#ff3366]/50 bg-[#ff3366]/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <Icon className={`mb-2 h-5 w-5 ${q.type === type ? "text-[#ff6b9d]" : "text-white/40"}`} />
                  <p className="text-sm font-semibold text-white/90">{label}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-white/40">{desc}</p>
                </button>
              ))}
            </div>

            {q.type === "audio" && (
              <p className="mb-4 text-xs text-white/40 leading-relaxed">{t("audioHelp")}</p>
            )}

            {(q.type === "image" || q.type === "crop") && (
              <div className="mb-4">
                <ImageSourceField
                  imageUrl={q.imageUrl}
                  onChange={(url) => updateQuestion(index, { imageUrl: url })}
                />
              </div>
            )}

            {q.type === "crop" && q.imageUrl && (
              <div className="mb-4">
                <CropPicker
                  imageUrl={q.imageUrl}
                  cropX={q.cropX}
                  cropY={q.cropY}
                  cropSize={q.cropSize}
                  onChange={(patch) => updateQuestion(index, patch)}
                />
              </div>
            )}

            {q.type === "audio" && (
              <div className="mb-3 space-y-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">{t("youtubeUrl")}</label>
                  <input
                    required
                    value={q.youtubeId}
                    onChange={(e) => handleYoutubeInput(index, e.target.value)}
                    placeholder={t("youtubePlaceholder")}
                    className="input-field w-full rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <p className="mt-1 text-[10px] text-white/30">{t("youtubeTimeHint")}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1">{t("audioStartMinutes")}</label>
                    <input
                      type="number"
                      min={0}
                      max={120}
                      value={secondsToMinutesParts(q.audioStart).minutes}
                      onChange={(e) =>
                        setAudioStartParts(
                          index,
                          Number(e.target.value),
                          secondsToMinutesParts(q.audioStart).seconds,
                        )
                      }
                      className="input-field w-full rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">{t("audioStartSeconds")}</label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={secondsToMinutesParts(q.audioStart).seconds}
                      onChange={(e) =>
                        setAudioStartParts(
                          index,
                          secondsToMinutesParts(q.audioStart).minutes,
                          Number(e.target.value),
                        )
                      }
                      className="input-field w-full rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">{t("audioDuration")}</label>
                    <input
                      type="number"
                      min={3}
                      max={30}
                      required
                      value={q.audioDuration}
                      onChange={(e) =>
                        updateQuestion(index, {
                          audioDuration: Number(e.target.value),
                        })
                      }
                      className="input-field w-full rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
                <p className="text-xs text-[#00f5d4]">
                  {t("audioClipPreview", {
                    start: formatTimestamp(q.audioStart),
                    duration: q.audioDuration,
                  })}
                </p>
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

            {previewIndex === index && q.type === "audio" && extractYoutubeId(q.youtubeId) && (
              <div className="mt-4 border-t border-white/5 pt-4">
                <p className="text-xs text-white/40 mb-2">{t("preview")}</p>
                <QuestionDisplay
                  question={{
                    id: "preview",
                    type: "audio",
                    youtubeId: extractYoutubeId(q.youtubeId),
                    audioStart: q.audioStart,
                    audioDuration: q.audioDuration,
                    answers: [],
                  }}
                />
              </div>
            )}

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

      <p className="mb-4 text-xs text-white/40 leading-relaxed">{t("copyrightNotice")}</p>

      <label className="mb-6 flex items-start gap-3 text-sm text-white/60 cursor-pointer">
        <input
          type="checkbox"
          checked={termsAgreed}
          onChange={(e) => setTermsAgreed(e.target.checked)}
          className="mt-1 rounded border-white/20"
          required
        />
        <span>
          {t("termsAgreePrefix")}{" "}
          <Link href="/guidelines" className="text-[#00f5d4] hover:underline">
            {t("termsAgreeGuidelines")}
          </Link>
          {", "}
          <Link href="/copyright" className="text-[#00f5d4] hover:underline">
            {t("termsAgreeCopyright")}
          </Link>
          {", "}
          {t("termsAgreeAnd")}{" "}
          <Link href="/terms" className="text-[#00f5d4] hover:underline">
            {t("termsAgreeTerms")}
          </Link>
          {t("termsAgreeSuffix")}
        </span>
      </label>

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
