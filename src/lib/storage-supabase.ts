import type { Question, Quiz, QuizResult } from "./types";
import { getSupabaseAdmin } from "./supabase/admin";

interface QuizRow {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  tags: string[];
  questions: Question[];
  creator: string;
  play_count: number;
  cover_emoji: string;
  difficulty: Quiz["difficulty"];
  featured: boolean;
  created_at: string;
}

interface ResultRow {
  id: string;
  quiz_id: string;
  score: number;
  total: number;
  created_at: string;
}

function rowToQuiz(row: QuizRow): Quiz {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    language: row.language,
    tags: row.tags ?? [],
    questions: row.questions,
    creator: row.creator,
    playCount: row.play_count,
    coverEmoji: row.cover_emoji,
    difficulty: row.difficulty,
    featured: row.featured,
    createdAt: row.created_at,
  };
}

function rowToResult(row: ResultRow): QuizResult {
  return {
    id: row.id,
    quizId: row.quiz_id,
    score: row.score,
    total: row.total,
    createdAt: row.created_at,
  };
}

export async function getCustomQuizzesFromSupabase(): Promise<Quiz[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as QuizRow[]).map(rowToQuiz);
}

export async function getCustomQuizByIdFromSupabase(
  id: string,
): Promise<Quiz | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToQuiz(data as QuizRow) : null;
}

export async function saveQuizToSupabase(
  quiz: Omit<Quiz, "id" | "playCount" | "createdAt">,
): Promise<Quiz> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("quizzes")
    .insert({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      language: quiz.language,
      tags: quiz.tags,
      questions: quiz.questions,
      creator: quiz.creator,
      play_count: 0,
      cover_emoji: quiz.coverEmoji,
      difficulty: quiz.difficulty,
      featured: quiz.featured ?? false,
    })
    .select("*")
    .single();

  if (error) throw error;
  return rowToQuiz(data as QuizRow);
}

export async function incrementCustomPlayCountInSupabase(quizId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error: fetchError } = await supabase
    .from("quizzes")
    .select("play_count")
    .eq("id", quizId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!data) return;

  const { error } = await supabase
    .from("quizzes")
    .update({ play_count: (data.play_count as number) + 1 })
    .eq("id", quizId);

  if (error) throw error;
}

export async function incrementSeedPlayCountInSupabase(quizId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error: fetchError } = await supabase
    .from("seed_play_counts")
    .select("play_count")
    .eq("quiz_id", quizId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const nextCount = ((data?.play_count as number | undefined) ?? 0) + 1;

  const { error } = await supabase.from("seed_play_counts").upsert(
    { quiz_id: quizId, play_count: nextCount },
    { onConflict: "quiz_id" },
  );

  if (error) throw error;
}

export async function getSeedPlayCountFromSupabase(
  quizId: string,
): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("seed_play_counts")
    .select("play_count")
    .eq("quiz_id", quizId)
    .maybeSingle();

  if (error) throw error;
  return (data?.play_count as number | undefined) ?? 0;
}

export async function getResultsFromSupabase(
  quizId?: string,
): Promise<QuizResult[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("quiz_results")
    .select("*")
    .order("created_at", { ascending: true });

  if (quizId) {
    query = query.eq("quiz_id", quizId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as ResultRow[]).map(rowToResult);
}

export async function saveResultToSupabase(
  quizId: string,
  score: number,
  total: number,
): Promise<QuizResult> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("quiz_results")
    .insert({ quiz_id: quizId, score, total })
    .select("*")
    .single();

  if (error) throw error;
  return rowToResult(data as ResultRow);
}
