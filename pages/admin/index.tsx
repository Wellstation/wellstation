'use client';
import AdminHeader from '@/components/AdminHeader';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/supabase/client';
import { convertDatabaseReservation, RecentReservation } from '@/types/api';
import { ServiceType } from '@/types/enums';
import { Tables } from '@/types/supabase';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // 최근 예약 5개 가져오기
            const { data: reservationsResult } = await supabase
                .from('reservations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (reservationsResult) {
                const convertedData = reservationsResult.map((item: Tables<"reservations">) => convertDatabaseReservation(item));
                setRecentReservations(convertedData);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-xl text-white">로딩 중...</div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <>
                <Head>
                    <title>관리자 대시보드 - 웰스테이션</title>
                    <meta name="description" content="웰스테이션 관리자 대시보드" />
                </Head>

                <div className="min-h-screen bg-black">
                    <AdminHeader
                        title="관리자 대시보드"
                        right={
                            <Link
                                href="/"
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                홈으로
                            </Link>
                        }
                    />

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* 메뉴 그리드 */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            <Link href="/admin/reservations" className="bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg rounded-lg hover:bg-white/20 transition-all duration-300 h-48 flex items-center">
                                <div className="p-6 w-full">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex-shrink-0 mb-4">
                                            <div className="w-16 h-16 bg-blue-500 rounded-md flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-medium text-white mb-2">예약 관리</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/admin/settings" className="bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg rounded-lg hover:bg-white/20 transition-all duration-300 h-48 flex items-center">
                                <div className="p-6 w-full">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex-shrink-0 mb-4">
                                            <div className="w-16 h-16 bg-purple-500 rounded-md flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-medium text-white mb-2">서비스 설정</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/admin/work-records" className="bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg rounded-lg hover:bg-white/20 transition-all duration-300 h-48 flex items-center">
                                <div className="p-6 w-full">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex-shrink-0 mb-4">
                                            <div className="w-16 h-16 bg-yellow-500 rounded-md flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-medium text-white mb-2">작업 내역</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/admin/gallery" className="bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg rounded-lg hover:bg-white/20 transition-all duration-300 h-48 flex items-center">
                                <div className="p-6 w-full">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex-shrink-0 mb-4">
                                            <div className="w-16 h-16 bg-indigo-500 rounded-md flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-medium text-white mb-2">이미지 갤러리</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/admin/feedback" className="bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg rounded-lg hover:bg-white/20 transition-all duration-300 h-48 flex items-center">
                                <div className="p-6 w-full">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex-shrink-0 mb-4">
                                            <div className="w-16 h-16 bg-green-500 rounded-md flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-medium text-white mb-2">피드백 관리</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        </AdminLayout>
    );
} 