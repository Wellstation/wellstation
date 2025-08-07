'use client';
import { supabase } from '@/supabase/client';
import { Reservation, convertDatabaseReservation } from '@/types/api';
import { ServiceType, getServiceTypeLabel } from '@/types/enums';
import { useEffect, useState } from 'react';

interface ReservationSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (reservation: Reservation) => void;
}

const SERVICE_TYPE_OPTIONS = [
    { value: ServiceType.REPAIR, label: getServiceTypeLabel(ServiceType.REPAIR) },
    { value: ServiceType.TUNING, label: getServiceTypeLabel(ServiceType.TUNING) },
    { value: ServiceType.PARKING, label: getServiceTypeLabel(ServiceType.PARKING) }
];

export default function ReservationSearchModal({ isOpen, onClose, onSelect }: ReservationSearchModalProps) {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedServiceType, setSelectedServiceType] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            fetchReservations();
        }
    }, [isOpen]);

    useEffect(() => {
        filterReservations();
    }, [reservations, searchTerm, selectedServiceType]);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('reservations')
                .select('id, name, phone, service_type, reservation_date, vehicle_info')
                .order('reservation_date', { ascending: false });

            if (error) {
                console.error('Error fetching reservations:', error);
            } else {
                const convertedData = (data || []).map((item: any) => convertDatabaseReservation(item));
                setReservations(convertedData);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterReservations = () => {
        let filtered = reservations;

        // 검색어 필터링
        if (searchTerm) {
            filtered = filtered.filter(reservation =>
                reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.phone.includes(searchTerm) ||
                (reservation.vehicle_info && reservation.vehicle_info.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // 서비스 타입 필터링
        if (selectedServiceType) {
            filtered = filtered.filter(reservation => reservation.service_type === selectedServiceType);
        }

        setFilteredReservations(filtered);
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

    const handleSelect = (reservation: Reservation) => {
        onSelect(reservation);
        onClose();
        setSearchTerm('');
        setSelectedServiceType('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-white/20 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">예약 검색</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 검색 필터 */}
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="이름, 전화번호, 차량정보로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                        />
                    </div>
                    <div className="w-48">
                        <select
                            value={selectedServiceType}
                            onChange={(e) => setSelectedServiceType(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        >
                            <option value="" className="bg-gray-800">전체 서비스</option>
                            {SERVICE_TYPE_OPTIONS.map((service) => (
                                <option key={service.value} value={service.value} className="bg-gray-800">
                                    {service.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 예약 목록 */}
                <div className="overflow-y-auto max-h-96">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="text-white">로딩 중...</div>
                        </div>
                    ) : filteredReservations.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-400">검색 결과가 없습니다.</div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredReservations.map((reservation) => (
                                <div
                                    key={reservation.id}
                                    onClick={() => handleSelect(reservation)}
                                    className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-white">{reservation.name}</span>
                                                <span className="text-sm text-gray-400">({reservation.phone})</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-300">
                                                <span>{getServiceTypeLabel(reservation.service_type)}</span>
                                                <span>{formatDate(reservation.reservation_date)}</span>
                                                {reservation.vehicle_info && (
                                                    <span className="text-gray-400">{reservation.vehicle_info}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-blue-400 text-sm">선택</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="text-sm text-gray-400">
                        총 {filteredReservations.length}개의 예약이 검색되었습니다.
                    </div>
                </div>
            </div>
        </div>
    );
} 