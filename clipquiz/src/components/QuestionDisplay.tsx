"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Question } from "@/lib/types";
import { getCropStyle } from "@/lib/quiz-utils";
import { Crop, Music, Play, Volume2 } from "lucide-react";

interface QuestionDisplayProps {
  question: Question;
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  const t = useTranslations("quiz");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioKey, setAudioKey] = useState(0);

  function playAudio() {
    setAudioKey((k) => k + 1);
    setAudioPlaying(true);
  }

  if (question.type === "audio") {
    const start = question.audioStart ?? 0;
    const embedUrl = question.youtubeId
      ? `https://www.youtube.com/embed/${question.youtubeId}?start=${start}&autoplay=1&controls=0&modestbranding=1&rel=0&enablejsapi=1`
      : null;

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="audio-pulse flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-[#00f5d4]/20 to-[#8b5cf6]/20 border border-[#00f5d4]/30">
          <Volume2 className="h-16 w-16 text-[#00f5d4]" />
        </div>

        {!audioPlaying ? (
          <button
            type="button"
            onClick={playAudio}
            className="btn-primary flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-bold text-white"
          >
            <Play className="h-5 w-5 fill-current" />
            {t("playAudio")}
          </button>
        ) : (
          <div className="w-full max-w-lg">
            {embedUrl && (
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  key={audioKey}
                  src={embedUrl}
                  title="Audio clip"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            )}
            <button
              type="button"
              onClick={playAudio}
              className="mt-3 btn-secondary w-full rounded-xl py-3 text-sm font-medium text-white/70"
            >
              <Music className="inline h-4 w-4 mr-2" />
              {t("replayAudio")}
            </button>
          </div>
        )}
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
