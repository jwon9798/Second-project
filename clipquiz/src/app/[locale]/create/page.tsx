import { setRequestLocale } from "next-intl/server";
import CreateQuizForm from "@/components/CreateQuizForm";

export default async function CreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CreateQuizForm />;
}
