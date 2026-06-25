"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Question } from "@/lib/types";
import { getCropStyle } from "@/lib/quiz-utils";
import YoutubeAudioPlayer from "./YoutubeAudioPlayer";
import { Crop, Music, Play, Volume2 } from "lucide-react";

interface QuestionDisplayProps {
  question: Question;
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  const t = useTranslations("quiz");
  const [playKey, setPlayKey] = useState(0);

  function playAudio() {
    setPlayKey((k) => k + 1);
  }

  if (question.type === "audio" && question.youtubeId) {
    const start = question.audioStart ?? 0;
    const duration = question.audioDuration ?? 8;

    return (
      <div className="flex flex-col items-center gap-6">
        {playKey > 0 && (
          <YoutubeAudioPlayer
            videoId={question.youtubeId}
            start={start}
            duration={duration}
            playKey={playKey}
          />
        )}

        <div
          className={`audio-pulse flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-[#00f5d4]/20 to-[#8b5cf6]/20 border border-[#00f5d4]/30 transition-all ${
            playKey > 0 ? "scale-105 border-[#00f5d4]/60" : ""
          }`}
        >
          <Volume2
            className={`h-16 w-16 text-[#00f5d4] ${playKey > 0 ? "animate-pulse" : ""}`}
          />
        </div>

        <p className="text-sm text-white/40 text-center max-w-xs">
          {playKey > 0
            ? t("audioPlaying")
            : t("audioHint")}
        </p>

        <button
          type="button"
          onClick={playAudio}
          className="btn-primary flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-bold text-white"
        >
          {playKey > 0 ? (
            <>
              <Music className="h-5 w-5" />
              {t("replayAudio")}
            </>
          ) : (
            <>
              <Play className="h-5 w-5 fill-current" />
              {t("playAudio")}
            </>
          )}
        </button>
      </div>
    );
  }

  if (question.type === "crop" && question.imageUrl) {
    const size = question.cropSize ?? 25;
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="flex items-center gap-2 text-sm text-[#ffe566]">
          <Crop className="h-4 w-4" />
          {t("cropHint")}
        </p>
        <div
          className="crop-container relative mx-auto w-full max-w-lg aspect-square rounded-2xl border border-white/10 bg-black"
          style={{ clipPath: "inset(0 round 1rem)" }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.imageUrl}
              alt="Crop challenge"
              className="h-full w-full object-cover"
              style={getCropStyle(question)}
              draggable={false}
            />
          </div>
          <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-1 text-xs text-white/60">
            {size}% zoom
          </div>
        </div>
      </div>
    );
  }

  if (question.imageUrl) {
    return (
      <div className="relative mx-auto w-full max-w-lg aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={question.imageUrl}
          alt="Quiz image"
          className="h-full w-full object-contain"
          draggable={false}
        />
      </div>
    );
  }

  return null;
}
