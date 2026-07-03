/** Parse YouTube URLs/IDs and optional start timestamps (Machugi-style audio clips). */

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export function isValidYoutubeId(id: string): boolean {
  return YOUTUBE_ID_RE.test(id);
}

/** Seconds from t= / start= query (supports 90, 1m30s, 1h2m3s). */
export function parseYoutubeTimestamp(raw: string): number | null {
  const value = raw.trim().toLowerCase();
  if (!value) return null;

  if (/^\d+$/.test(value)) return Number(value);

  let seconds = 0;
  const hour = value.match(/(\d+)h/);
  const min = value.match(/(\d+)m/);
  const sec = value.match(/(\d+)s/);
  if (hour) seconds += Number(hour[1]) * 3600;
  if (min) seconds += Number(min[1]) * 60;
  if (sec) seconds += Number(sec[1]);
  if (hour || min || sec) return seconds;

  return null;
}

export function extractYoutubeId(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (isValidYoutubeId(trimmed)) return trimmed;

  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match?.[1] ?? trimmed;
}

export function extractYoutubeStart(url: string): number | null {
  try {
    const parsed = new URL(url.includes("://") ? url : `https://${url}`);
    const t =
      parsed.searchParams.get("t") ??
      parsed.searchParams.get("start") ??
      parsed.searchParams.get("time_continue");
    if (!t) return null;
    return parseYoutubeTimestamp(t);
  } catch {
    const tMatch = url.match(/[?&]t=([^&]+)/i);
    if (tMatch?.[1]) return parseYoutubeTimestamp(decodeURIComponent(tMatch[1]));
    return null;
  }
}

export function parseYoutubeInput(input: string): {
  youtubeId: string;
  audioStart: number | null;
} {
  const youtubeId = extractYoutubeId(input);
  const audioStart = extractYoutubeStart(input);
  return { youtubeId, audioStart };
}

export function secondsToMinutesParts(total: number): {
  minutes: number;
  seconds: number;
} {
  const safe = Math.max(0, Math.floor(total));
  return { minutes: Math.floor(safe / 60), seconds: safe % 60 };
}

export function minutesPartsToSeconds(minutes: number, seconds: number): number {
  return Math.max(0, minutes) * 60 + Math.max(0, Math.min(59, seconds));
}

export function formatTimestamp(total: number): string {
  const { minutes, seconds } = secondsToMinutesParts(total);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
