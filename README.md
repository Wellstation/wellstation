# 웰스테이션 (WellStation)

차량 서비스 전문 예약 플랫폼 - 정비, 튜닝, 주차 서비스를 한 곳에서 편리하게 예약하세요.

## 🚗 서비스 소개

웰스테이션은 차량 관련 서비스를 통합 제공하는 예약 플랫폼입니다:

- **정비 예약**: 차량 정비 및 점검 서비스
- **튜닝 예약**: 차량 성능 튜닝 서비스
- **주차 예약**: 카라반 및 제트스키&보트 보관 서비스

## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 15, React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Build Tool**: Next.js built-in

### Backend & Database

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### External Services

- **SMS Service**: SOLAPI (구 CoolSMS) - 휴대폰 인증용
- **Deployment**: Vercel
- **Analytics**: Custom visitor tracking

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
├── assets/                     # 이미지 에셋
│   ├── background.png         # 배경 이미지
│   └── tuning-bg.png         # 튜닝 배경 이미지
├── components/                 # React 컴포넌트
│   ├── icons/                 # SVG 아이콘 컴포넌트
│   │   ├── index.ts          # 아이콘 export
│   │   ├── ParkingIcon.tsx   # 주차 아이콘
│   │   ├── RepairIcon.tsx    # 정비 아이콘
│   │   └── TuningIcon.tsx    # 튜닝 아이콘
│   ├── admin/                 # 관리자 전용 컴포넌트
│   │   ├── AdminHeader.tsx   # 관리자 헤더
│   │   ├── AdminLayout.tsx   # 관리자 레이아웃
│   │   └── AdminLogin.tsx    # 관리자 로그인
│   ├── AgreementCheckboxes.tsx # 약관 동의 체크박스
│   ├── Footer.tsx            # 푸터 컴포넌트
│   ├── ImageGallery.tsx      # 이미지 갤러리
│   ├── PageHeader.tsx        # 페이지 헤더
│   ├── PhoneVerification.tsx # 휴대폰 인증
│   ├── PhoneVerificationButton.tsx # 인증 버튼
│   ├── ReservationCalendar.tsx # 예약 캘린더
│   ├── ReservationSearchModal.tsx # 예약 검색 모달
│   ├── ServiceButton.tsx     # 서비스 버튼
│   ├── ServiceTypeSelector.tsx # 서비스 타입 선택
│   └── TimeSlotSelector.tsx  # 시간대 선택
├── hooks/                     # Custom React Hooks
│   ├── useAdminAuth.ts       # 관리자 인증 훅
│   └── useVisitorCount.ts    # 방문자 카운트 훅
├── pages/                     # Next.js 페이지
│   ├── admin/                # 관리자 페이지
│   │   ├── index.tsx         # 관리자 대시보드
│   │   ├── reservations/     # 예약 관리
│   │   │   ├── index.tsx     # 예약 목록
│   │   │   └── [id].tsx      # 예약 상세
│   │   ├── feedback/         # 피드백 관리
│   │   │   ├── index.tsx     # 피드백 목록
│   │   │   └── [id].tsx      # 피드백 상세
│   │   ├── gallery/          # 갤러리 관리
│   │   │   └── index.tsx     # 갤러리 설정
│   │   ├── settings/         # 설정 관리
│   │   │   └── index.tsx     # 서비스 설정
│   │   └── work-records/     # 작업 기록 관리
│   │       ├── index.tsx     # 작업 기록 목록
│   │       ├── new.tsx       # 새 작업 기록
│   │       ├── [id].tsx      # 작업 기록 상세
│   │       └── [id]/         # 작업 기록 편집
│   │           └── edit.tsx  # 작업 기록 편집
│   ├── api/                  # API 라우트
│   │   ├── admin/            # 관리자 API
│   │   ├── feedback.ts       # 피드백 제출 API
│   │   ├── send.ts           # SMS 전송 API
│   │   ├── send-kakao.ts     # 카카오톡 알림톡 API
│   │   ├── verify-code.ts    # 인증코드 검증 API
│   │   ├── visitor-count.ts  # 방문자 카운트 API
│   │   └── work-records/     # 작업 기록 API
│   │       ├── like.ts       # 좋아요 API
│   │       └── view.ts       # 조회수 API
│   ├── agreements/           # 약관 페이지
│   │   ├── privacy.tsx       # 개인정보처리방침
│   │   └── service.tsx       # 서비스 이용약관
│   ├── feedback.tsx          # 피드백 페이지
│   ├── index.tsx             # 메인 페이지
│   ├── records/              # 작업 기록 페이지
│   │   ├── [service-type].tsx # 서비스별 기록
│   │   └── detail/           # 상세 페이지
│   │       └── [id].tsx      # 기록 상세
│   ├── reservations/         # 예약 관련 페이지
│   │   ├── index.tsx         # 예약 목록
│   │   └── [service-type]/   # 서비스별 예약
│   │       └── search.tsx    # 예약 검색
│   ├── reserve/              # 예약 페이지
│   │   ├── parking.tsx       # 주차 예약
│   │   ├── repair.tsx        # 정비 예약
│   │   └── tuning.tsx        # 튜닝 예약
│   └── send-test.tsx         # SMS 테스트 페이지
├── public/                   # 정적 파일
│   ├── favicon.ico           # 파비콘
│   ├── logo.svg              # 로고
│   ├── logo1.svg             # 로고 변형
│   └── robots.txt            # 검색엔진 설정
├── styles/                   # 글로벌 스타일
│   └── globals.css           # 전역 CSS
├── supabase/                 # Supabase 설정
│   ├── client.ts             # Supabase 클라이언트
│   ├── helpers.ts            # Supabase 헬퍼 함수
│   └── migrations/           # 데이터베이스 마이그레이션
│       ├── 20241201000000_create_reservations_table.sql
│       ├── 20241201000002_create_admin_tables.sql
│       ├── 20241201000003_add_gallery_images_table.sql
│       ├── 20241201000004_create_storage_bucket.sql
│       ├── 20241201000005_create_admin_auth.sql
│       ├── 20241201000006_update_admin_auth_plain_password.sql
│       ├── 20241201000007_remove_max_duration_settings.sql
│       ├── 20241201000009_remove_work_records_status.sql
│       ├── 20241201000010_remove_work_records_technician_reservation.sql
│       ├── 20241201000011_add_service_schedules.sql
│       ├── 20241201000012_add_default_settings.sql
│       ├── 20241201000013_add_likes_views_to_work_records.sql
│       ├── 20241201000014_update_service_settings_structure.sql
│       ├── 20241201000015_add_unique_constraint_to_reservation_date.sql
│       ├── 20241201000016_create_phone_verifications_table.sql
│       ├── 20241201000017_create_visitor_counts_table.sql
│       ├── 20241201000018_create_visitor_sessions_table.sql
│       ├── 20241201000019_update_visitor_policies.sql
│       ├── 20241201000020_create_feedback_table.sql
│       ├── 20241201000021_add_rating_to_feedback.sql
│       ├── 20241201000022_add_status_to_reservations.sql
│       ├── 20241201000023_add_visit_details_to_reservations.sql
│       ├── 20241201000024_fix_feedback_rls_policies.sql
│       ├── 20241201000025_setup_admin_auth_system.sql
│       ├── 20241201000026_remove_admin_auth_table.sql
│       ├── 20241201000027_setup_comprehensive_rls_policies.sql
│       ├── 20241201000028_reset_all_rls_policies.sql
│       ├── 20241201000029_remove_profiles_table.sql
│       ├── 20241201000030_remove_service_schedules_table.sql
│       └── 20241201000031_add_visit_date_to_feedback.sql
├── types/                     # TypeScript 타입 정의
│   ├── api.ts                # API 타입
│   ├── enums.ts              # 열거형 타입
│   └── supabase.ts           # Supabase 타입
├── utils/                     # 유틸리티 함수
│   ├── reservation.ts         # 예약 관련 유틸리티
│   └── visitor.ts            # 방문자 ID 관리
├── next.config.ts            # Next.js 설정
├── package.json              # 프로젝트 의존성
├── postcss.config.js         # PostCSS 설정
├── tailwind.config.js        # Tailwind CSS 설정
└── tsconfig.json             # TypeScript 설정
```

## 🔧 주요 기능

### 1. 서비스 예약 시스템

- **다양한 서비스**: 정비, 튜닝, 주차 서비스 예약
- **실시간 폼 검증**: 클라이언트 사이드 및 서버 사이드 검증
- **SMS/카카오톡 알림**: 예약 확인, 취소, 방문 완료 알림
- **Supabase 데이터베이스 연동**: 실시간 데이터 동기화
- **예약 시간 충돌 방지**: 1시간 버퍼를 통한 중복 예약 방지
- **휴대폰 인증 시스템**: 6자리 인증코드, 3분 유효기간

### 2. 예약 상태 관리 시스템

- **예약 상태**: `reserved` (예약 완료), `visited` (방문 완료), `cancelled` (예약 취소)
- **상태별 날짜 관리**: 예약일, 방문일, 취소일 자동 기록
- **동적 상태 표시**: 예약 상태에 따른 배지 및 날짜 표시
- **상태별 필터링**: 예약 목록에서 상태별 필터링 기능

### 3. 방문 완료 시스템

- **방문 완료 처리**: 작업 내용, 다음 점검일, 특이사항 입력
- **자동 SMS 발송**: 방문 완료 시 고객에게 알림톡 발송
- **피드백 링크 포함**: 방문 완료 메시지에 피드백 페이지 링크 포함
- **확인 대화상자**: 최종 확인을 위한 confirm 대화상자

### 4. 피드백 시스템

- **통합 피드백 페이지**: 모든 서비스 공용 피드백 수집
- **별점 평가**: 1-5점 별점 시스템
- **URL 파라미터 자동 채우기**: `?name={name}&phone={phone}&serviceType={serviceType}` 형태의 URL로 접근 시 폼 자동 채우기
- **관리자 피드백 관리**: 피드백 목록 조회, 필터링, 별점 표시
- **서비스 타입별 분류**: 정비, 튜닝, 주차 서비스별 피드백 분류

### 5. 관리자 시스템

- **예약 관리**: 예약 내역 조회, 상세보기, 상태 변경, 취소
- **피드백 관리**: 사용자 피드백 조회, 별점 확인, 서비스별 분류
- **시간대 설정**: 서비스별 예약 가능 시간대 관리
- **설정 관리**: 서비스별 버퍼 시간, 최대 작업 시간 등 설정
- **작업 기록**: 작업 내용 및 사진 관리
- **이미지 갤러리**: 서비스별 이미지 업로드 및 관리
- **대시보드**: 통계 및 최근 예약 현황

### 6. SMS/카카오톡 통합 시스템

- **SOLAPI SMS**: 예약 확인, 취소, 방문 완료 알림
- **카카오톡 알림톡**: 템플릿 기반 알림톡 발송
- **메시지 템플릿**: 예약 확인, 취소, 방문 완료 템플릿
- **발송 상태 관리**: SMS 발송 여부 체크박스 및 상태 표시
- **추가 텍스트**: 메시지에 피드백 링크 등 추가 정보 포함

### 7. 방문자 추적 시스템

- **방문자 카운트**: 실시간 방문자 수 추적
- **세션 관리**: 방문자 세션 정보 저장
- **통계 대시보드**: 방문자 통계 및 분석

### 8. 반응형 디자인

- **모바일 우선**: 모바일 디바이스에 최적화된 반응형 디자인
- **Tailwind CSS**: 모던하고 일관된 UI 디자인
- **애니메이션 효과**: 부드러운 사용자 경험
- **다크 테마**: 눈에 편안한 다크 테마 기반 디자인

### 9. SEO 최적화

- **메타 태그 최적화**: 검색엔진 최적화
- **카카오톡 공유 최적화**: 소셜 미디어 공유 최적화
- **구조화된 데이터**: 검색엔진 이해도 향상

## 📱 사용 가능한 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# TypeScript 타입 검사
npm run lint

# Supabase 마이그레이션 실행
npm run supabase:migrate

# Supabase 타입 생성
npm run supabase:types
```

