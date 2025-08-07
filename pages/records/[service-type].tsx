'use client';
import PageHeader from '@/components/PageHeader';
import { supabase } from '@/supabase/client';
import { WorkRecord, convertDatabaseWorkRecord } from '@/types/api';
import { ServiceType, getServiceTypeLabel } from '@/types/enums';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ServiceWorkRecordsPage() {
    const router = useRouter();
    const service_type = router.query['service-type'];
    const [workRecords, setWorkRecords] = useState<WorkRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 12;

    // 서비스 타입 유효성 검사
    const isValidServiceType = (type: string): type is ServiceType => {
        return Object.values(ServiceType).includes(type as ServiceType);
    };

    useEffect(() => {
        if (service_type && isValidServiceType(service_type as string)) {
            fetchWorkRecords();
        }
    }, [service_type, currentPage]);

    const fetchWorkRecords = async () => {
        if (!service_type || !isValidServiceType(service_type as string)) return;

        try {
            setLoading(true);

            const query = supabase
                .from('work_records')
                .select('*')
                .eq('service_type', service_type as ServiceType)
                .order('work_date', { ascending: false });

            const result = await query;

            if (result.data) {
                const convertedData = result.data.map((item: any) => convertDatabaseWorkRecord(item));
                setWorkRecords(convertedData);
                setTotalPages(Math.ceil(convertedData.length / itemsPerPage));
            }
        } catch (error) {
            console.error('Error fetching work records:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = String(date.getFullYear()).slice(-2); // 2자리 연도
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    const getPaginatedWorkRecords = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return workRecords.slice(startIndex, endIndex);
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

    const recordView = async (workRecordId: string) => {
        try {
            const userIp = await getUserIp();
            await fetch('/api/work-records/view', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workRecordId: workRecordId,
                    userIp: userIp
                }),
            });
        } catch (error) {
            console.error('Error recording view:', error);
        }
    };

    const handleRowClick = async (record: WorkRecord) => {
        // 조회수 기록
        await recordView(record.id);
        // 상세 페이지로 이동
        window.location.href = `/records/detail/${record.id}`;
    };

    // 유효하지 않은 서비스 타입인 경우
    if (service_type && !isValidServiceType(service_type as string)) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center bg-main-background">
                <div className="text-center glass rounded-lg p-8 backdrop-blur-sm">
                    <h3 className="text-lg font-medium text-white mb-4">잘못된 서비스 타입입니다</h3>
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 border border-white/30 text-sm font-medium rounded-md text-white glass btn-hover backdrop-blur-sm"
                    >
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center bg-main-background">
                <div className="text-xl text-white glass rounded-lg p-8 backdrop-blur-sm">로딩 중...</div>
            </div>
        );
    }

    const currentServiceType = service_type as string;
    const serviceLabel = getServiceTypeLabel(currentServiceType as ServiceType);

    return (
        <>
            <Head>
                <title>{serviceLabel} 작업 내역 - 웰스테이션</title>
                <meta name="description" content={`웰스테이션 ${serviceLabel} 작업 내역을 확인하세요`} />
            </Head>

            <div className="min-h-screen bg-black bg-main-background">
                {/* Header */}
                <PageHeader title={`${serviceLabel} 작업 내역`} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Work Records Table */}
                    <div className="glass rounded-lg backdrop-blur-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/20">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider w-16">
                                            번호
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-2/5">
                                            작업 제목
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider w-20">
                                            조회수
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider w-20">
                                            좋아요
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider w-32">
                                            작업일
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-transparent divide-y divide-white/20">
                                    {getPaginatedWorkRecords().map((record, index) => (
                                        <tr key={record.id} className="hover:bg-white/5 cursor-pointer" onClick={() => handleRowClick(record)}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-16 text-center">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white w-2/5">
                                                {record.work_title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-20 text-center">
                                                {record.views_count || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-20 text-center">
                                                {record.likes_count || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-32 text-center">
                                                {formatDate(record.work_date)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm font-medium text-white/70 glass backdrop-blur-sm border border-white/20 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    이전
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${currentPage === page
                                            ? 'bg-blue-600 text-white shadow-glow'
                                            : 'text-white/70 glass backdrop-blur-sm border border-white/20 hover:bg-white/10'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm font-medium text-white/70 glass backdrop-blur-sm border border-white/20 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    다음
                                </button>
                            </nav>
                        </div>
                    )}

                    {/* Empty State */}
                    {workRecords.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="text-white/40 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">{serviceLabel} 작업 내역이 없습니다</h3>
                            <p className="text-white/60">아직 등록된 작업 내역이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 