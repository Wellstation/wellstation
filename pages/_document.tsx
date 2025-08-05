import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 기본 메타데이터 */}
        <meta charSet="utf-8" />
        <meta name="description" content="웰스테이션 - 차량 정비, 튜닝, 주차 서비스를 한 곳에서. 카라반 및 제트스키&보트 보관까지 편리하게 예약하세요." />
        <meta name="keywords" content="차량정비, 튜닝, 주차, 카라반, 제트스키, 보트, 웰스테이션, 예약" />
        <meta name="author" content="웰스테이션" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph 태그 - 카카오톡 공유 최적화 */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="웰스테이션 - 차량 서비스 전문" />
        <meta property="og:description" content="차량 정비, 튜닝, 주차 서비스를 한 곳에서. 카라반 및 제트스키&보트 보관까지 편리하게 예약하세요." />
        <meta property="og:image" content="/logo1.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://wellstation.app" />
        <meta property="og:site_name" content="웰스테이션" />
        <meta property="og:locale" content="ko_KR" />

        {/* 카카오톡 특화 메타데이터 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="웰스테이션 - 차량 서비스 전문" />
        <meta name="twitter:description" content="차량 정비, 튜닝, 주차 서비스를 한 곳에서. 카라반 및 제트스키&보트 보관까지 편리하게 예약하세요." />
        <meta name="twitter:image" content="/logo1.svg" />

        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo1.svg" />

        {/* PWA Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* 추가 메타데이터 */}
        <meta name="theme-color" content="#000000" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
