"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { fetchQuizById } from "@/lib/quizzes-client";
import ResultScreen from "@/components/ResultScreen";
import RelatedQuizzes from "@/components/RelatedQuizzes";
import AdSlot from "@/components/ads/AdSlot";

export default function ResultsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const [quiz, setQuiz] = useState<Awaited<ReturnType<typeof fetchQuizById>>>(null);

  const score = Number(searchParams.get("score") ?? 0);
  const total = Number(searchParams.get("total") ?? 1);
  const percentile = Number(searchParams.get("percentile") ?? 50);
  const distributionParam = searchParams.get("distribution");
  const distribution = distributionParam
    ? (JSON.parse(distributionParam) as number[])
    : [];

  useEffect(() => {
    fetchQuizById(id)
      .then(setQuiz)
      .catch(() => {});
  }, [id]);

  if (!quiz) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#00f5d4]" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-lg px-4 pt-6">
        <AdSlot label="results" format="horizontal" />
      </div>
      <ResultScreen
        quizId={id}
        quizTitle={quiz.title}
        score={score}
        total={total}
        percentile={percentile}
        distribution={distribution}
      />
      <div className="mx-auto max-w-lg px-4 pb-4">
        <AdSlot label="results" format="rectangle" />
      </div>
      <RelatedQuizzes currentId={id} category={quiz.category} />
    </>
  );
}
