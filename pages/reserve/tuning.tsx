"use client";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import tuningImage1 from "../../assets/tuning_01.jpg";
import tuningImage2 from "../../assets/tuning_02.jpg";
import tuningImage3 from "../../assets/tuning_03.jpg";
import tuningImage4 from "../../assets/tuning_04.jpg";
import { TuningIcon } from "../../components/icons";
import ImageGallery from "../../components/ImageGallery";
import { SMSResponse } from "../../types/api";

export default function TuningReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [date, setDate] = useState("");
  const [request, setRequest] = useState("");
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send SMS
      const text = `[튜닝 예약]
이름: ${name}
연락처: ${phone}
모델명: ${model}
연식: ${year}
차대번호: ${vin}
요청사항: ${request}`;

      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phone, text }),
      });

      const data: SMSResponse = await res.json();
      if (res.ok && data.message === "SMS sent successfully") {
        setResult("success");
        // Clear form on success
        setName("");
        setPhone("");
        setModel("");
        setYear("");
        setVin("");
        setRequest("");
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
        <title>튜닝 예약 - 웰스테이션</title>
        <meta name="description" content="차량 성능 튜닝 서비스 예약. 엔진 튜닝, 배기관 교체, ECU 튜닝 등 전문 튜닝 서비스를 제공합니다." />
        <meta name="keywords" content="차량튜닝, 엔진튜닝, ECU튜닝, 배기관튜닝, 성능튜닝, 웰스테이션" />

        {/* 카카오톡 공유 최적화 */}
        <meta property="og:title" content="튜닝 예약 - 웰스테이션" />
        <meta property="og:description" content="차량 성능 튜닝 서비스 예약. 엔진 튜닝, 배기관 교체, ECU 튜닝 등 전문 튜닝 서비스를 제공합니다." />
        <meta property="og:image" content="/tuning_01.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wellstation.app/reserve/tuning" />

        {/* 추가 메타데이터 */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://wellstation.app/reserve/tuning" />
      </Head>

      <div
        className="min-h-screen flex flex-col justify-center items-center bg-tuning-background px-4 py-8 relative overflow-hidden"
      >
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* 애니메이션 배경 요소들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-1 h-1 bg-purple-500/40 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-purple-300/35 rounded-full animate-pulse delay-2000" />
          <div className="absolute top-60 left-1/4 w-1 h-1 bg-purple-400/25 rounded-full animate-pulse delay-1500" />
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
              <h1 className="text-3xl font-bold mb-2 text-white neon-glow">튜닝 예약</h1>
              <p className="text-white/70">차량 성능 튜닝 서비스</p>
            </div>

            {/* 이미지 갤러리 섹션 */}
            <div className="mb-8">
              <ImageGallery
                images={[
                  {
                    src: tuningImage1.src,
                    alt: "튜닝 시설 1"
                  },
                  {
                    src: tuningImage2.src,
                    alt: "튜닝 시설 2"
                  },
                  {
                    src: tuningImage3.src,
                    alt: "튜닝 시설 3"
                  },
                  {
                    src: tuningImage4.src,
                    alt: "튜닝 시설 4"
                  }
                ]}
                title="튜닝 시설"
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
                  className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">연락처</label>
                <input
                  placeholder="연락처를 입력하세요"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">모델명</label>
                <input
                  placeholder="차량 모델명"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">연식</label>
                <input
                  placeholder="차량 연식"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">차대번호</label>
                <input
                  placeholder="차대번호 (VIN)"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">예약 일시</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">튜닝 요청사항</label>
              <textarea
                placeholder="원하는 튜닝 사항을 자세히 입력해주세요 (예: 엔진 튜닝, 배기관 교체, ECU 튜닝 등)"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                rows={4}
                className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full glass text-white p-4 rounded-xl font-semibold relative overflow-hidden
                transition-all duration-500 transform hover:scale-105 hover:-translate-y-1
                focus:ring-4 focus:ring-purple-400/50 focus:outline-none
                ${isSubmitting ? 'opacity-50 cursor-not-allowed transform-none' : 'btn-hover'}
                group
              `}
              style={{
                background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #581c87 100%)',
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
                    <TuningIcon className="w-6 h-6 mr-2 text-white" />
                    <span className="font-medium">튜닝 예약 전송</span>
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
              : result === "conflict"
                ? "bg-yellow-500/20 text-yellow-100 border border-yellow-400/30"
                : "bg-red-500/20 text-red-100 border border-red-400/30"
              }`}>
              {result === "success" ? (
                <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : result === "conflict" ? (
                <svg className="w-5 h-5 mr-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">
                {result === "success"
                  ? "✅ 튜닝 예약이 성공적으로 등록되었습니다!"
                  : result === "conflict"
                    ? "⚠️ 선택하신 시간에 이미 예약이 있습니다. 다른 시간을 선택해주세요."
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
