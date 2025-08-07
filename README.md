# 웰스테이션 (WellStation)

차량 서비스 전문 예약 플랫폼 - 정비, 튜닝, 주차 서비스를 한 곳에서 편리하게 예약하세요.

## 🚗 서비스 소개

웰스테이션은 차량 관련 서비스를 통합 제공하는 예약 플랫폼입니다:

- **정비 예약**: 차량 정비 및 점검 서비스
- **튜닝 예약**: 차량 성능 튜닝 서비스
- **주차 예약**: 카라반 및 제트스키&보트 보관 서비스

## 🛠 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase
- **SMS Service**: SOLAPI (구 CoolSMS) - 휴대폰 인증용
- **Deployment**: Vercel

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm, yarn, pnpm, 또는 bun

### 설치 및 실행

1. **저장소 클론**

```bash
git clone [repository-url]
cd wellstation
```

2. **의존성 설치**

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

3. **환경 변수 설정**

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# SOLAPI SMS 서비스 설정
SOLAPI_API_KEY=your_solapi_api_key
SOLAPI_SENDER_NUMBER=your_sender_phone_number
```

4. **개발 서버 실행**

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
wellstation/
├── assets/                 # 이미지 에셋
├── components/             # React 컴포넌트
│   ├── icons/             # SVG 아이콘 컴포넌트
│   ├── Footer.tsx         # 푸터 컴포넌트
│   ├── ImageGallery.tsx   # 이미지 갤러리
│   ├── PhoneVerification.tsx # 휴대폰 인증 컴포넌트
│   └── ServiceButton.tsx  # 서비스 버튼
├── lib/                   # 유틸리티 라이브러리
│   ├── supabase.ts        # Supabase 클라이언트
│   └── supabase-helpers.ts # Supabase 헬퍼 함수
├── pages/                 # Next.js 페이지
│   ├── admin/             # 관리자 페이지
│   │   ├── index.tsx      # 관리자 대시보드
│   │   ├── reservations/  # 예약 관리
│   │   ├── schedules/     # 시간대 설정
│   │   ├── settings/      # 설정 관리
│   │   ├── work-records/  # 작업 기록 관리
│   │   └── gallery/       # 이미지 갤러리 관리
│   ├── api/               # API 라우트
│   │   ├── hello.ts       # 테스트 API
│   │   ├── send.ts        # SMS 전송 API
│   │   ├── send-verification.ts # 휴대폰 인증 SMS 발송 API
│   │   └── verify-code.ts # 인증코드 검증 API
│   ├── reserve/           # 예약 페이지
│   │   ├── parking.tsx    # 주차 예약
│   │   ├── repair.tsx     # 정비 예약
│   │   └── tuning.tsx     # 튜닝 예약
│   └── index.tsx          # 메인 페이지
├── public/                # 정적 파일
├── styles/                # 글로벌 스타일
├── types/                 # TypeScript 타입 정의
└── tailwind.config.js     # Tailwind 설정
```

## 🔧 주요 기능

### 1. 서비스 예약 시스템

- 정비, 튜닝, 주차 서비스 예약
- 실시간 폼 검증
- SMS 알림 서비스
- Supabase 데이터베이스 연동
- 예약 시간 충돌 방지 (1시간 버퍼)

### 2. 관리자 시스템

- **예약 관리**: 예약 내역 조회, 상세보기, 삭제
- **시간대 설정**: 서비스별 예약 가능 시간대 관리
- **설정 관리**: 서비스별 버퍼 시간, 최대 작업 시간 등 설정
- **작업 기록**: 작업 내용 및 사진 관리
- **이미지 갤러리**: 서비스별 이미지 업로드 및 관리
- **대시보드**: 통계 및 최근 예약 현황

### 3. 반응형 디자인

- 모바일 우선 반응형 디자인
- Tailwind CSS를 활용한 모던 UI
- 애니메이션 효과

### 4. SEO 최적화

- 메타 태그 최적화
- 카카오톡 공유 최적화
- 구조화된 데이터

### 5. SMS 통합

- SOLAPI를 통한 SMS 전송
- 예약 확인 메시지 자동 발송

## 📱 사용 가능한 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint

# Supabase 타입 생성
npm run supabase:types
```

## 🗄 Supabase 설정

### 1. 프로젝트 생성

[Supabase](https://supabase.com)에서 새 프로젝트를 생성하세요.

### 2. 데이터베이스 설정

Supabase 대시보드의 SQL Editor에서 `supabase-migration.sql` 파일의 내용을 실행하여 예약 테이블을 생성하세요.

### 3. 환경 변수 설정

프로젝트 설정에서 URL과 anon key를 가져와 `.env.local`에 설정하세요.

### 4. 타입 생성

```bash
# Supabase CLI 설치
npm install -g supabase

# 타입 생성 (YOUR_PROJECT_ID를 실제 프로젝트 ID로 변경)
supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

### 5. 예약 시스템 기능

- **예약 저장**: 모든 예약이 Supabase 데이터베이스에 저장됩니다
- **시간 충돌 방지**: 예약 시간 기준 1시간 전후로 중복 예약을 방지합니다
- **실시간 검증**: 예약 시도 시 즉시 시간 충돌을 확인합니다

### 6. 관리자 시스템 기능

- **예약 관리**: 예약 목록 조회, 상세보기, 삭제, 검색 및 필터링
- **시간대 설정**: 서비스별 요일별 예약 가능 시간대 설정
- **설정 관리**: 서비스별 버퍼 시간, 최대 작업 시간 등 세부 설정
- **작업 기록**: 작업 내용, 사진, 작업자 정보 관리
- **이미지 갤러리**: 서비스별 이미지 업로드, 수정, 삭제, 순서 변경
- **대시보드**: 통계 정보 및 최근 예약 현황 모니터링

## 📧 SMS 서비스 설정

### SOLAPI 설정

1. [SOLAPI](https://solapi.com) 계정 생성
2. API Key와 Secret 발급
3. 발신번호 등록
4. 환경 변수에 설정

### SMS 기능

- **휴대폰 인증**: 예약 시 휴대폰 번호 인증을 통한 신원 확인
- **예약 확인 SMS**: 튜닝 예약 시 자동으로 확인 SMS 발송
- **예약 취소 SMS**: 관리자가 예약 삭제 시 고객에게 취소 안내 SMS 발송
- **실시간 상태 표시**: SMS 전송 상태를 실시간으로 확인 가능

### 휴대폰 인증 시스템

- **6자리 인증코드**: 숫자 6자리로 구성된 인증코드 발송
- **5분 유효기간**: 인증코드는 5분간 유효하며, 만료 시 재발송 필요
- **실시간 카운트다운**: 인증코드 입력 시간을 실시간으로 표시
- **중복 사용 방지**: 한 번 사용된 인증코드는 재사용 불가
- **예약 필수 조건**: 휴대폰 인증 완료 후에만 예약 가능

## 🚀 배포

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com)에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 설정

### 수동 배포

```bash
npm run build
npm run start
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 저작권법에 의해 보호되는 폐쇄형 라이선스 하에 배포됩니다.
복제, 배포, 수정, 상업적 사용이 엄격히 금지됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**웰스테이션** - 차량 서비스의 새로운 기준
