'use client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PageHeader from '../../../components/PageHeader';
import { supabase } from '../../../supabase/client';
import { Tables } from '../../../types/supabase';

type Reservation = Tables<'reservations'>;

// 스켈레톤 로딩 컴포넌트
const ReservationSkeleton = () => (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10 animate-pulse">
        <div className="flex items-center gap-4 mb-4">
            <div className="h-6 bg-gray-700 rounded w-24"></div>
            <div className="h-6 bg-gray-700 rounded w-32"></div>
            <div className="h-6 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>
        <div className="h-12 bg-gray-700 rounded w-full"></div>
    </div>
);

export default function ServiceTypeReservationSearch() {
    const router = useRouter();
    const serviceType = router.query["service-type"] || "repair";

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);
    const [isValidServiceType, setIsValidServiceType] = useState(false);

    // 서비스 타입 유효성 검사
    useEffect(() => {
        if (serviceType && typeof serviceType === 'string') {
            const validTypes = ['repair', 'tuning', 'parking'];
            setIsValidServiceType(validTypes.includes(serviceType));
        }
    }, [serviceType]);

    const getServiceTypeLabel = (type: string) => {
        switch (type) {
            case 'repair': return '정비';
            case 'tuning': return '튜닝';
            case 'parking': return '주차';
            default: return type;
        }
    };

    const getServiceTypeIcon = (type: string) => {
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
            case 'reserved': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'visited': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'reserved': return '예약 완료';
            case 'visited': return '방문 완료';
            case 'cancelled': return '예약 취소';
            default: return '알 수 없음';
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

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !phone.trim()) {
            setError('이름과 휴대폰 번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        setSearched(true);

        try {
            const { data, error } = await supabase
                .from('reservations')
                .select('*')
                .eq('name', name.trim())
                .eq('phone', phone.trim())
                .eq('service_type', serviceType as string)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setReservations(data || []);
        } catch (err) {
            console.error('예약 조회 오류:', err);
            setError('예약 조회 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    // 유효하지 않은 서비스 타입인 경우
    if (serviceType && !isValidServiceType) {
        return (
            <div className="min-h-screen bg-black text-white bg-main-background">
                <PageHeader title="잘못된 서비스 타입" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="text-white/80 text-xl font-semibold mb-2">잘못된 서비스 타입입니다</div>
                        <p className="text-white/50 mb-6">요청하신 서비스 타입을 찾을 수 없습니다.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                        >
                            홈으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 로딩 중인 경우
    if (!serviceType || typeof serviceType !== 'string') {
        return (
            <div className="min-h-screen bg-black text-white bg-main-background">
                <PageHeader title="로딩 중..." />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-white/60">페이지를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{getServiceTypeLabel(serviceType)} 예약 조회 - 웰스테이션</title>
                <meta name="description" content={`${getServiceTypeLabel(serviceType)} 서비스 예약 내역을 조회하세요.`} />
            </Head>

            <div className="min-h-screen bg-black text-white bg-main-background">
                {/* 헤더 */}
                <PageHeader title={`${getServiceTypeLabel(serviceType)} 예약 조회`} />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 검색 폼 */}
                    <div className="glass rounded-xl backdrop-blur-sm p-8 mb-8 max-w-lg mx-auto border border-white/10">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                {getServiceTypeIcon(serviceType)}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{getServiceTypeLabel(serviceType)} 예약 조회</h2>
                            <p className="text-white/60">이름과 휴대폰 번호로 {getServiceTypeLabel(serviceType)} 예약 내역을 확인하세요</p>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                                        예약자 이름
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
                                            placeholder="예약자 이름을 입력하세요"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                                        휴대폰 번호
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
                                            placeholder="01012345678 (하이픈 제외)"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow hover:shadow-glow-hover flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        조회 중...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        {getServiceTypeLabel(serviceType)} 예약 조회
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* 결과 */}
                    {searched && (
                        <div className="glass rounded-xl backdrop-blur-sm p-8 border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">{getServiceTypeLabel(serviceType)} 예약 내역</h2>
                                <div className="text-white/60 text-sm">
                                    총 {reservations.length}건의 예약
                                </div>
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <ReservationSkeleton key={i} />
                                    ))}
                                </div>
                            ) : reservations.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="text-white/80 text-xl font-semibold mb-2">{getServiceTypeLabel(serviceType)} 예약 내역이 없습니다</div>
                                    <p className="text-white/50 mb-6">입력하신 정보로 등록된 {getServiceTypeLabel(serviceType)} 예약이 없습니다.</p>
                                    <div className="text-sm text-white/40">
                                        • 이름과 휴대폰 번호를 정확히 입력했는지 확인해주세요<br />
                                        • {getServiceTypeLabel(serviceType)} 예약이 아직 등록되지 않았을 수 있습니다
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {reservations.map((reservation) => (
                                        <div key={reservation.id} className="bg-gray-800/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg">
                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                                <div className="flex-1">
                                                    {/* 헤더 */}
                                                    <div className="flex items-center justify-between gap-3 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor((reservation).status || 'reserved')}`}>
                                                                {getStatusLabel((reservation).status || 'reserved')}
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

                                                    {/* 방문 완료 정보 */}
                                                    {(reservation).status === 'visited' && (
                                                        <div className="border-t border-white/10 pt-4">
                                                            <h4 className="text-sm font-medium text-white/60 mb-3">방문 완료 정보</h4>
                                                            <div className="space-y-3">
                                                                <div className="bg-gray-800/30 rounded-lg p-3">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        <div className="text-white/60 text-xs">작업 내용</div>
                                                                    </div>
                                                                    <div className="text-white/80 text-sm">{(reservation).work_details || '입력된 내용이 없습니다'}</div>
                                                                </div>
                                                                <div className="bg-gray-800/30 rounded-lg p-3">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                        <div className="text-white/60 text-xs">다음 점검일</div>
                                                                    </div>
                                                                    <div className="text-white/80 text-sm">{(reservation).next_inspection_date ? new Date((reservation).next_inspection_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '입력된 내용이 없습니다'}</div>
                                                                </div>
                                                                <div className="bg-gray-800/30 rounded-lg p-3">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                        <div className="text-white/60 text-xs">특이사항</div>
                                                                    </div>
                                                                    <div className="text-white/80 text-sm">{(reservation).notes || '입력된 내용이 없습니다'}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 