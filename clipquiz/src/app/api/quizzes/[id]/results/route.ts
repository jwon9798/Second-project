import { NextResponse } from "next/server";
import { getQuizById, getResults, saveResult } from "@/lib/storage";
import { calculatePercentile, getScoreDistribution } from "@/lib/quiz-utils";
import { z } from "zod";

const resultSchema = z.object({
  score: z.number().min(0),
  total: z.number().min(1),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const results = await getResults(id);

  return NextResponse.json({
    total: results.length,
    distribution: getScoreDistribution(results),
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

  try {
    const body = await request.json();
    const { score, total } = resultSchema.parse(body);

    const result = await saveResult(id, score, total);
    const allResults = await getResults(id);
    const percentile = calculatePercentile(score, total, allResults);

    return NextResponse.json({
      result,
      percentile,
      distribution: getScoreDistribution(allResults),
      totalPlayers: allResults.length,
    });
  } catch {
    return NextResponse.json({ error: "Invalid result" }, { status: 400 });
  }
}
