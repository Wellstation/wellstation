"use client";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import parkingImage from "../../assets/parking_01.jpg";
import { ParkingIcon } from "../../components/icons";
import ImageGallery from "../../components/ImageGallery";
import { SMSResponse } from "../../types/api";

export default function ParkingReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [date, setDate] = useState("");
  const [etc, setEtc] = useState("");
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send SMS
      const text = `[주차예약]
이름: ${name}
연락처: ${phone}
입고 차량 정보: ${vehicleInfo}
예약일시: ${date}
기타 요청사항: ${etc}`;

      const res = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: phone, text }),
      });

      const data: SMSResponse = await res.json();
      if (res.ok && data.message === "SMS sent successfully") {
        setResult("success");
        // Clear form on success
        setName("");
        setPhone("");
        setVehicleInfo("");
        setDate("");
        setEtc("");
      } else {
        setResult("error");
      }
    } catch (error) {
      console.error("Reservation error:", error);
      setResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>주차 예약 - 웰스테이션</title>
        <meta name="description" content="카라반 및 제트스키&보트 보관 서비스 예약. 안전하고 편리한 주차 공간을 제공합니다." />
        <meta name="keywords" content="주차예약, 카라반보관, 제트스키보관, 보트보관, 차량보관, 웰스테이션" />

        {/* 카카오톡 공유 최적화 */}
        <meta property="og:title" content="주차 예약 - 웰스테이션" />
        <meta property="og:description" content="카라반 및 제트스키&보트 보관 서비스 예약. 안전하고 편리한 주차 공간을 제공합니다." />
        <meta property="og:image" content="/parking_01.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wellstation.app/reserve/parking" />

        {/* 추가 메타데이터 */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://wellstation.app/reserve/parking" />
      </Head>

      <div
        className="min-h-screen flex flex-col justify-center items-center bg-main-background px-4 py-8 relative overflow-hidden"
      >
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* 애니메이션 배경 요소들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-green-400/30 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-1 h-1 bg-green-500/40 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-green-300/35 rounded-full animate-pulse delay-2000" />
          <div className="absolute top-60 left-1/4 w-1 h-1 bg-green-400/25 rounded-full animate-pulse delay-1500" />
        </div>

        <div className="w-full max-w-2xl glass-dark p-8 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md relative z-10">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-6 group"
            >
              <svg className="w-5 h-5 mr-2 transform transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              홈으로 돌아가기
            </Link>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 text-white neon-glow">주차 예약</h1>
              <p className="text-white/70">카라반 및 제트스키&보트 보관</p>
            </div>

            {/* 이미지 갤러리 섹션 */}
            <div className="mb-8">
              <ImageGallery
                images={[
                  {
                    src: parkingImage.src,
                    alt: "주차 시설 1"
                  }
                ]}
                title="주차 시설"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">이름</label>
                <input
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">연락처</label>
                <input
                  placeholder="연락처를 입력하세요"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">입고 차량 정보</label>
              <textarea
                placeholder="차량 모델명, 색상, 번호판 등 차량 정보를 입력해주세요"
                value={vehicleInfo}
                onChange={(e) => setVehicleInfo(e.target.value)}
                required
                rows={3}
                className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">예약 일시</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">기타 요청사항</label>
              <textarea
                placeholder="특별한 요청사항이 있다면 입력해주세요 (예: 장기 주차, 특별 관리 등)"
                value={etc}
                onChange={(e) => setEtc(e.target.value)}
                rows={3}
                className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
              w-full glass text-white p-4 rounded-xl font-semibold relative overflow-hidden
              transition-all duration-500 transform hover:scale-105 hover:-translate-y-1
              focus:ring-4 focus:ring-green-400/50 focus:outline-none
              ${isSubmitting ? 'opacity-50 cursor-not-allowed transform-none' : 'btn-hover'}
              group
            `}
              style={{
                background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #065f46 100%)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* 호버 시 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* 상단 하이라이트 */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex items-center justify-center">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span className="text-white/90">처리 중...</span>
                  </>
                ) : (
                  <>
                    <ParkingIcon className="w-6 h-6 mr-2 text-white" />
                    <span className="font-medium">주차 예약 전송</span>
                    <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </div>
            </button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-xl flex items-center backdrop-blur-sm ${result === "success"
              ? "bg-green-500/20 text-green-100 border border-green-400/30"
              : "bg-red-500/20 text-red-100 border border-red-400/30"
              }`}>
              {result === "success" ? (
                <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">
                {result === "success"
                  ? "✅ 주차 예약이 성공적으로 등록되었습니다!"
                  : "❌ 예약 등록에 실패했습니다. 다시 시도해주세요."
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
