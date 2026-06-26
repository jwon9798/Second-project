import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { allSeedQuizzes } from "@/lib/seed-data";
import { getQuizById } from "@/lib/storage";
import QuizPlayPage from "@/components/QuizPlayPage";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allSeedQuizzes.map((quiz) => ({
      locale,
      id: quiz.id,
    })),
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const quiz = await getQuizById(id);
  return <QuizPlayPage quizId={id} initialQuiz={quiz} />;
}
