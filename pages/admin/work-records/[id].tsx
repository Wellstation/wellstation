'use client';
import AdminHeader from '@/components/AdminHeader';
import { supabase } from '@/supabase/client';
import { WorkImage, WorkRecord, convertDatabaseWorkImage, convertDatabaseWorkRecord } from '@/types/api';
import { getServiceTypeLabel } from '@/types/enums';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AdminWorkRecordDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [workRecord, setWorkRecord] = useState<WorkRecord | null>(null);
    const [workImages, setWorkImages] = useState<WorkImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [viewsCount, setViewsCount] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

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
                const convertedRecord = convertDatabaseWorkRecord(data as any);
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
                setIsLiked(prev => !prev);
                setLikesCount(prev => data.action === 'liked' ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

    const handleDelete = async () => {
        if (!id || typeof id !== 'string' || !workRecord) return;

        const workTitle = workRecord.work_title;
        const confirmMessage = `정말로 "${workTitle}" 작업 내역을 삭제하시겠습니까?\n\n이 작업과 관련된 모든 이미지도 함께 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.`;

        if (!confirm(confirmMessage)) {
            return;
        }

        setIsDeleting(true);

        try {
            // 먼저 관련된 이미지들을 삭제
            const { error: imagesError } = await supabase
                .from('work_images')
                .delete()
                .eq('work_record_id', id);

            if (imagesError) {
                console.error('Error deleting work images:', imagesError);
            }

            // 작업 내역 삭제
            const { error } = await supabase
                .from('work_records')
                .delete()
                .eq('id', id);

            if (error) {
                setError('작업 내역을 삭제할 수 없습니다.');
                console.error('Error deleting work record:', error);
            } else {
                // 삭제 성공 시 목록 페이지로 이동
                alert('작업 내역이 성공적으로 삭제되었습니다.');
                router.push('/admin/work-records');
            }
        } catch (error) {
            setError('작업 내역을 삭제할 수 없습니다.');
            console.error('Error deleting work record:', error);
        } finally {
            setIsDeleting(false);
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
                        href="/admin/work-records"
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
                <title>{workRecord.work_title} - 작업 내역 상세 - 관리자</title>
                <meta name="description" content={`${workRecord.work_title} 작업 내역 상세 정보`} />
            </Head>

            <div className="min-h-screen bg-black bg-main-background">
                {/* Header */}
                <AdminHeader
                    title="작업 내역 상세"
                    left={
                        <Link href="/admin/work-records" className="text-white hover:text-gray-300 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                    }
                    right={
                        <div className="flex gap-2">
                            <Link
                                href={`/admin/work-records/new?id=${id}`}
                                className="inline-flex items-center px-3 py-1.5 border border-white/30 text-sm font-medium rounded-md text-white glass btn-hover backdrop-blur-sm"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                편집
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="inline-flex items-center px-3 py-1.5 border border-red-400/30 text-sm font-medium rounded-md text-red-300 glass btn-hover backdrop-blur-sm disabled:opacity-50"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {isDeleting ? '삭제 중...' : '삭제'}
                            </button>
                        </div>
                    }
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
                                            <span className="text-white/50">좋아요:</span>
                                            <span className="font-medium text-white">{likesCount}</span>
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
                            href="/admin/work-records"
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