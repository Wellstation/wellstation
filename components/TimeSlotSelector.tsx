"use client";

import { useEffect, useState } from "react";
import { reservationHelpers } from "../supabase/helpers";
import { ServiceType } from "../types/enums";

interface TimeSlotSelectorProps {
    serviceType: ServiceType;
    selectedDate: string;
    onTimeSlotSelect: (timeSlot: string) => void;
    selectedTimeSlot?: string;
    className?: string;
}

export default function TimeSlotSelector({
    serviceType,
    selectedDate,
    onTimeSlotSelect,
    selectedTimeSlot,
    className = "",
}: TimeSlotSelectorProps) {
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedDate) {
            setAvailableSlots([]);
            return;
        }

        const fetchAvailableSlots = async () => {
            setLoading(true);
            setError(null);

            try {
                const slots = await reservationHelpers.getAvailableTimeSlots(
                    serviceType,
                    selectedDate
                );
                setAvailableSlots(slots);
            } catch (err) {
                console.error("Error fetching available time slots:", err);
                setError("시간대를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableSlots();
    }, [selectedDate, serviceType]);

    const formatTimeSlot = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "long",
        });
    };

    // 지나간 시간대인지 확인하는 함수
    const isPastTime = (timeSlot: string) => {
        const now = new Date();
        const slotTime = new Date(timeSlot);
        return slotTime <= now;
    };

    // 현재 시간과 비교하여 지나간 시간대 필터링
    const filteredSlots = availableSlots.filter(slot => !isPastTime(slot));

    if (!selectedDate) {
        return (
            <div className={`space-y-2 ${className}`}>
                <label className="text-white/80 text-sm font-medium">예약 시간</label>
                <div className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white/50">
                    날짜를 먼저 선택해주세요
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-white/80 text-sm font-medium">예약 시간</label>

            {loading && (
                <div className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white/70 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    가능한 시간대를 불러오는 중...
                </div>
            )}

            {error && (
                <div className="w-full bg-red-500/20 border border-red-400/30 p-4 rounded-xl text-red-100">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="text-white/60 text-sm mb-3">
                        {formatDate(selectedDate)} - 가능한 시간대
                    </div>

                    {filteredSlots.length === 0 ? (
                        <div className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white/50 text-center">
                            선택한 날짜에 가능한 시간대가 없습니다.
                        </div>
                    ) : (
                        <div className="h-48 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
                                {availableSlots.map((slot) => {
                                    const isPast = isPastTime(slot);
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => !isPast && onTimeSlotSelect(slot)}
                                            disabled={isPast}
                                            className={`
                                                p-4 rounded-xl text-sm font-medium transition-all duration-300
                                                backdrop-blur-sm border
                                                ${isPast
                                                    ? "bg-gray-500/30 text-gray-400 border-gray-500/30 cursor-not-allowed opacity-50"
                                                    : selectedTimeSlot === slot
                                                        ? "bg-gradient-to-br from-blue-500/90 via-purple-500/90 to-blue-600/90 text-white border-blue-400/60 shadow-lg shadow-blue-500/30 transform scale-105"
                                                        : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white hover:border-white/30 hover:shadow-lg hover:shadow-white/10 hover:scale-105"
                                                }
                                                focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent
                                            `}
                                        >
                                            {formatTimeSlot(slot)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 