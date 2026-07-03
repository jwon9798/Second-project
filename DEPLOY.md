# ClipQuiz — Cloudflare Workers 배포 가이드

> **도메인:** https://clipquiz.jwonlabs.com  
> **Worker:** `clipquiz`  
> **Repo:** jwon9798/Second-project  
> **스택:** Next.js 15 + @opennextjs/cloudflare + wrangler

## 1. 자동 배포 (GitHub Actions)

`main` 브랜치 push 시 `.github/workflows/deploy-cloudflare.yml`이 Worker에 배포합니다.

### GitHub Secrets (Settings → Secrets and variables → Actions)

| Secret | 필수 | 설명 |
|--------|------|------|
| `CLOUDFLARE_API_TOKEN` | ✅ | Workers 편집 권한 API 토큰 |
| `CLOUDFLARE_ACCOUNT_ID` | ✅ | Cloudflare 계정 ID |
| `NEXT_PUBLIC_SUPABASE_URL` | 권장 | UGC 퀴즈 영구 저장 (Workers는 파일 저장 불가) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 권장 | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | 권장 | 서버 API용 service role key |

토큰 생성: Cloudflare Dashboard → My Profile → API Tokens → **Edit Cloudflare Workers** 템플릿.

### 배포 확인

```bash
curl https://clipquiz.jwonlabs.com/api/health
curl https://clipquiz.jwonlabs.com/ads.txt
curl -I https://clipquiz.jwonlabs.com/en
```

## 2. 로컬 수동 배포

```bash
npm install
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
export NEXT_PUBLIC_SITE_URL=https://clipquiz.jwonlabs.com
npm run deploy
```

로컬 미리보기: `npm run preview`

## 3. DNS / 커스텀 도메인

`wrangler.jsonc`에 `custom_domain: true`로 설정되어 있어, **첫 배포 시** Cloudflare가 `clipquiz.jwonlabs.com` DNS를 자동 생성합니다.

- `jwonlabs.com` 존이 Cloudflare에 있어야 합니다.
- path 라우팅(`jwonlabs.com/clipquiz`)은 사용하지 않습니다 — **서브도메인만** 사용합니다.

## 4. AdSense / ads.txt

| 위치 | 내용 |
|------|------|
| `public/ads.txt` | `google.com, pub-4911271163170466, DIRECT, f08c47fec0942fa0` |
| `src/app/ads.txt/route.ts` | 동일 (동적 라우트) |
| **jwonlabs.com 루트** (`mainpage` repo) | `subdomain=clipquiz.jwonlabs.com` 한 줄 추가 필요 |

루트 ads.txt 예시 (mainpage Worker `jwonlabs-main`):

```
google.com, pub-4911271163170466, DIRECT, f08c47fec0942fa0
subdomain=htv.jwonlabs.com
subdomain=clipquiz.jwonlabs.com
```

## 5. Supabase (권장)

Cloudflare Workers는 **로컬 파일 시스템에 쓰기가 영구 저장되지 않습니다.**  
UGC 퀴즈·점수를 유지하려면 Supabase를 연결하세요. 자세한 내용은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

Supabase Dashboard → Authentication → URL Configuration (로그인 사용 시):

- Site URL: `https://clipquiz.jwonlabs.com`
- Redirect URLs: `https://clipquiz.jwonlabs.com/**`

## 6. 정책 페이지

공통 정책(선택): https://jwonlabs.com/privacy.html  
앱 내 정책: `/en/privacy`, `/en/terms` 등 (앱 자체 페이지)

문의: jwon9798@gmail.com

## 7. Vercel에서 이전

Vercel 프로젝트는 더 이상 사용하지 않습니다 (`vercel.json` 제거됨).  
AdSense 사이트 URL을 `https://clipquiz.jwonlabs.com`으로 변경 후 재심사 요청하세요.

## 8. 문제 해결

| 증상 | 해결 |
|------|------|
| 배포 실패 `_headers` | `/*` 주석 블록 사용 금지 |
| 404 전체 | Worker custom_domain DNS 전파 대기 (수 분) |
| UGC 퀴즈 사라짐 | Supabase secrets 설정 |
| 이미지 안 보임 | `next.config.ts` remotePatterns 확인 |
