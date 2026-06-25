"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { isAdSenseConfigured } from "@/lib/site";

type AdFormat = "auto" | "rectangle" | "horizontal" | "vertical";

interface AdSlotProps {
  slot?: string;
  format?: AdFormat;
  className?: string;
  label?: "home" | "quiz" | "results" | "sidebar";
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

function getSlotId(label: AdSlotProps["label"]): string | undefined {
  const map: Record<string, string | undefined> = {
    home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME,
    quiz: process.env.NEXT_PUBLIC_ADSENSE_SLOT_QUIZ,
    results: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULTS,
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  };
  return label ? map[label] : undefined;
}

export default function AdSlot({
  slot,
  format = "auto",
  className = "",
  label,
}: AdSlotProps) {
  const t = useTranslations("ads");
  const pushed = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slotId = slot ?? getSlotId(label);
  const ready = isAdSenseConfigured() && Boolean(slotId);

  useEffect(() => {
    if (!ready || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, [ready]);

  if (!isAdSenseConfigured()) {
    return (
      <div
        className={`ad-placeholder flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 ${className}`}
        aria-hidden
      >
        <span className="text-center text-xs text-white/25">{t("placeholder")}</span>
      </div>
    );
  }

  if (!slotId) {
    return (
      <div
        className={`ad-placeholder flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-amber-500/20 bg-amber-500/5 px-4 ${className}`}
      >
        <span className="text-center text-xs text-amber-200/60">{t("slotMissing")}</span>
      </div>
    );
  }

  return (
    <div className={`ad-container overflow-hidden ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-white/30">
        {t("label")}
      </p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
