import { NextResponse } from "next/server";
import { getQuizzes, saveQuiz } from "@/lib/storage";
import type { Quiz } from "@/lib/types";
import {
  validateUgcQuiz,
  validationMessageForLocale,
} from "@/lib/ugc-moderation";
import { z } from "zod";

const questionSchema = z.object({
  type: z.enum(["image", "crop", "audio"]),
  imageUrl: z.string().optional(),
  cropX: z.number().min(0).max(100).optional(),
  cropY: z.number().min(0).max(100).optional(),
  cropSize: z.number().min(5).max(80).optional(),
  youtubeId: z.string().optional(),
  audioStart: z.number().min(0).optional(),
  audioDuration: z.number().min(1).optional(),
  answers: z.array(z.string().min(1)).min(1).max(5),
  hint: z.string().optional(),
});

const quizSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(5).max(500),
  category: z.string().min(1),
  language: z.string().min(2),
  tags: z.array(z.string()).default([]),
  creator: z.string().min(2).max(50),
  coverEmoji: z.string().default("🎯"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  questions: z.array(questionSchema).min(3).max(50),
  termsAgreed: z.literal(true),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") ?? "popular";
  const search = searchParams.get("q")?.toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "";

  let quizzes = await getQuizzes();

  if (search) {
    quizzes = quizzes.filter(
      (q) =>
        q.title.toLowerCase().includes(search) ||
        q.description.toLowerCase().includes(search) ||
        q.tags.some((t) => t.toLowerCase().includes(search)),
    );
  }

  if (category) {
    quizzes = quizzes.filter(
      (q) => q.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (sort === "newest") {
    quizzes.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (sort === "trending") {
    quizzes.sort((a, b) => {
      const aScore = a.playCount + (a.featured ? 10000 : 0);
      const bScore = b.playCount + (b.featured ? 10000 : 0);
      return bScore - aScore;
    });
  } else {
    quizzes.sort((a, b) => b.playCount - a.playCount);
  }

  return NextResponse.json(quizzes);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quizSchema.parse(body);

    const validation = validateUgcQuiz(parsed, { termsAgreed: parsed.termsAgreed });
    if (!validation.ok) {
      const message =
        validationMessageForLocale(validation.code, parsed.language) ||
        validation.message;
      return NextResponse.json(
        { error: message, code: validation.code },
        { status: 400 },
      );
    }

    if (parsed.questions.some((q) => q.type === "audio")) {
      return NextResponse.json(
        { error: "Audio quizzes are temporarily disabled for content review." },
        { status: 400 },
      );
    }

    const questions = parsed.questions.map((q, i) => ({
      ...q,
      id: `q-${i}-${Date.now()}`,
    }));

    const { termsAgreed: _termsAgreed, ...quizData } = parsed;

    const quiz = await saveQuiz({
      ...quizData,
      questions,
      tags: parsed.tags.length ? parsed.tags : [parsed.category.toLowerCase()],
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}
