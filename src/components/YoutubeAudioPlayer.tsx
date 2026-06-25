"use client";

import { useEffect, useRef } from "react";

interface YoutubeAudioPlayerProps {
  videoId: string;
  start?: number;
  duration?: number;
  playKey: number;
}

function buildEmbedUrl(videoId: string, start: number, duration: number) {
  const end = start + duration;
  const params = new URLSearchParams({
    autoplay: "1",
    controls: "0",
    disablekb: "1",
    enablejsapi: "1",
    fs: "0",
    iv_load_policy: "3",
    modestbranding: "1",
    origin: typeof window !== "undefined" ? window.location.origin : "",
    rel: "0",
    playsinline: "1",
    start: String(start),
    end: String(end),
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Hidden YouTube player — audio only, no visible video or title (Machugi.io style).
 */
export default function YoutubeAudioPlayer({
  videoId,
  start = 0,
  duration = 8,
  playKey,
}: YoutubeAudioPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (playKey === 0) return;

    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
    }

    stopTimerRef.current = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
        "*",
      );
    }, duration * 1000 + 300);

    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    };
  }, [playKey, duration]);

  if (playKey === 0) return null;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 h-px w-px overflow-hidden opacity-0"
      aria-hidden="true"
    >
      <iframe
        ref={iframeRef}
        key={playKey}
        src={buildEmbedUrl(videoId, start, duration)}
        title=""
        width="1"
        height="1"
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        className="border-0"
      />
    </div>
  );
}
