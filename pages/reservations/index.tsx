'use client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PageHeader from '../../components/PageHeader';

export default function ReservationSearchIndex() {
    const router = useRouter();

    const serviceTypes = [
        {
            id: 'repair',
            label: '정비',
            description: '차량 정비 서비스 예약 조회',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'tuning',
            label: '튜닝',
            description: '차량 튜닝 서비스 예약 조회',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'parking',
            label: '주차',
            description: '주차 서비스 예약 조회',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            ),
            color: 'from-green-500 to-emerald-500'
        }
    ];

    const handleServiceTypeSelect = (serviceType: string) => {
        router.push(`/reservations/${serviceType}/search`);
    };

    return (
        <>
            <Head>
                <title>예약 조회 - 웰스테이션</title>
                <meta name="description" content="서비스 타입을 선택하여 예약 내역을 조회하세요." />
            </Head>

            <div className="min-h-screen bg-black text-white bg-main-background">
                {/* 헤더 */}
                <PageHeader title="예약 조회" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 서비스 타입 선택 */}
                    <div className="glass rounded-xl backdrop-blur-sm p-8 mb-8 border border-white/10">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">예약 조회</h2>
                            <p className="text-white/60">조회할 서비스 타입을 선택해주세요</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {serviceTypes.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => handleServiceTypeSelect(service.id)}
                                    className="group relative bg-gray-800/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:scale-105"
                                >
                                    <div className="text-center">
                                        <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                                            {service.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">{service.label}</h3>
                                        <p className="text-white/60 text-sm">{service.description}</p>

                                        {/* 호버 효과 */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* 화살표 아이콘 */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* 안내 메시지 */}
                        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-white/80">
                                    <p className="font-medium mb-1">예약 조회 안내</p>
                                    <p>• 각 서비스 타입별로 예약 내역을 조회할 수 있습니다</p>
                                    <p>• 이름과 휴대폰 번호로 해당 서비스의 예약만 검색됩니다</p>
                                    <p>• 예약이 없는 경우 해당 서비스에 대한 예약이 없다는 의미입니다</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 