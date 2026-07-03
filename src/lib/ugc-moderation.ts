/**
 * Server-side checks for user-created quizzes (stricter than Machugi.io defaults).
 */

import { UGC_BLOCKED_CATEGORIES } from "./ugc-constants";
import { isValidYoutubeId } from "./youtube-utils";

const BLOCKED_CATEGORIES = new Set<string>(UGC_BLOCKED_CATEGORIES);

/** High-risk phrases in titles, descriptions, or answers */
const BLOCKED_PATTERNS: RegExp[] = [
  /\b(nazi|hitler|holocaust\s*denial)\b/i,
  /\b(kkk|white\s+power)\b/i,
  /\b(child\s*porn|csam|loli|shota)\b/i,
  /\b(rape|molest)\b/i,
  /\b(kill\s+yourself|kys)\b/i,
];

const TRADEMARK_HEAVY_PATTERNS: RegExp[] = [
  /\b(disney|marvel|pokemon|naruto|drake|taylor\s*swift|bts|blackpink)\b/i,
  /\b(netflix|spotify|fortnite|minecraft|roblox)\b/i,
  /\b(mcdonald|nike|adidas|gucci|louis\s*vuitton)\b/i,
];

const BLOCKED_IMAGE_HOSTS = [
  "pinterest.com",
  "pinimg.com",
  "instagram.com",
  "facebook.com",
  "tiktok.com",
  "twitter.com",
  "x.com",
];

export interface UgcQuizInput {
  title: string;
  description: string;
  category: string;
  creator: string;
  questions: {
    type: string;
    imageUrl?: string;
    youtubeId?: string;
    audioStart?: number;
    audioDuration?: number;
    cropSize?: number;
    answers: string[];
    hint?: string;
  }[];
}

export type UgcValidationResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

function scanText(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    if (pattern.test(text)) return pattern.source;
  }
  return null;
}

function collectText(quiz: UgcQuizInput): string {
  const parts = [
    quiz.title,
    quiz.description,
    quiz.creator,
    ...quiz.questions.flatMap((q) => [
      ...(q.answers ?? []),
      q.hint ?? "",
    ]),
  ];
  return parts.join(" ");
}

/** Song/artist names in audio answers are allowed — scan metadata only. */
function collectTrademarkText(quiz: UgcQuizInput): string {
  const parts = [quiz.title, quiz.description, quiz.creator];
  for (const q of quiz.questions) {
    if (q.type !== "audio") {
      parts.push(...(q.answers ?? []), q.hint ?? "");
    }
  }
  return parts.join(" ");
}

function isAudioQuiz(quiz: UgcQuizInput): boolean {
  return quiz.questions.some((q) => q.type === "audio");
}

function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (BLOCKED_IMAGE_HOSTS.some((b) => host.includes(b))) return false;
    if (host.endsWith(".supabase.co") && parsed.pathname.includes("/storage/v1/object/public/quiz-images/")) {
      return true;
    }
    return true;
  } catch {
    return false;
  }
}

