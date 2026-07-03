import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import en from "../../messages/en.json";

type LegalSection = { title: string; body: string };
type LegalPage = {
  title: string;
  updated?: string;
  intro?: string;
  sections: LegalSection[];
};

function mergeLegal(
  enLegal: Record<string, LegalPage>,
  localeLegal?: Record<string, LegalPage>,
) {
  if (!localeLegal) return enLegal;

  const merged: Record<string, LegalPage> = { ...enLegal };
  for (const key of Object.keys(enLegal)) {
    const enPage = enLegal[key];
    const localePage = localeLegal[key];
    if (!localePage) continue;

    merged[key] = {
      ...enPage,
      ...localePage,
      sections:
        (localePage.sections?.length ?? 0) >= (enPage.sections?.length ?? 0)
          ? localePage.sections
          : enPage.sections,
    };
  }
  return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages: {
      ...en,
      ...messages,
      nav: { ...en.nav, ...messages.nav },
      footer: { ...en.footer, ...messages.footer },
      ads: messages.ads ?? en.ads,
      cookies: messages.cookies ?? en.cookies,
      legal: mergeLegal(en.legal, messages.legal),
      results: { ...en.results, ...messages.results },
    },
  };
});
