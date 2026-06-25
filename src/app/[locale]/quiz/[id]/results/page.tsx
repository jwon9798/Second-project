import { Suspense } from "react";
import { routing } from "@/i18n/routing";
import seedQuizzes from "@/data/seed-quizzes.json";
import type { Quiz } from "@/lib/types";
import ResultsContent from "./ResultsContent";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    (seedQuizzes as Quiz[]).map((quiz) => ({
      locale,
      id: quiz.id,
    })),
  );
}

export default function QuizResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#00f5d4]" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
