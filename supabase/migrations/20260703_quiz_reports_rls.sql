-- Restrict quiz_reports to service-role reads only (privacy fix)
drop policy if exists "Anyone can read quiz reports" on public.quiz_reports;
