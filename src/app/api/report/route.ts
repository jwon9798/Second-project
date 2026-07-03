import { NextResponse } from "next/server";
import { reportActionForCount } from "@/lib/auto-moderation";
import {
  countReportsForQuiz,
  deleteQuiz,
  hideQuiz,
} from "@/lib/storage";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quizId, quizTitle, reason, details } = body;

    if (!quizId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const report = {
      quiz_id: String(quizId),
      quiz_title: quizTitle ? String(quizTitle) : null,
      reason: String(reason),
      details: details ? String(details) : null,
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from("quiz_reports").insert(report);
      if (error) {
        console.error("[ClipQuiz Report]", error);
        return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
      }

      const { total, hasCopyrightReport } = await countReportsForQuiz(String(quizId));
      const action = reportActionForCount(total, hasCopyrightReport);

      if (action === "delete") {
        await deleteQuiz(String(quizId));
        console.info("[ClipQuiz AutoMod] deleted quiz", quizId, "reports:", total);
      } else if (action === "hide") {
        await hideQuiz(String(quizId));
        console.info("[ClipQuiz AutoMod] hid quiz", quizId, "reports:", total);
      }
    } else {
      console.info("[ClipQuiz Report]", {
        ...report,
        reportedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
