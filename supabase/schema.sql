-- ClipQuiz Supabase schema
-- Run this in Supabase Dashboard → SQL Editor → New query → Run

-- User-created quizzes (seed quizzes stay in src/data/seed-quizzes.json)
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  language text not null,
  tags text[] not null default '{}',
  questions jsonb not null,
  creator text not null,
  play_count int not null default 0,
  cover_emoji text not null default '🎯',
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Quiz results (quiz_id is text — supports seed ids like "world-flags-easy" and UUIDs)
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  quiz_id text not null,
  score int not null check (score >= 0),
  total int not null check (total >= 1),
  created_at timestamptz not null default now()
);

-- Extra play counts for bundled seed quizzes
create table if not exists public.seed_play_counts (
  quiz_id text primary key,
  play_count int not null default 0
);

create index if not exists idx_quizzes_created_at on public.quizzes (created_at desc);
create index if not exists idx_quizzes_play_count on public.quizzes (play_count desc);
create index if not exists idx_quiz_results_quiz_id on public.quiz_results (quiz_id);
create index if not exists idx_quiz_results_created_at on public.quiz_results (created_at desc);

-- RLS: API uses service_role key (bypasses RLS). These policies are a safety net.
alter table public.quizzes enable row level security;
alter table public.quiz_results enable row level security;
alter table public.seed_play_counts enable row level security;

create policy "Anyone can read quizzes"
  on public.quizzes for select
  using (true);

create policy "Anyone can read quiz results"
  on public.quiz_results for select
  using (true);

create policy "Anyone can read seed play counts"
  on public.seed_play_counts for select
  using (true);

-- Content reports (copyright / abuse)
create table if not exists public.quiz_reports (
  id uuid primary key default gen_random_uuid(),
  quiz_id text not null,
  quiz_title text,
  reason text not null,
  details text,
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_reports_created_at on public.quiz_reports (created_at desc);

alter table public.quiz_reports enable row level security;

-- Reports are write-only from the public API (service_role bypasses RLS).
-- Do not expose report contents to anonymous clients.
