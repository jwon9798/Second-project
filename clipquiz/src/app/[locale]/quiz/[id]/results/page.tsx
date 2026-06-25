import { Suspense } from "react";
import ResultsContent from "./ResultsContent";

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
