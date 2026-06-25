import { routing } from "@/i18n/routing";
import { allSeedQuizzes } from "@/lib/seed-data";
import QuizPlayPage from "@/components/QuizPlayPage";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allSeedQuizzes.map((quiz) => ({
      locale,
      id: quiz.id,
    })),
  );
}

export default function Page() {
  return <QuizPlayPage />;
}
