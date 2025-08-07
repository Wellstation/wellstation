'use client';
import AdminHeader from '@/components/AdminHeader';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/supabase/client';
import { SERVICE_TYPE_LABELS, ServiceType } from '@/types/enums';
import { Tables } from '@/types/supabase';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState<Tables<"feedback">[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<ServiceType | 'all'>('all');

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching feedbacks:', error);
                return;
            }

            setFeedbacks(data || []);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
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

    const filteredFeedbacks = filter === 'all'
        ? feedbacks
        : feedbacks.filter(feedback => feedback.service_type === filter);

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
                    <title>피드백 관리 - 웰스테이션</title>
                    <meta name="description" content="웰스테이션 피드백 관리" />
                </Head>

                <div className="min-h-screen bg-black">
                    <AdminHeader
                        title="피드백 관리"
                        left={
                            <Link href="/admin" className="text-white hover:text-gray-300 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                        }
                        right={
                            <div className="flex gap-2">
                                <Link
                                    href="/admin"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    관리자 홈
                                </Link>
                            </div>
                        }
                    />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* 필터 */}
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg p-6 mb-6">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                        }`}
                                >
                                    전체 ({feedbacks.length})
                                </button>
                                {Object.values(ServiceType).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilter(type)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === type
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                            }`}
                                    >
                                        {getServiceTypeLabel(type)} ({feedbacks.filter(f => f.service_type === type).length})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 피드백 목록 */}
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/20">
                                <h3 className="text-lg font-medium text-white">
                                    피드백 목록 ({filteredFeedbacks.length}개)
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                서비스
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                이름
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                연락처
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                평점
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                등록일
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                방문일시
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                내용 미리보기
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                상세보기
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {filteredFeedbacks.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-12 text-center">
                                                    <div className="text-gray-400 text-lg">
                                                        {filter === 'all' ? '등록된 피드백이 없습니다.' : '해당 서비스의 피드백이 없습니다.'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredFeedbacks.map((feedback) => (
                                                <tr key={feedback.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getServiceTypeColor(feedback.service_type as ServiceType)}`}>
                                                            {getServiceTypeLabel(feedback.service_type as ServiceType)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-white">
                                                            {feedback.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-300">
                                                            {feedback.contact}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {feedback.rating ? (
                                                            <div className="flex items-center gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <span
                                                                        key={star}
                                                                        className={`text-sm ${star <= feedback.rating!
                                                                            ? 'text-yellow-400'
                                                                            : 'text-gray-400'
                                                                            }`}
                                                                    >
                                                                        ★
                                                                    </span>
                                                                ))}
                                                                <span className="text-white text-sm ml-1">({feedback.rating}/5)</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500 text-sm">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-300">
                                                            {formatDate(feedback.created_at || '')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {feedback.visit_date ? (
                                                            <div className="text-sm text-blue-300">
                                                                {formatDate(feedback.visit_date)}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500 text-sm">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-300 max-w-xs truncate">
                                                            {feedback.content.length > 50
                                                                ? `${feedback.content.substring(0, 50)}...`
                                                                : feedback.content
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Link
                                                            href={`/admin/feedback/${feedback.id}`}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-300 bg-blue-900/20 hover:bg-blue-900/30 transition-colors"
                                                        >
                                                            상세보기
                                                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </AdminLayout>
    );
}

