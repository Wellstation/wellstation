"use client";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import { reservationHelpers } from "@/supabase/helpers";
import { convertDatabaseReservation } from "@/types/api";
import { sendReservationConfirmationSMS } from "@/utils/reservation";
import AgreementCheckboxes from "../../components/AgreementCheckboxes";
import { ParkingIcon } from "../../components/icons";
import ImageGallery from "../../components/ImageGallery";
import PhoneVerification from "../../components/PhoneVerification";
import PhoneVerificationButton from "../../components/PhoneVerificationButton";
import TimeSlotSelector from "../../components/TimeSlotSelector";
import { ServiceType } from "../../types/enums";

export default function ParkingReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [etc, setEtc] = useState("");
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceAgreement, setServiceAgreement] = useState(false);
  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // PhoneVerification 상태 관리
  const [verificationCode, setVerificationCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setSelectedTimeSlot(""); // 날짜가 변경되면 선택된 시간 초기화
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const clearForm = () => {
    setName("");
    setPhone("");
    setVehicleInfo("");
    setSelectedDate("");
    setSelectedTimeSlot("");
    setEtc("");
    setServiceAgreement(false);
    setPrivacyAgreement(false);
    setIsPhoneVerified(false);
    // PhoneVerification 상태도 초기화
    setVerificationCode("");
    setIsSending(false);
    setIsVerifying(false);
    setCountdown(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("");

    try {
      // 지나간 시간대인지 확인
      const now = new Date();
      const reservationTime = new Date(selectedTimeSlot);

      if (reservationTime <= now) {
        alert("지나간 시간대는 예약할 수 없습니다. 다른 시간대를 선택해주세요.");
        setIsSubmitting(false);
        return;
      }

      // Create reservation in Supabase
      const reservationData = {
        name,
        phone,
        service_type: ServiceType.PARKING,
        vehicle_info: vehicleInfo,
        reservation_date: selectedTimeSlot,
        etc: etc || null,
      };

      const createdReservation = await reservationHelpers.createReservation(reservationData);

      // 예약 성공 후 SMS 전송
      if (createdReservation) {
        try {
          const convertedReservation = convertDatabaseReservation(createdReservation);
          await sendReservationConfirmationSMS(convertedReservation);
        } catch (error) {
          console.error('SMS 전송 중 오류:', error);
        }
      }

      // 예약 성공 시 즉시 성공 UI 표시
      setResult("success");
      clearForm();

    } catch (error) {
      console.error("Reservation error:", error);

      // 구체적인 에러 메시지 처리
      if (error instanceof Error) {
        if (error.message.includes("지나간 시간대")) {
          setResult("error");
        } else if (error.message.includes("duplicate") || error.message.includes("중복")) {
          setResult("duplicate");
        } else {
          setResult("error");
        }
      } else {
        setResult("error");
      }
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
                <div className="flex gap-2">
                  <input
                    placeholder="연락처를 입력하세요"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={countdown > 0 || isSending || isPhoneVerified}
                    className="flex-1 bg-white/10 border border-white/20 p-4 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center">
                    <PhoneVerificationButton
                      phone={phone}
                      onVerified={setIsPhoneVerified}
                      isVerified={isPhoneVerified}
                      isSending={isSending}
                      setIsSending={setIsSending}
                      countdown={countdown}
                      setCountdown={setCountdown}
                    />
                  </div>
                </div>
                {/* 인증번호 입력칸과 확인 버튼 - 휴대폰 입력칸 아래에 배치 */}
                <PhoneVerification
                  phone={phone}
                  onVerified={setIsPhoneVerified}
                  isVerified={isPhoneVerified}
                  verificationCode={verificationCode}
                  setVerificationCode={setVerificationCode}
                  isVerifying={isVerifying}
                  setIsVerifying={setIsVerifying}
                  countdown={countdown}
                  setCountdown={setCountdown}
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
              <label className="text-white/80 text-sm font-medium">예약 날짜</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                required
                min={new Date().toISOString().split('T')[0]} // 오늘 이후만 선택 가능
                className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            <TimeSlotSelector
              serviceType={ServiceType.PARKING}
              selectedDate={selectedDate}
              onTimeSlotSelect={handleTimeSlotSelect}
              selectedTimeSlot={selectedTimeSlot}
            />

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

            <AgreementCheckboxes
              serviceAgreement={serviceAgreement}
              privacyAgreement={privacyAgreement}
              onServiceAgreementChange={setServiceAgreement}
              onPrivacyAgreementChange={setPrivacyAgreement}
            />

            <button
              type="submit"
              disabled={isSubmitting || !selectedTimeSlot || !serviceAgreement || !privacyAgreement || !isPhoneVerified}
              className={`
              w-full glass text-white p-4 rounded-xl font-semibold relative overflow-hidden
              transition-all duration-500 transform hover:scale-105 hover:-translate-y-1
              focus:ring-4 focus:ring-green-400/50 focus:outline-none
              ${isSubmitting || !selectedTimeSlot || !serviceAgreement || !privacyAgreement ? 'opacity-50 cursor-not-allowed transform-none' : 'btn-hover'}
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

          {/* 결과 메시지 */}
          {result && (
            <div className={`mt-6 p-4 rounded-xl backdrop-blur-sm ${result === "success"
              ? "bg-green-500/20 text-green-100 border border-green-400/30"
              : result === "duplicate"
                ? "bg-yellow-500/20 text-yellow-100 border border-yellow-400/30"
                : "bg-red-500/20 text-red-100 border border-red-400/30"
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {result === "success" ? (
                    <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : result === "duplicate" ? (
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
                      ? "주차 예약이 성공적으로 등록되었습니다!"
                      : result === "duplicate"
                        ? "이미 예약된 시간대입니다. 다른 시간을 선택해주세요."
                        : "예약 등록에 실패했습니다. 다시 시도해주세요."
                    }
                  </span>
                </div>
                {result === "success" && (
                  <a
                    href="/reservations/parking/search"
                    className="text-green-300 hover:text-green-200 underline decoration-green-400/50 hover:decoration-green-400 transition-all duration-300 text-sm"
                  >
                    예약 조회
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 이미지 갤러리 섹션 */}
        <div className="w-full max-w-2xl mt-8 glass-dark p-8 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md relative z-10">
          <ImageGallery
            serviceType={ServiceType.PARKING}
          />
        </div>
      </div>
    </>
  );
}
