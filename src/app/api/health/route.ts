import { NextResponse } from "next/server";
import { getStorageBackend } from "@/lib/storage";

export async function GET() {
  const storage = getStorageBackend();

  return NextResponse.json({
    ok: true,
    app: "ClipQuiz",
    version: "1.0.0",
    storage,
    supabaseConfigured: storage === "supabase",
  });
}
