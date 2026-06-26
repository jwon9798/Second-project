import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quizId, quizTitle, reason, details } = body;

    if (!quizId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.info("[ClipQuiz Report]", {
      quizId,
      quizTitle,
      reason,
      details: details ?? "",
      reportedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
