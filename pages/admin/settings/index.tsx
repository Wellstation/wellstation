'use client';
import AdminHeader from '@/components/AdminHeader';
import ServiceTypeSelector from '@/components/ServiceTypeSelector';
import { supabase } from '@/supabase/client';

import { SERVICE_TYPE_LABELS, ServiceType } from '@/types/enums';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const SETTING_KEYS = {
    [ServiceType.REPAIR]: [
        { key: 'start_time', label: '시작 시간', type: 'time', description: '서비스 시작 시간 (예: 09:00)' },
        { key: 'end_time', label: '종료 시간', type: 'time', description: '서비스 종료 시간 (예: 18:00)' },
        { key: 'interval_minutes', label: '예약 간격 (분)', type: 'number', description: '예약 가능한 시간 간격 (분)' },
        { key: 'disable_after_slots', label: '뒷타임 비활성화 수', type: 'number', description: '예약 후 비활성화할 타임슬롯 수' }
    ],
    [ServiceType.TUNING]: [
        { key: 'start_time', label: '시작 시간', type: 'time', description: '서비스 시작 시간 (예: 09:00)' },
        { key: 'end_time', label: '종료 시간', type: 'time', description: '서비스 종료 시간 (예: 18:00)' },
        { key: 'interval_minutes', label: '예약 간격 (분)', type: 'number', description: '예약 가능한 시간 간격 (분)' },
        { key: 'disable_after_slots', label: '뒷타임 비활성화 수', type: 'number', description: '예약 후 비활성화할 타임슬롯 수' }
    ],
    [ServiceType.PARKING]: [
        { key: 'start_time', label: '시작 시간', type: 'time', description: '서비스 시작 시간 (예: 09:00)' },
        { key: 'end_time', label: '종료 시간', type: 'time', description: '서비스 종료 시간 (예: 18:00)' },
        { key: 'interval_minutes', label: '예약 간격 (분)', type: 'number', description: '예약 가능한 시간 간격 (분)' },
        { key: 'disable_after_slots', label: '뒷타임 비활성화 수', type: 'number', description: '예약 후 비활성화할 타임슬롯 수' }
    ]
};

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>(ServiceType.REPAIR);
    const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchData();
    }, [selectedServiceType]);

    const fetchData = async () => {
        try {
            setLoading(true);
            await fetchSettings();
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('service_settings')
                .select('*')
                .eq('service_type', selectedServiceType);

            if (error) {
                console.error('Error fetching settings:', error);
            } else {
                // 데이터베이스에서 가져온 설정값들을 editingSettings에 설정
                const settingsMap: Record<string, string> = {};
                if (data) {
                    data.forEach((setting) => {
                        settingsMap[setting.setting_key] = setting.setting_value;
                    });
                }
                setEditingSettings(settingsMap);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleSaveSettings = async () => {
        try {
            const updates = Object.entries(editingSettings).map(([key, value]) => ({
                service_type: selectedServiceType,
                setting_key: key,
                setting_value: value,
                description: SETTING_KEYS[selectedServiceType].find(s => s.key === key)?.description || ''
            }));

            const { error } = await supabase
                .from('service_settings')
                .upsert(updates, { onConflict: 'service_type,setting_key' });

            if (error) {
                console.error('Error saving settings:', error);
                alert('설정 저장 중 오류가 발생했습니다.');
            } else {
                alert('설정이 저장되었습니다.');
                setEditingSettings({});
                fetchSettings();
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('설정 저장 중 오류가 발생했습니다.');
        }
    };

    const handleResetSettings = () => {
        setEditingSettings({});
    };

    const hasChanges = () => {
        return Object.keys(editingSettings).length > 0;
    };

    const getServiceTypeLabel = (type: ServiceType) => {
        return SERVICE_TYPE_LABELS[type] || type;
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
                <title>서비스 설정 - 웰스테이션</title>
                <meta name="description" content="서비스별 설정 및 시간대 관리" />
            </Head>

            <div className="min-h-screen bg-black">
                <AdminHeader
                    title="서비스 설정"
                    left={
                        <Link href="/admin" className="text-white hover:text-gray-300 transition-colors">
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

                <div className="container mx-auto px-4 py-8">
                    {/* 서비스 타입 선택 */}
                    <ServiceTypeSelector
                        selectedServiceType={selectedServiceType}
                        onServiceTypeChange={(serviceType) => serviceType && setSelectedServiceType(serviceType)}
                        showEntireOption={false}
                    />

                    {/* 설정 관리 섹션 */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-white mb-4">
                            {getServiceTypeLabel(selectedServiceType)} 설정 관리
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {SETTING_KEYS[selectedServiceType].map((setting) => (
                                <div key={setting.key} className="bg-white/5 border border-white/20 rounded-md p-4">
                                    <h4 className="text-md font-medium text-white mb-2">{setting.label}</h4>
                                    <p className="text-sm text-gray-300 mb-2">{setting.description}</p>
                                    <input
                                        type={setting.type}
                                        value={editingSettings[setting.key] || ''}
                                        onChange={(e) => setEditingSettings({ ...editingSettings, [setting.key]: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 버튼 섹션 */}
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={handleResetSettings}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
                            >
                                초기화
                            </button>
                            <button
                                onClick={handleSaveSettings}
                                disabled={!hasChanges()}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${hasChanges()
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 