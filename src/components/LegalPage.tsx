import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export type LegalPageKey =
  | "privacy"
  | "terms"
  | "about"
  | "contact"
  | "faq"
  | "guidelines"
  | "moderation"
  | "copyright"
  | "guide";

interface LegalPageProps {
  page: LegalPageKey;
}

export default function LegalPage({ page }: LegalPageProps) {
  const t = useTranslations(`legal.${page}`);
  const footer = useTranslations("footer");
  const sections = t.raw("sections") as { title: string; body: string }[];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="font-display mb-2 text-4xl font-bold">{t("title")}</h1>
      {t.has("updated") && <p className="mb-8 text-sm text-white/40">{t("updated")}</p>}
      {t.has("intro") && <p className="mb-8 text-lg text-white/60 leading-relaxed">{t("intro")}</p>}

      <div className="space-y-8">
        {sections.map((section, i) => (
          <section key={i} className="glass-card rounded-2xl p-6">
            <h2 className="font-display mb-3 text-xl font-bold">{section.title}</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-white/60">{section.body}</p>
          </section>
        ))}
      </div>

      {page === "contact" && (
        <p className="mt-8 text-center">
          <a href={`mailto:${t("email")}`} className="font-semibold text-[#00f5d4] hover:underline">
            {t("email")}
          </a>
        </p>
      )}

      <nav className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-white/40">
        <Link href="/privacy">{footer("privacy")}</Link>
        <Link href="/terms">{footer("terms")}</Link>
        <Link href="/about">{footer("about")}</Link>
        <Link href="/contact">{footer("contact")}</Link>
        <Link href="/faq">{footer("faq")}</Link>
        <Link href="/guidelines">{footer("guidelines")}</Link>
        <Link href="/moderation">{footer("moderation")}</Link>
        <Link href="/copyright">{footer("copyright")}</Link>
        <Link href="/guide">{footer("guide")}</Link>
        <Link href="/">{footer("home")}</Link>
      </nav>
    </article>
  );
}
