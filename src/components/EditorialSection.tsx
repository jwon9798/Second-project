import { useTranslations } from "next-intl";

export default function EditorialSection() {
  const t = useTranslations("editorial");

  return (
    <section className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-bold mb-6">{t("title")}</h2>
        <div className="space-y-4 text-sm leading-relaxed text-white/50">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
      </div>
    </section>
  );
}
