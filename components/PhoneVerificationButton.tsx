"use client";

import { supabase } from '@/supabase/client';
import { sendSMS } from '@/utils/reservation';

interface PhoneVerificationButtonProps {
    phone: string;
    onVerified: (verified: boolean) => void;
    isVerified: boolean;
    isSending: boolean;
    setIsSending: (sending: boolean) => void;
    countdown: number;
    setCountdown: (countdown: number) => void;
}

export default function PhoneVerificationButton({
    phone,
    onVerified,
    isVerified,
    isSending,
    setIsSending,
    countdown,
    setCountdown
}: PhoneVerificationButtonProps) {

    const sendVerificationCode = async () => {
        if (!phone.trim()) {
            alert('휴대폰 번호를 입력해주세요.');
            return;
        }

        setIsSending(true);

        try {
            // 인증번호 생성 (6자리)
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            // SMS 텍스트 구성
            const smsText = `[웰스테이션] 인증번호: ${verificationCode}`;

            // sendSMS 함수 사용
            const success = await sendSMS(phone, smsText);

            if (success) {
                // Supabase에 인증번호 저장 (3분 후 만료)
                const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();
                const { error } = await supabase
                    .from('phone_verifications')
                    .insert({
                        phone,
                        code: verificationCode,
                        created_at: new Date().toISOString(),
                        expires_at: expiresAt
                    });

                if (error) {
                    console.error('Error saving verification code:', error);
                    alert('인증번호 저장 중 오류가 발생했습니다.');
                    return;
                }

                setCountdown(180);
                onVerified(false);
            } else {
                onVerified(true);
            }
        } catch (error) {
            alert('인증번호 발송 중 오류가 발생했습니다.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <button
            onClick={sendVerificationCode}
            disabled={isSending || countdown > 0 || isVerified}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isVerified ? "완료" : isSending ? "인증" : countdown > 0 ? countdown : "인증"}
        </button>
    );
} 