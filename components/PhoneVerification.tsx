"use client";

import { useEffect } from 'react';

interface PhoneVerificationProps {
    phone: string;
    onVerified: (verified: boolean) => void;
    isVerified: boolean;
    verificationCode: string;
    setVerificationCode: (code: string) => void;
    isVerifying: boolean;
    setIsVerifying: (verifying: boolean) => void;
    countdown: number;
    setCountdown: (countdown: number) => void;
}

export default function PhoneVerification({
    phone,
    onVerified,
    isVerified,
    verificationCode,
    setVerificationCode,
    isVerifying,
    setIsVerifying,
    countdown,
    setCountdown
}: PhoneVerificationProps) {
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, setCountdown]);

    const verifyCode = async () => {
        if (!verificationCode.trim()) {
            alert('인증번호를 입력해주세요.');
            return;
        }

        setIsVerifying(true);

        try {
            const response = await fetch('/api/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone,
                    code: verificationCode,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onVerified(true);
                setVerificationCode('');
                setCountdown(0);
            } else {
                alert(data.error || '인증번호가 올바르지 않습니다.');
            }
        } catch (error) {
            alert('인증 중 오류가 발생했습니다.');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* 인증번호 입력칸과 확인 버튼 */}
            {countdown > 0 && !isVerified && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="인증번호 6자리"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={6}
                    />
                    <button
                        onClick={verifyCode}
                        disabled={isVerifying}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isVerifying ? '확인' : '확인'}
                    </button>
                </div>
            )}
        </div>
    );
} 