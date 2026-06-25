# ClipQuiz × Supabase 연결 가이드 (처음부터 끝까지)

이 문서는 **당신이 직접 해야 할 일**과 **코드가 자동으로 하는 일**을 순서대로 정리합니다.

> 예상 소요: Supabase 계정 생성 ~ 15분, Vercel 환경 변수 설정 ~ 5분

---

## 전체 흐름 한눈에 보기

```
1. Supabase 계정 + 프로젝트 생성
2. SQL 스키마 실행 (테이블 3개)
3. API 키 복사
4. Vercel에 환경 변수 2개 등록
5. 재배포
6. /api/health 로 연결 확인
7. 퀴즈 만들기 → Supabase Table Editor에서 데이터 확인
```

환경 변수가 설정되면 **사용자 제작 퀴즈·점수**가 Supabase Postgres에 영구 저장됩니다.  
기본 퀴즈 14개는 계속 `src/data/seed-quizzes.json`에 있습니다.

---

## 1단계: Supabase 계정 만들기

1. 브라우저에서 [https://supabase.com](https://supabase.com) 접속
2. **Start your project** → GitHub 또는 이메일로 가입
3. 로그인 후 대시보드 진입

---

## 2단계: 새 프로젝트 생성

1. **New project** 클릭
2. 아래처럼 입력:

| 항목 | 권장 값 |
|------|---------|
| **Name** | `clipquiz` (아무 이름 가능) |
| **Database Password** | 강한 비밀번호 (메모장에 저장 — 나중에 DB 직접 접속 시 필요) |
| **Region** | `Northeast Asia (Tokyo)` 또는 가장 가까운 리전 |
| **Plan** | Free (무료) |

3. **Create new project** 클릭
4. **1~2분** 기다리기 (프로젝트 프로비저닝)

---

## 3단계: 데이터베이스 테이블 만들기 (SQL 실행)

1. 왼쪽 메뉴 **SQL Editor** 클릭
2. **New query** 클릭
3. 이 저장소의 [`supabase/schema.sql`](./supabase/schema.sql) 파일 내용 **전체 복사**
4. SQL Editor에 붙여넣기
5. 오른쪽 하단 **Run** (또는 Ctrl+Enter)
6. `Success. No rows returned` 메시지 확인

### 만들어지는 테이블

| 테이블 | 용도 |
|--------|------|
| `quizzes` | 사용자가 만든 퀴즈 |
| `quiz_results` | 플레이 점수 (상위 % 계산용) |
| `seed_play_counts` | 기본 퀴즈 추가 플레이 수 |

7. 왼쪽 **Table Editor**에서 `quizzes`, `quiz_results`, `seed_play_counts` 3개가 보이면 성공

---

## 4단계: API 키 복사하기

1. 왼쪽 메뉴 **Project Settings** (톱니바퀴) 클릭
2. **API** 메뉴 선택
3. 아래 두 값을 복사해 메모장에 임시 저장:

| 이름 | 어디에 쓰나 | 예시 형태 |
|------|-------------|-----------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` | `https://abcdefgh.supabase.co` |
| **service_role** key (`secret`) | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIs...` (긴 JWT) |

### 주의 (매우 중요)

- `service_role` 키는 **비밀번호와 같습니다**. GitHub에 올리거나 채팅에 붙여넣지 마세요.
- `anon` 키는 이번 설정에서 **필요 없습니다** (서버 API만 DB에 접속).
- `service_role`은 **Reveal** 버튼을 눌러야 보입니다.

---

## 5단계: Vercel에 환경 변수 등록

1. [https://vercel.com/dashboard](https://vercel.com/dashboard) 접속
2. ClipQuiz 프로젝트 (`second-project-two-khaki` 등) 클릭
3. 상단 **Settings** → 왼쪽 **Environment Variables**
4. 아래 **2개**를 각각 추가:

### 변수 1

| Field | Value |
|-------|-------|
| **Key** | `NEXT_PUBLIC_SUPABASE_URL` |
| **Value** | 4단계에서 복사한 Project URL |
| **Environments** | Production, Preview, Development 모두 체크 |

### 변수 2

| Field | Value |
|-------|-------|
| **Key** | `SUPABASE_SERVICE_ROLE_KEY` |
| **Value** | 4단계에서 복사한 `service_role` 키 |
| **Environments** | Production, Preview, Development 모두 체크 |

5. **Save** 클릭

---

## 6단계: 재배포

환경 변수는 **저장 후 새 배포**해야 적용됩니다.

1. Vercel → **Deployments** 탭
2. 최신 배포 옆 **⋮** → **Redeploy**
3. **Use existing Build Cache** 체크 해제 (권장)
4. **Redeploy** 클릭
5. Status가 **Ready** 될 때까지 대기

> Supabase 연결 코드가 포함된 브랜치/PR이 `main`에 머지되어 있어야 합니다.  
> 아직 머지 전이면 PR 머지 후 자동 배포되거나, 6단계를 다시 실행하세요.

---

## 7단계: 연결 확인

브라우저에서 아래 URL을 엽니다 (본인 Vercel 도메인으로 교체):

```
https://second-project-two-khaki.vercel.app/api/health
```

### 성공 시 응답 예시

```json
{
  "ok": true,
  "app": "ClipQuiz",
  "version": "1.0.0",
  "storage": "supabase",
  "supabaseConfigured": true
}
```

| `storage` 값 | 의미 |
|--------------|------|
| `"supabase"` | DB 연결 성공 |
| `"file"` | 환경 변수 미설정 → 예전 파일 저장 방식 |

`"file"`이 나오면 5~6단계를 다시 확인하세요.

---

## 8단계: 실제로 동작하는지 테스트

### 퀴즈 만들기

1. 사이트 접속 → **퀴즈 만들기** (Create)
2. 제목·문제 3개 이상 입력 후 **게시**
3. Supabase 대시보드 → **Table Editor** → `quizzes` 테이블
4. 방금 만든 퀴즈 행이 추가되었는지 확인

### 점수 저장

1. 아무 퀴즈나 풀고 완료
2. Supabase → `quiz_results` 테이블에 `score`, `total` 행 추가 확인

### 다른 기기에서 확인

1. 휴대폰 등 **다른 브라우저**에서 같은 퀴즈 링크 열기
2. 홈 화면에 방금 만든 퀴즈가 보이면 **영구 저장 성공**

---

## (선택) 로컬 개발 환경 설정

로컬에서도 Supabase를 쓰려면:

1. 프로젝트 루트에 `.env.local` 파일 생성 (Git에 올라가지 않음)
2. 내용:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. 터미널에서:

```bash
npm install
npm run dev
```

4. [http://localhost:3000/api/health](http://localhost:3000/api/health) 에서 `"storage":"supabase"` 확인

`.env.local` 없이 `npm run dev` 하면 `data/` 폴더에 JSON으로 저장됩니다 (기존 방식).

---

## 문제 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| `storage: "file"` | 환경 변수 없음 | Vercel 변수 2개 확인 후 재배포 |
| 퀴즈 만들기 500 에러 | SQL 스키마 미실행 | 3단계 `schema.sql` 다시 Run |
| `Invalid API key` | service_role 키 오타 | 키 전체 다시 복사 (앞뒤 공백 없이) |
| 만든 퀴즈가 안 보임 | PR 미배포 | `main` 머지 + Redeploy |
| 점수만 안 쌓임 | `quiz_results` 테이블 없음 | schema.sql 재실행 |

### Supabase 로그 확인

1. Supabase → **Logs** → **API** 또는 **Postgres**
2. 에러 메시지 확인

### Vercel 로그 확인

1. Vercel → Deployments → 해당 배포 → **Functions**
2. `/api/quizzes` 호출 시 에러 로그 확인

---

## 비용

| 서비스 | 무료 티어 |
|--------|-----------|
| Supabase Free | 500MB DB, 월 5만 MAU 수준 (초기에 충분) |
| Vercel Hobby | 개인 프로젝트 무료 |

트래픽이 크게 늘면 Supabase Pro ($25/월) 검토.

---

## 체크리스트 (복사해서 사용)

```
[ ] Supabase 계정 생성
[ ] clipquiz 프로젝트 생성 (리전 선택)
[ ] schema.sql SQL Editor에서 실행
[ ] Project URL 복사
[ ] service_role 키 복사 (비밀 유지)
[ ] Vercel NEXT_PUBLIC_SUPABASE_URL 등록
[ ] Vercel SUPABASE_SERVICE_ROLE_KEY 등록
[ ] Vercel Redeploy (캐시 없이)
[ ] /api/health → storage: "supabase"
[ ] 퀴즈 만들기 → Supabase quizzes 테이블 확인
[ ] 퀴즈 풀기 → quiz_results 테이블 확인
[ ] 다른 기기에서 퀴즈 노출 확인
```

---

## 다음에 할 수 있는 것 (선택)

- **이미지 업로드**: Supabase Storage bucket + `/api/upload`
- **로그인**: Supabase Auth + 카카오 OAuth (마추기아이오 스타일)
- **댓글**: `quiz_comments` 테이블 추가

이 단계들이 필요하면 이슈나 PR로 요청해 주세요.
