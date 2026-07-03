const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "JPEG, PNG, WebP, GIF only";
  }
  if (file.size > MAX_BYTES) {
    return "Max 5 MB";
  }
  return null;
}

export async function uploadQuizImage(file: File): Promise<string> {
  const localError = validateImageFile(file);
  if (localError) throw new Error(localError);

  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: form,
  });

  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;

  if (!res.ok || !data?.url) {
    throw new Error(data?.error ?? "Upload failed");
  }

  return data.url;
}
