import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Image upload requires Supabase Storage. Paste an image URL instead." },
      { status: 503 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Use JPEG, PNG, WebP, or GIF images only." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    const ext = EXT_BY_TYPE[file.type] ?? "jpg";
    const path = `ugc/${randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from("quiz-images").upload(path, bytes, {
      contentType: file.type,
      upsert: false,
      cacheControl: "31536000",
    });

    if (error) {
      console.error("[ClipQuiz Upload]", error);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    const { data } = supabase.storage.from("quiz-images").getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl });
  } catch {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }
}
