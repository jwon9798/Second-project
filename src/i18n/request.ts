import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import en from "../../messages/en.json";

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
      legal: messages.legal ?? en.legal,
      results: { ...en.results, ...messages.results },
    },
  };
});
