import type { AppProps } from "next/app";
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>웰스테이션 - 차량 서비스 전문</title>
        <meta name="description" content="차량 정비, 튜닝, 주차 서비스를 한 곳에서. 카라반 및 제트스키&보트 보관까지 편리하게 예약하세요." />
        <meta name="keywords" content="차량정비, 튜닝, 주차, 카라반, 제트스키, 보트, 웰스테이션, 예약" />

        {/* 카카오톡 공유 최적화 */}
        <meta property="og:title" content="웰스테이션 - 차량 서비스 전문" />
        <meta property="og:description" content="차량 정비, 튜닝, 주차 서비스를 한 곳에서. 카라반 및 제트스키&보트 보관까지 편리하게 예약하세요." />
        <meta property="og:image" content="/logo1.svg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wellstation.app" />

        {/* 추가 메타데이터 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
