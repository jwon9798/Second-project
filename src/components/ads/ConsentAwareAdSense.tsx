"use client";

import { useEffect } from "react";
import Script from "next/script";
import { ADSENSE_CLIENT_ID, GA4_MEASUREMENT_ID } from "@/lib/site";
import { syncConsentOnLoad } from "@/lib/consent";

export default function ConsentAwareAdSense() {
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
      <Script
        id="adsense-loader"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}
