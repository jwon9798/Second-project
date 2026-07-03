"use client";

import { useEffect } from "react";
import Script from "next/script";
import { ADSENSE_CLIENT_ID } from "@/lib/site";
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
        id="adsense-loader"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}
