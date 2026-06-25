import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AdSenseScript from "@/components/ads/AdSenseScript";
import { getSiteUrl } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(getSiteUrl()),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "ClipQuiz",
      type: "website",
      url: `${getSiteUrl()}/${locale}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AdSenseScript />
      <div className="mesh-bg fixed inset-0 -z-10" />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </NextIntlClientProvider>
  );
}
