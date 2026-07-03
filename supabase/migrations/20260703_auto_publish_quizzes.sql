-- Auto-publish existing user quizzes that were waiting for manual approval
update public.quizzes
set featured = true
where featured = false;
