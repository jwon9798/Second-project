# ClipQuiz 배포 & 운영 가이드

> **Supabase DB 연결 (UGC 영구 저장):** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) — 처음부터 끝까지 단계별 가이드

## 1. Vercel 기본 배포 (지금 상태)

배포 상태가 **Ready**인데 404가 나면, 빌드는 됐지만 **프로젝트 설정**이 잘못된 경우가 대부분입니다.

### Settings → Build & Development Settings

| 항목 | 올바른 값 |
|------|-----------|
| Framework Preset | **Next.js** |
| Build Command | `npm run build` (또는 비워두기) |
| Output Directory | **비워두기** (`.next` 넣지 마세요) |
| Install Command | `npm install` (또는 비워두기) |
| Root Directory | **비워두기** (repo 루트) |
| Node.js Version | 20.x 권장 |

### 재배포

1. Deployments → 최신 배포 → **⋮** → **Redeploy**
2. **Use existing Build Cache** 체크 해제
3. 배포 완료 후 대시보드 **Visit** 버튼으로 접속

### 동작 확인

| URL | 기대 결과 |
|-----|-----------|
| `/api/health` | `{"ok":true,"app":"ClipQuiz"}` |
| `/en` | ClipQuiz 홈 |
| `/` | `/en`으로 리다이렉트 |

`x-vercel-error: NOT_FOUND` → Framework Preset이 Next.js가 아닙니다.

### GitHub 연동

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New Project**
2. GitHub repo `jwon9798/Second-project` 선택
3. 위 설정 확인 후 **Deploy**
4. 이후 `main` 브랜치 push 시 자동 재배포

환경 변수는 **현재 필수 없음** — 시드 퀴즈는 코드에 포함되어 있고, API는 파일 저장을 시도합니다.

---

## 2. 현재 데이터 저장 방식 (알아두기)

| 데이터 | 저장 위치 | 지속성 |
|--------|-----------|--------|
| 기본 퀴즈 14세트 | `src/data/seed-quizzes.json` | 영구 (Git) |
| 사용자 제작 퀴즈 | `data/quizzes.json` | **임시** (Vercel 서버리스 디스크) |
| 점수/결과 | `data/results.json` | **임시** |
| API 실패 시 | 브라우저 `localStorage` | 해당 기기만 |

Vercel 서버리스 함수의 파일 시스템은 **재배포·콜드 스타트 후 초기화**될 수 있습니다.  
데모/개인용은 괜찮지만, **실제 UGC 서비스**로 쓰려면 아래 3번의 DB 연결이 필요합니다.

---

## 3. 실제 서비스용 — DB 연결 (권장)

마추기아이오처럼 다른 사람이 만든 퀴즈·점수를 **전 세계에 공유**하려면 영구 DB가 필요합니다.

### 옵션 A: Supabase (추천 — 무료 티어, Postgres)

1. [supabase.com](https://supabase.com) → 새 프로젝트 생성
2. SQL Editor에서 테이블 생성:

```sql
create table quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  language text not null,
  tags text[] default '{}',
  questions jsonb not null,
  creator text not null,
  play_count int default 0,
  cover_emoji text default '🎯',
  difficulty text not null,
  featured boolean default false,
  created_at timestamptz default now()
);

create table quiz_results (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id) on delete cascade,
  score int not null,
  total int not null,
  created_at timestamptz default now()
);
```

3. Vercel → Project → **Settings → Environment Variables**:

| 변수 | 값 |
|------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (서버 API 전용) |

4. `src/lib/storage.ts`를 Supabase 클라이언트로 교체 (또는 PR 요청)

### 옵션 B: Vercel KV (Redis — 간단한 key-value)

1. Vercel Dashboard → Storage → **KV** 생성
2. 프로젝트에 연결하면 `KV_*` 환경 변수 자동 주입
3. 퀴즈 목록을 `quizzes:all`, 개별은 `quiz:{id}` 키로 JSON 저장

적합: 빠른 프로토타입. 복잡한 검색/통계는 Postgres가 낫습니다.

### 옵지 C: Vercel Postgres / Neon

Supabase와 동일한 Postgres 스키마 사용 가능. Neon은 serverless Postgres로 Vercel과 잘 맞습니다.

---

## 4. 이미지 업로드 (UGC 사진 퀴즈)

지금은 **이미지 URL 직접 입력** 방식입니다. 사용자가 파일을 올리려면:

| 서비스 | 설정 |
|--------|------|
| **Vercel Blob** | Storage → Blob 생성 → `BLOB_READ_WRITE_TOKEN` |
| **Cloudinary** | 무료 티어, `CLOUDINARY_URL` |
| **Supabase Storage** | DB와 함께 bucket 생성 |

업로드 API (`/api/upload`) 추가 후 Create 폼에 파일 input 연결.

---

## 5. 커스텀 도메인

1. Vercel → Project → **Domains**
2. `yourdomain.com` 입력
3. DNS에 Vercel이 안내하는 CNAME/A 레코드 추가
4. SSL 자동 발급 (몇 분 소요)

---

## 6. 로컬 개발

```bash
npm install
npm run dev
# http://localhost:3000
```

로컬에서는 `data/` 폴더에 JSON이 **실제로 저장**되어 API가 정상 동작합니다.

---

## 7. 체크리스트 (배포 전)

- [ ] Framework Preset = Next.js
- [ ] Output Directory 비어 있음
- [ ] Root Directory 비어 있음
- [ ] `/api/health` 200 응답
- [ ] `/en` 홈 화면 표시
- [ ] (선택) Supabase/KV 환경 변수 설정
- [ ] (선택) 커스텀 도메인 연결

---

## 8. 문제 해결

| 증상 | 해결 |
|------|------|
| 전체 404 | Framework Preset, Output Directory 확인 |
| API만 404 | `vercel.json`에 `@vercel/next` builder 확인 |
| 만든 퀴즈가 사라짐 | DB 미연결 — 3번 참고 |
| 유튜브 소리 안 남 | 해당 영상 embed 제한/삭제 — 다른 영상 ID로 교체 |
| 다른 기기에서 퀴즈 안 보임 | localStorage 폴백만 동작 — DB 연결 필요 |
