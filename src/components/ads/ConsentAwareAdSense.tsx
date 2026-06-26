"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { ADSENSE_CLIENT_ID } from "@/lib/site";
import { getConsent } from "@/lib/consent";

export default function ConsentAwareAdSense() {
  const [loadAds, setLoadAds] = useState(false);

  useEffect(() => {
    const check = () => setLoadAds(getConsent() === "accepted");
    check();
    window.addEventListener("clipquiz-consent-change", check);
    return () => window.removeEventListener("clipquiz-consent-change", check);
  }, []);

  if (!loadAds) return null;

  return (
    <Script
      id="adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
