'use client';
import AdminHeader from '@/components/AdminHeader';
import ReservationCalendar from '@/components/ReservationCalendar';
import ServiceTypeSelector from '@/components/ServiceTypeSelector';
import { supabase } from '@/supabase/client';
import { Reservation, convertDatabaseReservation } from '@/types/api';
import { ServiceType, getServiceTypeColor, getServiceTypeLabel } from '@/types/enums';
import { Tables } from '@/types/supabase';
import { cancelReservation } from '@/utils/reservation';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [smsStatus, setSmsStatus] = useState<"pending" | "success" | "failed" | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
    const [shouldSendSMS, setShouldSendSMS] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const itemsPerPage = 20;

    useEffect(() => {
        fetchReservations();
    }, [selectedServiceType, selectedStatus, searchTerm, currentPage]);

    // SMS 상태 자동 초기화
    useEffect(() => {
        if (smsStatus) {
            const timer = setTimeout(() => {
                setSmsStatus(null);
            }, 5000); // 5초 후 자동으로 숨김

            return () => clearTimeout(timer);
        }
    }, [smsStatus]);

    const fetchReservations = async () => {
        try {
            setLoading(true);

            let query = supabase
                .from('reservations')
                .select('*')
                .order('created_at', { ascending: false });

            // 필터 적용
            if (selectedServiceType) {
                query = query.eq('service_type', selectedServiceType);
            }

            // 상태 필터 적용
            if (selectedStatus !== 'all') {
                query = query.eq('status', selectedStatus);
            }

            // 검색어 적용
            if (searchTerm) {
                query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,vehicle_info.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%,vin.ilike.%${searchTerm}%`);
            }

            const result = await query;

            if (result.data) {
                const convertedData = result.data.map((item: Tables<"reservations">) => convertDatabaseReservation(item));
                setReservations(convertedData);
                setTotalPages(Math.ceil(convertedData.length / itemsPerPage));
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPaginatedReservations = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return reservations.slice(startIndex, endIndex);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'reserved':
                return 'bg-blue-100 text-blue-800';
            case 'visited':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'reserved':
                return '예약 완료';
            case 'visited':
                return '방문 완료';
            case 'cancelled':
                return '예약 취소';
            default:
                return '알 수 없음';
        }
    };

    const handleDelete = async (id: string) => {
        // 취소할 예약 정보 찾기
        const reservationToDelete = reservations.find(r => r.id === id);
        if (!reservationToDelete) {
            alert('예약 정보를 찾을 수 없습니다.');
            return;
        }

        setReservationToCancel(reservationToDelete);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!reservationToCancel) return;

        const success = await cancelReservation(
            reservationToCancel,
            { setSmsStatus },
            fetchReservations,
            cancelReason,
            shouldSendSMS
        );

        if (success) {
            setShowCancelModal(false);
            setCancelReason("");
            setReservationToCancel(null);
        }
    };

    const handleReservationClick = (reservation: Reservation) => {
        // 예약 상세 페이지로 이동
        window.location.href = `/admin/reservations/${reservation.id}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-xl text-white">로딩 중...</div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>예약 관리 - 웰스테이션</title>
                <meta name="description" content="예약 내역 조회 및 관리" />
            </Head>

            <div className="min-h-screen bg-black">
                <AdminHeader
                    title="예약 관리"
                    left={
                        <Link href="/admin" className="text-white hover:text-gray-300 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                    }
                    right={
                        <Link
                            href="/"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            홈으로
                        </Link>
                    }
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 검색 (목록 뷰에서만 표시) */}
                    {viewMode === 'list' && (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg p-6 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                                        검색
                                    </label>
                                    <input
                                        type="text"
                                        id="search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="고객명, 전화번호, 차량정보, 모델명, 차대번호로 검색"
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 서비스 타입 선택 */}
                    <ServiceTypeSelector
                        selectedServiceType={selectedServiceType}
                        onServiceTypeChange={setSelectedServiceType}
                        showEntireOption
                        className="mb-6"
                    />

                    {/* 상태 필터 */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg p-6 mb-6">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedStatus('all')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedStatus === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                    }`}
                            >
                                전체
                            </button>
                            <button
                                onClick={() => setSelectedStatus('reserved')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedStatus === 'reserved'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                    }`}
                            >
                                예약 완료
                            </button>
                            <button
                                onClick={() => setSelectedStatus('visited')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedStatus === 'visited'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                    }`}
                            >
                                방문 완료
                            </button>
                            <button
                                onClick={() => setSelectedStatus('cancelled')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedStatus === 'cancelled'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                    }`}
                            >
                                예약 취소
                            </button>
                        </div>
                    </div>

                    {/* 예약 목록 또는 캘린더 */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/20 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-white">
                                예약 목록 ({reservations.length}개)
                            </h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === 'list'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                        }`}
                                >
                                    목록 보기
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === 'calendar'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                        }`}
                                >
                                    캘린더 보기
                                </button>
                            </div>
                        </div>

                        {viewMode === 'list' ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-white/20">
                                        <thead className="bg-white/5">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    고객명
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    전화번호
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    서비스
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    차량정보
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    예약일시
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    상태
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    등록일
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    작업
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-transparent divide-y divide-white/20">
                                            {getPaginatedReservations().map((reservation) => (
                                                <tr key={reservation.id} className="hover:bg-white/5">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                        {reservation.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {reservation.phone}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceTypeColor(reservation.service_type)}`}>
                                                            {getServiceTypeLabel(reservation.service_type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {reservation.service_type === 'parking'
                                                            ? (reservation.vehicle_info || '-')
                                                            : `${reservation.model || '-'}${reservation.vin ? ` (${reservation.vin})` : ''}`
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {formatDate(reservation.reservation_date)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor((reservation).status || 'reserved')}`}>
                                                            {getStatusLabel((reservation).status || 'reserved')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {formatDate(reservation.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <Link
                                                            href={`/admin/reservations/${reservation.id}`}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        >
                                                            상세보기
                                                        </Link>
                                                        {(reservation).status !== 'cancelled' && (
                                                            <button
                                                                onClick={() => handleDelete(reservation.id)}
                                                                className="text-red-400 hover:text-red-300 transition-colors"
                                                            >
                                                                예약 취소
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* 페이지네이션 */}
                                {totalPages > 1 && (
                                    <div className="px-6 py-4 border-t border-white/20">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-300">
                                                총 {reservations.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
                                                {Math.min(currentPage * itemsPerPage, reservations.length)}개
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-1 text-sm border border-white/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 text-white transition-colors"
                                                >
                                                    이전
                                                </button>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-3 py-1 text-sm border rounded-md transition-colors ${currentPage === page
                                                            ? 'bg-blue-500 text-white border-blue-500'
                                                            : 'border-white/20 hover:bg-white/10 text-white'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-3 py-1 text-sm border border-white/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 text-white transition-colors"
                                                >
                                                    다음
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-6">
                                <ReservationCalendar
                                    selectedServiceType={selectedServiceType}
                                    selectedStatus={selectedStatus}
                                    onReservationClick={handleReservationClick}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 예약 취소 모달 */}
            {showCancelModal && reservationToCancel && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4">예약 취소</h3>
                        <p className="text-white/60 mb-4">
                            <strong>{reservationToCancel.name}</strong>님의 예약을 취소하시겠습니까? 취소 사유를 입력해주세요.
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
                                    setReservationToCancel(null);
                                    setShouldSendSMS(true); // 취소 시 기본값으로 변경
                                }}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirmCancel}
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