export function validateUgcQuiz(
  quiz: UgcQuizInput,
  options?: { termsAgreed?: boolean },
): UgcValidationResult {
  if (options?.termsAgreed !== true) {
    return {
      ok: false,
      code: "TERMS_REQUIRED",
      message:
        "You must agree to the Terms of Service and Community Guidelines.",
    };
  }

  if (BLOCKED_CATEGORIES.has(quiz.category.toLowerCase())) {
    return {
      ok: false,
      code: "CATEGORY_BLOCKED",
      message:
        "This category is restricted for user submissions due to copyright risk. Try Music (audio), Geography, Nature, Food, Travel, or Gaming.",
    };
  }

  const blob = collectText(quiz);
  const blocked = scanText(blob, BLOCKED_PATTERNS);
  if (blocked) {
    return {
      ok: false,
      code: "PROHIBITED_CONTENT",
      message: "This quiz contains content that is not allowed on ClipQuiz.",
    };
  }

  const trademark = scanText(
    isAudioQuiz(quiz) ? collectTrademarkText(quiz) : collectText(quiz),
    TRADEMARK_HEAVY_PATTERNS,
  );
  if (trademark) {
    return {
      ok: false,
      code: "TRADEMARK_RISK",
      message:
        "Quizzes referencing brands, celebrities, or copyrighted franchises are not accepted from user submissions. Use original or public-domain topics.",
    };
  }

  for (const [i, q] of quiz.questions.entries()) {
    if (q.type === "audio") {
      const id = q.youtubeId?.trim() ?? "";
      if (!isValidYoutubeId(id)) {
        return {
          ok: false,
          code: "INVALID_YOUTUBE",
          message: `Question ${i + 1}: paste a valid YouTube URL or 11-character video ID.`,
        };
      }
      const start = q.audioStart ?? 0;
      const duration = q.audioDuration ?? 8;
      if (start < 0) {
        return {
          ok: false,
          code: "INVALID_AUDIO_START",
          message: `Question ${i + 1}: start time cannot be negative.`,
        };
      }
      if (duration < 3 || duration > 30) {
        return {
          ok: false,
          code: "INVALID_AUDIO_DURATION",
          message: `Question ${i + 1}: clip length must be between 3 and 30 seconds.`,
        };
      }
      continue;
    }

    if (q.type === "image" || q.type === "crop") {
      if (!q.imageUrl?.trim()) {
        return {
          ok: false,
          code: "MISSING_IMAGE",
          message: `Question ${i + 1} needs an image URL.`,
        };
      }
      if (!isValidImageUrl(q.imageUrl)) {
        return {
          ok: false,
          code: "INVALID_IMAGE_URL",
          message: `Question ${i + 1}: use a direct https:// image link (Wikimedia, your own host). Social media hotlinks are not allowed.`,
        };
      }
    }

    if (q.type === "crop") {
      const size = q.cropSize ?? 25;
      if (size < 18) {
        return {
          ok: false,
          code: "CROP_TOO_SMALL",
          message: `Question ${i + 1}: crop zoom must be at least 18% so players can reasonably guess.`,
        };
      }
      if (size > 75) {
        return {
          ok: false,
          code: "CROP_TOO_LARGE",
          message: `Question ${i + 1}: crop zoom must be 75% or less.`,
        };
      }
    }

    if (!q.answers?.length) {
      return {
        ok: false,
        code: "MISSING_ANSWERS",
        message: `Question ${i + 1} needs at least one accepted answer.`,
      };
    }
  }

  return { ok: true };
}

export function validationMessageForLocale(
  code: string,
  locale: string,
): string {
  const ko: Record<string, string> = {
    TERMS_REQUIRED: "이용약관 및 커뮤니티 가이드라인에 동의해야 합니다.",
    CATEGORY_BLOCKED:
      "저작권 리스크로 해당 카테고리는 사용자 제출이 제한됩니다. 음악(오디오), 지리, 자연, 음식, 여행, 게임 카테고리를 이용해 주세요.",
    PROHIBITED_CONTENT: "허용되지 않는 콘텐츠가 포함되어 있습니다.",
    TRADEMARK_RISK:
      "브랜드·연예인·저작권 프랜차이즈 관련 퀴즈는 사용자 제출을 받지 않습니다.",
    INVALID_YOUTUBE: "유효한 YouTube URL 또는 영상 ID를 입력해 주세요.",
    INVALID_AUDIO_START: "시작 시점은 0 이상이어야 합니다.",
    INVALID_AUDIO_DURATION: "재생 길이는 3~30초 사이여야 합니다.",
    MISSING_IMAGE: "이미지 URL이 필요합니다.",
    INVALID_IMAGE_URL:
      "https:// 직접 이미지 링크만 사용할 수 있습니다. SNS 핫링크는 불가합니다.",
    CROP_TOO_SMALL: "크롭 줌은 최소 18% 이상이어야 합니다.",
    CROP_TOO_LARGE: "크롭 줌은 75% 이하여야 합니다.",
    MISSING_ANSWERS: "정답을 하나 이상 입력해 주세요.",
  };
  if (locale.startsWith("ko") && ko[code]) return ko[code];
  return "";
}
