# AdSense 출시 체크리스트 (pub-4911271163170466)

코드에 이미 반영된 항목입니다. Cloudflare 배포 후 아래만 확인하세요.

## 자동 적용됨

| 항목 | URL / 내용 |
|------|------------|
| AdSense 스크립트 | 모든 페이지 `<head>` — `ca-pub-4911271163170466` |
| ads.txt | `/ads.txt` → `google.com, pub-4911271163170466, DIRECT, ...` |
| 개인정보처리방침 | `/en/privacy` (푸터 링크) |
| 이용약관 | `/en/terms` |
| 소개 / 문의 | `/en/about`, `/en/contact` |
| 쿠키 동의 배너 | 하단 |
| 광고 슬롯 | 홈 2곳, 퀴즈 시작 전, 결과 2곳 |
| Favicon | `favicon.ico` + `icon.svg` (32px, Chrome 탭용) |
| sitemap | `/sitemap.xml` |

## AdSense에서 할 일

1. [adsense.google.com](https://adsense.google.com) 로그인
2. **사이트** → 사이트 URL 추가 (`https://clipquiz.jwonlabs.com`)
3. 배포 후 확인:
   - `https://YOUR-DOMAIN/ads.txt`
   - `https://YOUR-DOMAIN/api/health` → `adsense.publisherId: pub-4911271163170466`
4. **사이트 검토 요청** 클릭

## 승인 후 (선택)

AdSense → 광고 → 광고 단위 기준 → 디스플레이 광고 생성 후 GitHub Secrets 또는 로컬 env:

```
NEXT_PUBLIC_ADSENSE_SLOT_HOME=숫자
NEXT_PUBLIC_ADSENSE_SLOT_QUIZ=숫자
NEXT_PUBLIC_ADSENSE_SLOT_RESULTS=숫자
```

재배포하면 플레이스홀더 대신 실제 광고가 표시됩니다.

## Favicon이 안 바뀔 때

Chrome 캐시 때문입니다. `chrome://favicon` 캐시 삭제 또는 시크릿 창에서 확인.
