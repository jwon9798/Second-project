"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ADSENSE_CLIENT_ID } from "@/lib/site";
import { getConsent } from "@/lib/consent";

type AdLabel = "home" | "quiz" | "results";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

function getSlotId(label: AdLabel): string | undefined {
  const map: Record<AdLabel, string | undefined> = {
    home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME,
    quiz: process.env.NEXT_PUBLIC_ADSENSE_SLOT_QUIZ,
    results: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULTS,
  };
  return map[label];
}

interface AdSlotProps {
  label: AdLabel;
  className?: string;
}

export default function AdSlot({ label, className = "" }: AdSlotProps) {
  const t = useTranslations("ads");
  const pushed = useRef(false);
  const slotId = getSlotId(label);
  const [adConsent, setAdConsent] = useState(false);

  useEffect(() => {
    const check = () => setAdConsent(getConsent() === "accepted");
    check();
    window.addEventListener("clipquiz-consent-change", check);
    return () => window.removeEventListener("clipquiz-consent-change", check);
  }, []);

  useEffect(() => {
    if (!slotId || !adConsent || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // script still loading
    }
  }, [slotId, adConsent]);

  return (
    <div className={`my-4 ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-white/30">
        {t("label")}
      </p>
      {slotId ? (
        <ins
          className="adsbygoogle block min-h-[90px]"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className="flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4"
          aria-hidden
        >
          <span className="text-center text-xs text-white/25">{t("placeholder")}</span>
        </div>
      )}
    </div>
  );
}
