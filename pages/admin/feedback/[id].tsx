'use client';
import AdminHeader from '@/components/AdminHeader';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/supabase/client';
import { SERVICE_TYPE_LABELS, ServiceType } from '@/types/enums';
import { Tables } from '@/types/supabase';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AdminFeedbackDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [feedback, setFeedback] = useState<Tables<"feedback"> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchFeedback();
        }
    }, [id]);

    const fetchFeedback = async () => {
        if (!id || typeof id !== 'string') return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching feedback:', error);
                return;
            }

            setFeedback(data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const getServiceTypeLabel = (type: ServiceType) => {
        return SERVICE_TYPE_LABELS[type];
    };

    const getServiceTypeColor = (type: ServiceType) => {
        switch (type) {
            case ServiceType.REPAIR:
                return 'bg-blue-100 text-blue-800';
            case ServiceType.TUNING:
                return 'bg-purple-100 text-purple-800';
            case ServiceType.PARKING:
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
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

    if (!feedback) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-xl text-white">피드백을 찾을 수 없습니다.</div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <>
                <Head>
                    <title>피드백 상세 - 웰스테이션</title>
                    <meta name="description" content="웰스테이션 피드백 상세 보기" />
                </Head>

                <div className="min-h-screen bg-black">
                    <AdminHeader
                        title="피드백 상세"
                        left={
                            <Link href="/admin/feedback" className="text-white hover:text-gray-300 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                        }
                        right={
                            <Link
                                href="/admin"
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                관리자 홈
                            </Link>
                        }
                    />

                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* 헤더 섹션 */}
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white">피드백 상세</h1>
                                        <p className="text-gray-400 text-sm">고객 피드백 상세 정보</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getServiceTypeColor(feedback.service_type as ServiceType)}`}>
                                    {getServiceTypeLabel(feedback.service_type as ServiceType)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* 왼쪽 컬럼 - 기본 정보 */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* 고객 정보 카드 */}
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg overflow-hidden">
                                    <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            고객 정보
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <span className="text-gray-300 text-sm font-medium">이름</span>
                                            <span className="text-white font-semibold">{feedback.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <span className="text-gray-300 text-sm font-medium">연락처</span>
                                            <span className="text-white">{feedback.contact}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <span className="text-gray-300 text-sm font-medium">등록일</span>
                                            <span className="text-white">{formatDate(feedback.created_at || '')}</span>
                                        </div>
                                        {feedback.visit_date && (
                                            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                                <span className="text-blue-300 text-sm font-medium">방문일시</span>
                                                <span className="text-blue-200 font-semibold">{formatDate(feedback.visit_date)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 평점 카드 */}
                                {feedback.rating && (
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg overflow-hidden">
                                        <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                                고객 평점
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`text-3xl transition-all duration-200 ${star <= feedback.rating!
                                                            ? 'text-yellow-400 drop-shadow-lg'
                                                            : 'text-gray-400'
                                                            }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="text-center">
                                                <span className="text-2xl font-bold text-white">{feedback.rating}</span>
                                                <span className="text-gray-400 text-lg">/ 5</span>
                                            </div>
                                        </div>
                                    </div>
                                )}


                            </div>

                            {/* 오른쪽 컬럼 - 피드백 내용 */}
                            <div className="lg:col-span-2">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg overflow-hidden">
                                    <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-green-600/20 to-blue-600/20">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            피드백 내용
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                            <div className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                                                {feedback.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </AdminLayout>
    );
}
