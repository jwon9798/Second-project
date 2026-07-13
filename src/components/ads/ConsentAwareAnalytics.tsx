"use client";

import { useEffect } from "react";
import Script from "next/script";
import { GA4_MEASUREMENT_ID } from "@/lib/site";
import { syncConsentOnLoad } from "@/lib/consent";

export default function ConsentAwareAnalytics() {
  useEffect(() => {
    syncConsentOnLoad();
  }, []);

  return (
    <>
      <Script id="consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script
        id="ga4-loader"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}', {
            anonymize_ip: true,
            allow_google_signals: false
          });
        `}
      </Script>
    </>
  );
}
