import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },
      {
        source: "/privacy",
        destination: "/en/privacy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/en/terms",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/en/contact",
        permanent: true,
      },
      {
        source: "/guidelines",
        destination: "/en/guidelines",
        permanent: true,
      },
      {
        source: "/copyright",
        destination: "/en/copyright",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/en/faq",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/en/about",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
