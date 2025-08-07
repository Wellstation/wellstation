'use client';
import PageHeader from '@/components/PageHeader';
import { supabase } from '@/supabase/client';
import { WorkImage, WorkRecord, convertDatabaseWorkImage, convertDatabaseWorkRecord } from '@/types/api';
import { getServiceTypeLabel } from '@/types/enums';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function WorkRecordDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [workRecord, setWorkRecord] = useState<WorkRecord | null>(null);
    const [workImages, setWorkImages] = useState<WorkImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [viewsCount, setViewsCount] = useState(0);

    useEffect(() => {
        if (id && typeof id === 'string') {
            fetchWorkRecord();
            fetchWorkImages();
            recordView();
            checkLikeStatus();
        }
    }, [id]);

    const fetchWorkRecord = async () => {
        if (!id || typeof id !== 'string') return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('work_records')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                setError('작업 내역을 불러올 수 없습니다.');
                console.error('Error fetching work record:', error);
            } else {
                const convertedRecord = convertDatabaseWorkRecord(data);
                setWorkRecord(convertedRecord);
                setLikesCount(convertedRecord.likes_count || 0);
                setViewsCount(convertedRecord.views_count || 0);
            }
        } catch (error) {
            setError('작업 내역을 불러올 수 없습니다.');
            console.error('Error fetching work record:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkImages = async () => {
        if (!id || typeof id !== 'string') return;

        try {
            const { data, error } = await supabase
                .from('work_images')
                .select('*')
                .eq('work_record_id', id)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching work images:', error);
            } else {
                const convertedData = (data || []).map((item: any) => convertDatabaseWorkImage(item));
                setWorkImages(convertedData);
            }
        } catch (error) {
            console.error('Error fetching work images:', error);
        }
    };

    const checkLikeStatus = async () => {
        if (!id || typeof id !== 'string') return;

        try {
            const userIp = await getUserIp();
            const response = await fetch('/api/work-records/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workRecordId: id,
                    userIp: userIp,
                    checkOnly: true
                }),
            });

            const data = await response.json();

            if (data.success) {
                setIsLiked(data.isLiked);
            }
        } catch (error) {
            console.error('Error checking like status:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = String(date.getFullYear()).slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    const getUserIp = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error getting IP:', error);
            return 'unknown';
        }
    };

    const recordView = async () => {
        if (!id || typeof id !== 'string') return;

        try {
            const userIp = await getUserIp();
            await fetch('/api/work-records/view', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workRecordId: id,
                    userIp: userIp
                }),
            });
        } catch (error) {
            console.error('Error recording view:', error);
        }
    };

    const handleLike = async () => {
        if (!id || typeof id !== 'string') return;

        try {
            const userIp = await getUserIp();
            const response = await fetch('/api/work-records/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workRecordId: id,
                    userIp: userIp
                }),
            });

            const data = await response.json();

            if (data.success) {
                // 좋아요 상태 토글
                setIsLiked(prev => !prev);
                // 좋아요 수 업데이트
                setLikesCount(prev => data.action === 'liked' ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black bg-main-background flex items-center justify-center">
                <div className="text-xl text-white glass rounded-lg p-8 backdrop-blur-sm">로딩 중...</div>
            </div>
        );
    }

    if (error || !workRecord) {
        return (
            <div className="min-h-screen bg-black bg-main-background flex items-center justify-center">
                <div className="text-center glass rounded-lg p-8 backdrop-blur-sm">
                    <div className="text-red-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">오류가 발생했습니다</h3>
                    <p className="text-white/60 mb-4">{error}</p>
                    <Link
                        href={`/records/${workRecord?.service_type}`}
                        className="inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-md text-white glass btn-hover backdrop-blur-sm"
                    >
                        목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{workRecord.work_title} - 작업 내역 - 웰스테이션</title>
                <meta name="description" content={`${workRecord.work_title} 작업 내역 상세 정보`} />
            </Head>

            <div className="min-h-screen bg-black bg-main-background">
                {/* Header */}
                <PageHeader
                    title="작업 내역 상세"
                    backHref={`/records/${workRecord.service_type}`}
                />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Main Content Card */}
                    <div className="glass rounded-2xl backdrop-blur-sm overflow-hidden shadow-2xl">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-600/40 to-purple-600/40 p-6 sm:p-8 lg:p-10 border-b border-white/10">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                        <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-sm w-fit">
                                            {getServiceTypeLabel(workRecord.service_type)}
                                        </span>
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                                            {workRecord.work_title}
                                        </h1>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-white/70 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/50">조회수:</span>
                                            <span className="font-medium text-white">{viewsCount}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/50">작업일:</span>
                                            <span className="font-medium text-white">{formatDate(workRecord.work_date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 sm:p-6 lg:p-8">
                            {/* Description */}
                            {workRecord.work_description && (
                                <div className="mb-6 sm:mb-8">
                                    <div className="bg-gray-800/60 rounded-xl p-4 sm:p-6 border border-white/10">
                                        <p className="text-white/90 whitespace-pre-wrap leading-relaxed text-base sm:text-lg">
                                            {workRecord.work_description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Work Images */}
                            {workImages.length > 0 && (
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                        <span className="w-1 h-5 sm:h-6 bg-green-500 rounded-full"></span>
                                        작업 사진
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                        {workImages.map((image, index) => (
                                            <div key={image.id} className="group">
                                                <div className="aspect-w-16 aspect-h-12 bg-gray-800 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                                    <img
                                                        src={image.image_url}
                                                        alt={image.image_description || `작업 사진 ${index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Like Button - Centered at bottom */}
                            <div className="flex justify-center pt-6 sm:pt-8 border-t border-white/10">
                                <button
                                    onClick={handleLike}
                                    className="flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 hover:border-white/30"
                                >
                                    <span className="text-2xl sm:text-3xl transition-transform duration-200 text-white/80">
                                        {isLiked ? '♥' : '♡'}
                                    </span>
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                        {likesCount}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <Link
                            href={`/records/${workRecord.service_type}`}
                            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border border-white/30 text-base sm:text-lg font-medium rounded-xl text-white glass btn-hover backdrop-blur-sm transition-all duration-200 hover:scale-105"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            목록으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
} 