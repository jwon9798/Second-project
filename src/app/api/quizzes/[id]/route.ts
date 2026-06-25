import { NextResponse } from "next/server";
import { getPlayCount, getQuizById, getResults, incrementPlayCount } from "@/lib/storage";
import { getScoreDistribution } from "@/lib/quiz-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const playCount = await getPlayCount(quiz.id, quiz.playCount);
  const results = await getResults(quiz.id);

  return NextResponse.json({
    ...quiz,
    playCount,
    stats: {
      totalPlays: results.length,
      averageScore:
        results.length > 0
          ? results.reduce((sum, r) => sum + r.score / r.total, 0) / results.length
          : 0,
      distribution: getScoreDistribution(results),
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  await incrementPlayCount(id);
  return NextResponse.json({ ok: true });
}
