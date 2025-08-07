'use client';
import AdminHeader from '@/components/AdminHeader';
import ServiceTypeSelector from '@/components/ServiceTypeSelector';
import { supabase } from '@/supabase/client';
import { WorkRecord, convertDatabaseWorkRecord } from '@/types/api';
import { ServiceType } from '@/types/enums';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function WorkRecordsPage() {
    const [workRecords, setWorkRecords] = useState<WorkRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterServiceType, setFilterServiceType] = useState<ServiceType | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        setCurrentPage(1); // 필터가 변경되면 첫 페이지로 리셋
        fetchWorkRecords();
    }, [filterServiceType]);

    useEffect(() => {
        fetchWorkRecords();
    }, [currentPage]);

    const fetchWorkRecords = async () => {
        try {
            setLoading(true);

            let query = supabase
                .from('work_records')
                .select('*')
                .order('work_date', { ascending: false });

            // 필터 적용 - filterServiceType이 null이면 전체 데이터를 가져옴
            if (filterServiceType) {
                query = query.eq('service_type', filterServiceType);
            }

            const result = await query;

            if (result.data) {
                const convertedData = result.data.map((item: any) => convertDatabaseWorkRecord(item));
                setWorkRecords(convertedData);
                setTotalPages(Math.ceil(convertedData.length / itemsPerPage));
            } else {
                setWorkRecords([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching work records:', error);
            setWorkRecords([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const getServiceTypeLabel = (type: string) => {
        switch (type) {
            case 'repair': return '정비';
            case 'tuning': return '튜닝';
            case 'parking': return '주차';
            default: return type;
        }
    };

    const getServiceTypeColor = (type: string) => {
        switch (type) {
            case 'repair': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
            case 'tuning': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
            case 'parking': return 'bg-green-500/20 text-green-300 border border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
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

    const getPaginatedWorkRecords = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return workRecords.slice(startIndex, endIndex);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말로 이 작업 기록을 삭제하시겠습니까?\n\n이 작업과 관련된 모든 이미지도 함께 삭제됩니다.')) {
            return;
        }

        try {
            // 먼저 관련된 이미지들의 정보를 가져옴
            const { data: workImages, error: fetchError } = await supabase
                .from('work_images')
                .select('*')
                .eq('work_record_id', id);

            if (fetchError) {
                console.error('Error fetching work images:', fetchError);
            }

            // Supabase Storage에서 이미지 파일들 삭제
            if (workImages && workImages.length > 0) {
                const imageUrls = workImages.map(img => img.image_url);

                for (const imageUrl of imageUrls) {
                    try {
                        // URL에서 파일 경로 추출
                        const urlParts = imageUrl.split('/');
                        const fileName = urlParts[urlParts.length - 1];
                        const filePath = `work-images/${fileName}`;

                        const { error: storageError } = await supabase.storage
                            .from('work-images')
                            .remove([filePath]);

                        if (storageError) {
                            console.error('Error deleting image from storage:', storageError);
                        }
                    } catch (storageError) {
                        console.error('Error deleting image from storage:', storageError);
                    }
                }
            }

            // 데이터베이스에서 이미지 레코드들 삭제
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
                console.error('Error deleting work record:', error);
                alert('작업 기록 삭제 중 오류가 발생했습니다.');
            } else {
                alert('작업 기록이 삭제되었습니다.');
                fetchWorkRecords();
            }
        } catch (error) {
            console.error('Error deleting work record:', error);
            alert('작업 기록 삭제 중 오류가 발생했습니다.');
        }
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
                <title>작업 기록 관리 - 웰스테이션</title>
                <meta name="description" content="작업 기록 조회 및 관리" />
            </Head>

            <div className="min-h-screen bg-black">
                <AdminHeader
                    title="작업 기록 관리"
                    left={
                        <Link href="/admin" className="text-white hover:text-gray-300 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                    }
                    right={
                        <>
                            <Link
                                href="/admin/work-records/new"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                새 작업 기록
                            </Link>
                            <Link
                                href="/admin"
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                관리자 홈
                            </Link>
                        </>
                    }
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 서비스 타입 선택 */}
                    <ServiceTypeSelector
                        selectedServiceType={filterServiceType}
                        onServiceTypeChange={setFilterServiceType}
                        showEntireOption={true}
                    />

                    {/* 작업 기록 목록 */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/20">
                            <h3 className="text-lg font-medium text-white">
                                작업 기록 목록 ({workRecords.length}개)
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/20">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            작업 제목
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            서비스
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            작업 설명
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            작업일
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            작업
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-transparent divide-y divide-white/20">
                                    {getPaginatedWorkRecords().length > 0 ? (
                                        getPaginatedWorkRecords().map((workRecord) => (
                                            <tr key={workRecord.id} className="hover:bg-white/5">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                    {workRecord.work_title}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceTypeColor(workRecord.service_type)}`}>
                                                        {getServiceTypeLabel(workRecord.service_type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {workRecord.work_description || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {formatDate(workRecord.work_date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Link
                                                        href={`/admin/work-records/${workRecord.id}`}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        상세보기
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(workRecord.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        삭제
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                                {filterServiceType
                                                    ? `${getServiceTypeLabel(filterServiceType)} 작업 내역이 없습니다.`
                                                    : '작업 내역이 없습니다.'
                                                }
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* 페이지네이션 */}
                        {totalPages > 1 && workRecords.length > 0 && (
                            <div className="px-6 py-4 border-t border-white/20">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-300">
                                        총 {workRecords.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
                                        {Math.min(currentPage * itemsPerPage, workRecords.length)}개
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
                    </div>
                </div>
            </div>
        </>
    );
} 