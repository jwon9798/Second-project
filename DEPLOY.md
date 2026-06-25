# Vercel 배포 가이드 (404 해결)

배포 상태가 **Ready**인데 404가 나면, 빌드는 됐지만 Vercel **프로젝트 설정**이 잘못된 경우가 대부분입니다.

## 1. Framework Preset (가장 중요)

**Settings → Build & Development Settings**

| 항목 | 올바른 값 |
|------|-----------|
| Framework Preset | **Next.js** |
| Build Command | `npm run build` (또는 비워두기) |
| Output Directory | **비워두기** (절대 `.next` 넣지 마세요) |
| Install Command | `npm install` (또는 비워두기) |
| Root Directory | **비워두기** (`clipquiz` 아님) |

Output Directory에 `.next`나 `out`이 들어가 있으면 **Ready여도 전체 404**가 납니다.

## 2. 재배포

1. Deployments → 최신 배포 → **⋮** → **Redeploy**
2. **Use existing Build Cache** 체크 해제
3. 배포 완료 후 **Visit** 버튼으로 접속 (도메인 직접 입력 말고)

## 3. 동작 확인

| URL | 기대 결과 |
|-----|-----------|
| `/api/health` | `{"ok":true,"app":"ClipQuiz"}` |
| `/en` | ClipQuiz 홈 화면 |
| `/` | `/en`으로 리다이렉트 |

## 4. 그래도 404면

1. Vercel 프로젝트 **삭제 후 재연결** (GitHub `Second-project` repo)
2. 새 프로젝트 만들 때 Framework가 **Next.js**로 자동 인식되는지 확인
3. `second-project.vercel.app`은 **다른 옛 프로젝트**일 수 있음 → 대시보드의 **Visit** URL 사용

## 5. 태블릿 테스트

Vercel URL을 태블릿 브라우저에 그대로 입력하면 됩니다. `localhost`는 필요 없습니다.