## 🗄 Supabase 설정

### 1. 프로젝트 생성

[Supabase](https://supabase.com)에서 새 프로젝트를 생성하세요.

### 2. 데이터베이스 설정

Supabase 대시보드의 SQL Editor에서 다음 마이그레이션 파일들을 순서대로 실행하세요:

```sql
-- 1. 기본 테이블 생성
-- 20241201000000_create_reservations_table.sql
-- 20241201000002_create_admin_tables.sql
-- 20241201000003_add_gallery_images_table.sql

-- 2. 인증 및 권한 설정
-- 20241201000005_create_admin_auth.sql
-- 20241201000025_setup_admin_auth_system.sql
-- 20241201000027_setup_comprehensive_rls_policies.sql

-- 3. 서비스 설정
-- 20241201000011_add_service_schedules.sql
-- 20241201000012_add_default_settings.sql
-- 20241201000014_update_service_settings_structure.sql

-- 4. 방문자 추적
-- 20241201000017_create_visitor_counts_table.sql
-- 20241201000018_create_visitor_sessions_table.sql

-- 5. 피드백 시스템
-- 20241201000020_create_feedback_table.sql
-- 20241201000021_add_rating_to_feedback.sql
-- 20241201000031_add_visit_date_to_feedback.sql

-- 6. 예약 상태 관리
-- 20241201000022_add_status_to_reservations.sql
-- 20241201000023_add_visit_details_to_reservations.sql

-- 7. 휴대폰 인증
-- 20241201000016_create_phone_verifications_table.sql

-- 8. 작업 기록
-- 20241201000013_add_likes_views_to_work_records.sql
```

### 3. 환경 변수 설정

프로젝트 설정에서 URL과 anon key를 가져와 `.env.local`에 설정하세요.

### 4. 타입 생성

```bash
# Supabase CLI 설치
npm install -g supabase

# 타입 생성 (YOUR_PROJECT_ID를 실제 프로젝트 ID로 변경)
supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

## 📧 SMS/카카오톡 서비스 설정

### SOLAPI 설정

1. [SOLAPI](https://solapi.com) 계정 생성
2. API Key와 Secret 발급
3. 발신번호 등록
4. 환경 변수에 설정

### 카카오톡 알림톡 설정

1. [카카오톡 비즈니스](https://business.kakao.com) 계정 생성
2. 알림톡 템플릿 등록
3. API 키 발급
4. 환경 변수에 설정

### 메시지 기능

- **휴대폰 인증**: 예약 시 휴대폰 번호 인증을 통한 신원 확인
- **예약 확인 SMS**: 예약 시 자동으로 확인 SMS 발송
- **예약 취소 SMS**: 관리자가 예약 취소 시 고객에게 취소 안내 SMS 발송
- **방문 완료 알림톡**: 방문 완료 시 작업 내용과 피드백 링크 포함한 알림톡 발송
- **실시간 상태 표시**: SMS 전송 상태를 실시간으로 확인 가능
- **발송 옵션**: 각 작업에서 SMS 발송 여부 선택 가능

### 휴대폰 인증 시스템

- **6자리 인증코드**: 숫자 6자리로 구성된 인증코드 발송
- **3분 유효기간**: 인증코드는 3분간 유효하며, 만료 시 재발송 필요
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

## 🔒 보안 및 권한 관리

### RLS (Row Level Security) 정책

- **예약 테이블**: 관리자만 모든 예약 조회 가능
- **피드백 테이블**: 관리자만 피드백 조회 가능
- **작업 기록**: 관리자만 작업 기록 관리 가능
- **방문자 통계**: 관리자만 통계 조회 가능

### 관리자 인증

- **플레인 텍스트 비밀번호**: 간단한 관리자 인증 시스템
- **세션 관리**: 로그인 상태 유지
- **권한 제한**: 관리자 전용 페이지 접근 제한

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
