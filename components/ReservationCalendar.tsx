'use client';
import { supabase } from '@/supabase/client';
import { Reservation, convertDatabaseReservation } from '@/types/api';
import { ServiceType } from '@/types/enums';
import { useEffect, useState } from 'react';

interface ReservationCalendarProps {
    selectedServiceType: ServiceType | null;
    selectedStatus: string;
    onReservationClick: (reservation: Reservation) => void;
}

export default function ReservationCalendar({
    selectedServiceType,
    selectedStatus,
    onReservationClick
}: ReservationCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [calendarDays, setCalendarDays] = useState<Array<{
        date: Date;
        isCurrentMonth: boolean;
        reservations: Reservation[];
    }>>([]);

    // 현재 월의 첫째 주 월요일부터 마지막 주 일요일까지의 날짜들을 계산
    const generateCalendarDays = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        // 현재 월의 첫째 날
        const firstDayOfMonth = new Date(year, month, 1);
        // 현재 월의 마지막 날
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // 첫째 주의 월요일 (이전 달의 날짜들 포함)
        const firstDayOfWeek = new Date(firstDayOfMonth);
        const dayOfWeek = firstDayOfMonth.getDay();
        firstDayOfWeek.setDate(firstDayOfMonth.getDate() - dayOfWeek);

        // 마지막 주의 일요일 (다음 달의 날짜들 포함)
        const lastDayOfWeek = new Date(lastDayOfMonth);
        const lastDayOfWeekDay = lastDayOfMonth.getDay();
        lastDayOfWeek.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfWeekDay));

        const days: Array<{
            date: Date;
            isCurrentMonth: boolean;
            reservations: Reservation[];
        }> = [];

        const currentDate = new Date(firstDayOfWeek);
        while (currentDate <= lastDayOfWeek) {
            const isCurrentMonth = currentDate.getMonth() === month;
            const dayReservations = reservations.filter(reservation => {
                const reservationDate = new Date(reservation.reservation_date);
                return (
                    reservationDate.getFullYear() === currentDate.getFullYear() &&
                    reservationDate.getMonth() === currentDate.getMonth() &&
                    reservationDate.getDate() === currentDate.getDate()
                );
            });

            days.push({
                date: new Date(currentDate),
                isCurrentMonth,
                reservations: dayReservations
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    // 월별 예약 데이터 가져오기 (최적화된 쿼리)
    const fetchMonthlyReservations = async (date: Date) => {
        try {
            setLoading(true);

            const year = date.getFullYear();
            const month = date.getMonth();
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0, 23, 59, 59);

            let query = supabase
                .from('reservations')
                .select('id, name, phone, service_type, reservation_date, status, vehicle_info, model, vin, created_at')
                .gte('reservation_date', startDate.toISOString())
                .lte('reservation_date', endDate.toISOString())
                .order('reservation_date', { ascending: true });

            // 서비스 타입 필터
            if (selectedServiceType) {
                query = query.eq('service_type', selectedServiceType);
            }

            // 상태 필터
            if (selectedStatus !== 'all') {
                query = query.eq('status', selectedStatus);
            }

            const result = await query;

            if (result.data) {
                const convertedData = result.data.map((item: any) =>
                    convertDatabaseReservation(item)
                );
                setReservations(convertedData);
            }
        } catch (error) {
            console.error('Error fetching monthly reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    // 캘린더 날짜 업데이트
    useEffect(() => {
        setCalendarDays(generateCalendarDays(currentDate));
    }, [currentDate, reservations]);

    // 월 변경 시 데이터 다시 가져오기
    useEffect(() => {
        fetchMonthlyReservations(currentDate);
    }, [currentDate, selectedServiceType, selectedStatus]);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'reserved':
                return 'bg-blue-500';
            case 'visited':
                return 'bg-green-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getServiceTypeBorderColor = (serviceType: ServiceType) => {
        switch (serviceType) {
            case 'parking':
                return 'border-blue-400';
            case 'repair':
                return 'border-yellow-400';
            case 'tuning':
                return 'border-purple-400';
            default:
                return 'border-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg p-6">
            {/* 캘린더 헤더 */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-semibold text-white">{formatDate(currentDate)}</h2>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <button
                    onClick={goToToday}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    오늘
                </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-300">
                        {day}
                    </div>
                ))}
            </div>

            {/* 캘린더 그리드 */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        className={`min-h-[120px] p-2 border border-white/10 rounded-lg transition-colors ${day.isCurrentMonth ? 'bg-white/5 hover:bg-white/10' : 'bg-white/2'
                            } ${!day.isCurrentMonth ? 'opacity-50' : ''}`}
                    >
                        {/* 날짜 */}
                        <div className={`text-sm font-medium mb-1 ${day.isCurrentMonth ? 'text-white' : 'text-gray-400'
                            } ${isToday(day.date) ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                            {day.date.getDate()}
                        </div>

                        {/* 예약 목록 */}
                        <div className="space-y-1">
                            {day.reservations.map((reservation) => (
                                <div
                                    key={reservation.id}
                                    onClick={() => onReservationClick(reservation)}
                                    className={`px-2 py-1 rounded text-xs cursor-pointer transition-all hover:scale-105 ${getStatusColor(reservation.status || 'reserved')} bg-opacity-20 flex items-center gap-2`}
                                >
                                    {/* 서비스타입 배지 */}
                                    <div className={`px-1 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getServiceTypeBorderColor(reservation.service_type).replace('border-', 'bg-').replace('-400', '-500')} bg-opacity-20`}>
                                        {reservation.service_type === 'parking' ? '주' : reservation.service_type === 'repair' ? '수' : '튜'}
                                    </div>
                                    {/* 이름 */}
                                    <div className="font-medium text-white truncate flex-1">
                                        {reservation.name}
                                    </div>
                                    {/* 시간 */}
                                    <div className="text-gray-400 text-xs flex-shrink-0">
                                        {new Date(reservation.reservation_date).toLocaleTimeString('ko-KR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 범례 */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-300">예약 완료</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-300">방문 완료</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-300">예약 취소</span>
                </div>
            </div>
        </div>
    );
}
