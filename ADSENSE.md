# Google AdSense 연동 가이드 (ClipQuiz)

## 현재 상태

ClipQuiz에는 **광고 슬롯**과 **AdSense 심사 필수 페이지**가 준비되어 있습니다.

| 항목 | 상태 |
|------|------|
| 개인정보처리방침 `/privacy` | ✅ |
| 이용약관 `/terms` | ✅ |
| 소개 `/about` | ✅ |
| 문의 `/contact` | ✅ |
| 푸터 법적 링크 | ✅ |
| 쿠키 동의 배너 | ✅ |
| `ads.txt` | ✅ (Publisher ID 설정 후) |
| `sitemap.xml` / `robots.txt` | ✅ |
| 광고 슬롯 (홈/퀴즈/결과) | ✅ (슬롯 ID 설정 후) |

---

## AdSense 승인 전 체크리스트

Google 공식 기준 요약:

1. **본인 소유 도메인** — Vercel 기본 URL도 가능하나, **커스텀 도메인**이 승인에 유리
2. **충분한 콘텐츠** — 14개 시드 퀴즈 + About/Privacy 등 (✅)
3. **원본 콘텐츠** — 직접 제작 퀴즈, 저작권 침해 없는 이미지/음원 (⚠️ 유튜브 음원 주의)
4. **개인정보처리방침** — AdSense·쿠키 문구 포함 (✅)
5. **쉬운 탐색** — 헤더/푸터/모바일 메뉴 (✅)
6. **만 18세 이상** 신청 (미성년자는 보호자 계정)
7. **HTML 소스 접근 가능** — Vercel 배포 사이트 (✅)

### 자주 거절되는 이유

| 원인 | 대응 |
|------|------|
| 콘텐츠 부족 | 퀴즈 더 만들기, About 내용 보강 |
| 저작권 콘텐츠 | 위키미디어/직접 제작 이미지 위주 |
| 개인정보처리방침 없음 | `/privacy` 푸터 링크 확인 |
| 사이트 접속 불가 | Vercel 배포 상태 확인 |
| UGC 정책 위반 | 신고·삭제 프로세스 (contact 이메일) |

---

## 1단계: AdSense 계정 신청

1. [https://www.google.com/adsense](https://www.google.com/adsense) 접속
2. Google 계정으로 로그인 (만 18세+)
3. **사이트 추가**: `https://your-domain.com` (또는 Vercel URL)
4. 국가/지급 정보 입력

---

## 2단계: 사이트에 AdSense 코드 연결

승인 **대기 중**에도 코드 삽입을 요구합니다.

### Vercel 환경 변수 추가

| 변수 | 값 | 예시 |
|------|-----|------|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | ca-pub-XXXXXXXX | AdSense → 계정 → 계정 정보 |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | pub-XXXXXXXX | ads.txt용 (client ID에서 pub 부분) |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL | `https://yourdomain.com` |

### 광고 단위 생성 후 (승인 후 또는 대기 중)

AdSense → 광고 → **광고 단위 기준** → 디스플레이 광고 생성

| 변수 | 배치 위치 |
|------|-----------|
| `NEXT_PUBLIC_ADSENSE_SLOT_HOME` | 홈 (2곳) |
| `NEXT_PUBLIC_ADSENSE_SLOT_QUIZ` | 퀴즈 시작 전 |
| `NEXT_PUBLIC_ADSENSE_SLOT_RESULTS` | 결과 화면 (2곳) |

### 재배포

Vercel → Redeploy (캐시 없이)

---

## 3단계: ads.txt 확인

브라우저에서:

```
https://your-domain.com/ads.txt
```

다음 형태여야 합니다:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

AdSense 대시보드 → 사이트 → ads.txt 상태가 **승인됨**인지 확인 (최대 24시간).

---

## 4단계: 심사 제출

1. AdSense → **사이트**
2. 사이트 선택 → **사이트 검토 요청**
3. 2일~4주 대기 (보통 며칠)

### 심사 중

- 광고 슬롯에 **빈 영역** 또는 **플레이스홀더**가 보일 수 있음 (정상)
- 트래픽이 조금 있으면 유리 (친구에게 공유, SNS)

---

## 5단계: 승인 후

1. 광고 단위 **슬롯 ID**를 환경 변수에 설정
2. Redeploy
3. 실제 광고 노출 확인 (퀴즈 **플레이 중**에는 광고 없음 — UX 보호)
4. AdSense 정책: 클릭 유도 금지, "광고 클릭" 문구 금지

---

## 수익 최적화 팁

| 전략 | 이유 |
|------|------|
| 결과 화면에 광고 2개 | 플레이 끝 = 체류 + 재클릭 |
| 관련 퀴즈 추천 | 페이지뷰 증가 |
| 공유 버튼 | 바이럴 → 트래픽 |
| 커스텀 도메인 | 신뢰도 + SEO |
| 퀴즈 20개+ UGC | 콘텐츠 깊이 |

### 피해야 할 것

- 퀴즈 **문제 화면**에 광고 (실수 클릭, 정책 위험)
- 과도한 광고 밀도
- "광고를 클릭해 주세요" 문구

---

## 환경 변수 전체 예시

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=pub-1234567890123456
NEXT_PUBLIC_ADSENSE_SLOT_HOME=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_QUIZ=2345678901
NEXT_PUBLIC_ADSENSE_SLOT_RESULTS=3456789012
```

---

## 문의 이메일 변경

`contact@clipquiz.app`는 예시입니다. 본인 이메일로 변경하려면:

- `messages/en.json` → `legal.privacy`, `legal.contact`
- `messages/ko.json` → 동일 위치

변경 후 재배포.
