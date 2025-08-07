'use client';
import { supabase } from '@/supabase/client';
import { convertDatabaseReservation, Reservation } from '@/types/api';
import { ServiceType } from '@/types/enums';
import { cancelReservation } from '@/utils/reservation';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ReservationDetail() {
    const router = useRouter();
    const { id } = router.query;

    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(true);
    const [smsStatus, setSmsStatus] = useState<"pending" | "success" | "failed" | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [shouldSendSMS, setShouldSendSMS] = useState(true);

    useEffect(() => {
        if (id) {
            fetchReservationData();
        }
    }, [id]);

    // SMS 상태 자동 초기화
    useEffect(() => {
        if (smsStatus) {
            const timer = setTimeout(() => {
                setSmsStatus(null);
            }, 5000); // 5초 후 자동으로 숨김

            return () => clearTimeout(timer);
        }
    }, [smsStatus]);



    const fetchReservationData = async () => {
        try {
            setLoading(true);

            // 예약 정보 가져오기
            const { data: reservationData, error: reservationError } = await supabase
                .from('reservations')
                .select('*')
                .eq('id', id as string)
                .single();

            if (reservationError) {
                console.error('Error fetching reservation:', reservationError);
                alert('예약 정보를 불러오는데 실패했습니다.');
                return;
            }

            setReservation(convertDatabaseReservation(reservationData));
        } catch (error) {
            console.error('Error fetching reservation data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getServiceTypeLabel = (type: ServiceType) => {
        switch (type) {
            case ServiceType.REPAIR: return '정비';
            case ServiceType.TUNING: return '튜닝';
            case ServiceType.PARKING: return '주차';
            default: return type;
        }
    };

    const getServiceTypeIcon = (type: ServiceType) => {
        switch (type) {
            case 'repair':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'tuning':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                );
            case 'parking':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'completed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const formatPhoneNumber = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phone;
    };

    const handleCancelReservation = async () => {
        if (!reservation) return;

        const success = await cancelReservation(
            reservation,
            { setSmsStatus },
            () => router.push('/admin/reservations'),
            cancelReason,
            shouldSendSMS
        );

        if (success) {
            setShowCancelModal(false);
            setCancelReason("");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white bg-main-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-white/60">예약 정보를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!reservation) {
        return (
            <div className="min-h-screen bg-black text-white bg-main-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="text-white/80 text-xl font-semibold mb-2">예약을 찾을 수 없습니다</div>
                        <p className="text-white/50 mb-6">요청하신 예약 정보를 찾을 수 없습니다.</p>
                        <button
                            onClick={() => router.push('/admin/reservations')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                        >
                            예약 목록으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>예약 상세 - 웰스테이션</title>
                <meta name="description" content="예약 상세 정보" />
            </Head>

            <div className="min-h-screen bg-black text-white bg-main-background">
                {/* 헤더 */}
                <header className="bg-black/80 backdrop-blur-sm border-b border-white/20 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <Link href="/admin/reservations" className="mr-4 text-white hover:text-gray-300 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <h1 className="text-2xl font-bold text-white">예약 상세</h1>
                            </div>
                            <div className="flex space-x-4">
                                <Link
                                    href="/admin"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    관리자 홈
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 예약 정보 */}
                    <div className="glass rounded-xl backdrop-blur-sm p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">{getServiceTypeLabel(reservation.service_type)} 예약 상세</h2>
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                            >
                                예약 취소
                            </button>
                        </div>

                        <div className="space-y-6">
                            {reservation && (
                                <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                        <div className="flex-1">
                                            {/* 헤더 */}
                                            <div className="flex items-center justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor('confirmed')}`}>
                                                        예약됨
                                                    </span>
                                                    <span className="text-white/40 text-xs">
                                                        {new Date(reservation.created_at || '').toLocaleString('ko-KR')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* 예약자 정보 */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                                <div className="bg-gray-800/30 rounded-lg p-3">
                                                    <div className="text-white/60 text-xs mb-1">예약자</div>
                                                    <div className="text-white font-medium">{reservation.name}</div>
                                                </div>
                                                <div className="bg-gray-800/30 rounded-lg p-3">
                                                    <div className="text-white/60 text-xs mb-1">연락처</div>
                                                    <div className="text-white font-medium">{formatPhoneNumber(reservation.phone)}</div>
                                                </div>
                                                <div className="bg-gray-800/30 rounded-lg p-3 lg:block hidden">
                                                    <div className="text-white/60 text-xs mb-1">&nbsp;</div>
                                                    <div className="text-white font-medium">&nbsp;</div>
                                                </div>
                                            </div>

                                            {/* 예약 정보 */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                                <div className="bg-gray-800/30 rounded-lg p-3">
                                                    <div className="text-white/60 text-xs mb-1">예약일</div>
                                                    <div className="text-white font-medium">{new Date(reservation.reservation_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                                </div>
                                                <div className="bg-gray-800/30 rounded-lg p-3">
                                                    <div className="text-white/60 text-xs mb-1">예약 시간</div>
                                                    <div className="text-white font-medium">{new Date(reservation.reservation_date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                                <div className="bg-gray-800/30 rounded-lg p-3">
                                                    <div className="text-white/60 text-xs mb-1">차량</div>
                                                    <div className="text-white font-medium">{reservation.model || '미입력'}</div>
                                                </div>
                                            </div>

                                            {/* 추가 정보 */}
                                            {(reservation.request || reservation.vehicle_info || reservation.etc) && (
                                                <div className="border-t border-white/10 pt-4">
                                                    <h4 className="text-sm font-medium text-white/60 mb-3">추가 정보</h4>
                                                    <div className="space-y-3">
                                                        {reservation.request && (
                                                            <div className="bg-gray-800/30 rounded-lg p-3">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                                    </svg>
                                                                    <div className="text-white/60 text-xs">요청사항</div>
                                                                </div>
                                                                <div className="text-white/80 text-sm">{reservation.request}</div>
                                                            </div>
                                                        )}
                                                        {reservation.vehicle_info && (
                                                            <div className="bg-gray-800/30 rounded-lg p-3">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                    </svg>
                                                                    <div className="text-white/60 text-xs">차량정보</div>
                                                                </div>
                                                                <div className="text-white/80 text-sm">{reservation.vehicle_info}</div>
                                                            </div>
                                                        )}
                                                        {reservation.etc && (
                                                            <div className="bg-gray-800/30 rounded-lg p-3">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    <div className="text-white/60 text-xs">기타</div>
                                                                </div>
                                                                <div className="text-white/80 text-sm">{reservation.etc}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 예약 취소 모달 */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4">예약 취소</h3>
                        <p className="text-white/60 mb-4">
                            정말로 이 예약을 취소하시겠습니까? 취소 사유를 입력해주세요.
                        </p>

                        <div className="mb-4">
                            <label className="block text-white/60 text-sm mb-2">취소 사유</label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="취소 사유를 입력해주세요 (예: 고객 요청, 일정 변경 등)"
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="sendSMS"
                                checked={shouldSendSMS}
                                onChange={(e) => setShouldSendSMS(e.target.checked)}
                                className="mr-2 text-white focus:ring-blue-500 border-gray-600 rounded"
                            />
                            <label htmlFor="sendSMS" className="text-white/60 text-sm">SMS 발송</label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason("");
                                    setShouldSendSMS(true); // 취소 시 기본값으로 변경
                                }}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleCancelReservation}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                            >
                                예약 취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 