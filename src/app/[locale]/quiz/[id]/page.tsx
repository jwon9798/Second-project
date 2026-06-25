import { routing } from "@/i18n/routing";
import seedQuizzes from "@/data/seed-quizzes.json";
import type { Quiz } from "@/lib/types";
import QuizPlayPage from "@/components/QuizPlayPage";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    (seedQuizzes as Quiz[]).map((quiz) => ({
      locale,
      id: quiz.id,
    })),
  );
}

export default function Page() {
  return <QuizPlayPage />;
}
