'use client';
import AdminHeader from '@/components/AdminHeader';
import { supabase } from '@/supabase/client';
import { WorkImage, convertDatabaseWorkImage, convertDatabaseWorkRecord } from '@/types/api';
import { ServiceType, getServiceTypeLabel } from '@/types/enums';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SERVICE_TYPE_OPTIONS = [
    { value: ServiceType.REPAIR, label: getServiceTypeLabel(ServiceType.REPAIR) },
    { value: ServiceType.TUNING, label: getServiceTypeLabel(ServiceType.TUNING) },
    { value: ServiceType.PARKING, label: getServiceTypeLabel(ServiceType.PARKING) }
];

export default function WorkRecordFormPage() {
    const router = useRouter();
    const { id } = router.query;
    const isEditMode = !!id;

    const [loading, setLoading] = useState(true);
    const [workRecord, setWorkRecord] = useState({
        service_type: ServiceType.REPAIR,
        work_title: '',
        work_description: '',
        work_date: new Date().toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM 형식
    });
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<WorkImage[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditMode && id && typeof id === 'string') {
            fetchWorkRecord();
        } else {
            setLoading(false);
        }
    }, [id, isEditMode]);

    const fetchWorkRecord = async () => {
        if (!id || typeof id !== 'string') return;

        try {
            setLoading(true);

            // 작업 내역 가져오기
            const { data: workRecordData, error: workRecordError } = await supabase
                .from('work_records')
                .select('*')
                .eq('id', id)
                .single();

            if (workRecordError) {
                console.error('Error fetching work record:', workRecordError);
                alert('작업 내역을 불러올 수 없습니다.');
                router.push('/admin/work-records');
                return;
            }

            const convertedRecord = convertDatabaseWorkRecord(workRecordData);
            setWorkRecord({
                service_type: convertedRecord.service_type,
                work_title: convertedRecord.work_title,
                work_description: convertedRecord.work_description || '',
                work_date: new Date(convertedRecord.work_date).toISOString().slice(0, 16)
            });

            // 기존 이미지 가져오기
            const { data: imagesData, error: imagesError } = await supabase
                .from('work_images')
                .select('*')
                .eq('work_record_id', id)
                .order('created_at', { ascending: true });

            if (!imagesError && imagesData) {
                const convertedImages = imagesData.map((item: any) => convertDatabaseWorkImage(item));
                setExistingImages(convertedImages);
            }
        } catch (error) {
            console.error('Error fetching work record:', error);
            alert('작업 내역을 불러올 수 없습니다.');
            router.push('/admin/work-records');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(prev => [...prev, ...files]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (imageId: string) => {
        try {
            // 먼저 이미지 정보를 가져옴
            const { data: imageData, error: fetchError } = await supabase
                .from('work_images')
                .select('*')
                .eq('id', imageId)
                .single();

            if (fetchError) {
                console.error('Error fetching image data:', fetchError);
                alert('이미지 정보를 가져올 수 없습니다.');
                return;
            }

            // Supabase Storage에서 이미지 파일 삭제
            if (imageData && imageData.image_url) {
                try {
                    const urlParts = imageData.image_url.split('/');
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

            // 데이터베이스에서 이미지 레코드 삭제
            const { error } = await supabase
                .from('work_images')
                .delete()
                .eq('id', imageId);

            if (error) {
                console.error('Error deleting image:', error);
                alert('이미지 삭제 중 오류가 발생했습니다.');
                return;
            }

            setExistingImages(prev => prev.filter(img => img.id !== imageId));
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('이미지 삭제 중 오류가 발생했습니다.');
        }
    };

    const uploadImages = async (workRecordId: string) => {
        if (images.length === 0) return;

        const uploadPromises = images.map(async (image, index) => {
            const fileExt = image.name.split('.').pop();
            const fileName = `${workRecordId}_${Date.now()}_${index}.${fileExt}`;
            const filePath = `work-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('work-images')
                .upload(filePath, image);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                return null;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('work-images')
                .getPublicUrl(filePath);

            return {
                work_record_id: workRecordId,
                image_url: publicUrl,
                image_description: image.name
            };
        });

        const imageData = await Promise.all(uploadPromises);
        const validImageData = imageData.filter(data => data !== null);

        if (validImageData.length > 0) {
            const { error } = await supabase
                .from('work_images')
                .insert(validImageData);

            if (error) {
                console.error('Error saving image data:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!workRecord.work_title.trim()) {
            alert('작업 제목을 입력해주세요.');
            return;
        }

        setUploading(true);

        try {
            const workRecordData = {
                service_type: workRecord.service_type,
                work_title: workRecord.work_title,
                work_description: workRecord.work_description,
                work_date: new Date(workRecord.work_date).toISOString()
            };

            if (isEditMode && id && typeof id === 'string') {
                // 수정 모드
                const { error } = await supabase
                    .from('work_records')
                    .update(workRecordData)
                    .eq('id', id);

                if (error) {
                    console.error('Error updating work record:', error);
                    alert('작업 기록 수정 중 오류가 발생했습니다.');
                    return;
                }

                // 새 이미지 업로드
                if (images.length > 0) {
                    await uploadImages(id);
                }

                alert('작업 기록이 수정되었습니다!');
                router.push(`/admin/work-records/${id}`);
            } else {
                // 새로 생성 모드
                const { data: workRecordResult, error } = await supabase
                    .from('work_records')
                    .insert(workRecordData)
                    .select()
                    .single();

                if (error) {
                    console.error('Error creating work record:', error);
                    alert('작업 기록 생성 중 오류가 발생했습니다.');
                    return;
                }

                // 이미지 업로드
                if (images.length > 0) {
                    await uploadImages(workRecordResult.id);
                }

                alert('작업 기록이 생성되었습니다!');
                router.push('/admin/work-records');
            }
        } catch (error) {
            console.error('Error saving work record:', error);
            alert('작업 기록 저장 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
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
                <title>{isEditMode ? '작업 기록 수정' : '새 작업 기록'} - 관리자</title>
                <meta name="description" content={isEditMode ? "작업 기록 수정" : "새로운 작업 기록 생성"} />
            </Head>

            <div className="min-h-screen bg-black">
                <AdminHeader
                    title={isEditMode ? '작업 기록 수정' : '새 작업 기록'}
                    left={
                        <Link href={isEditMode ? `/admin/work-records/${id}` : "/admin/work-records"} className="text-white hover:text-gray-300 transition-colors">
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

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex gap-4">
                                {/* 서비스 타입 */}
                                <div>
                                    <label htmlFor="service_type" className="block text-sm font-medium text-gray-300 mb-2">
                                        서비스 타입
                                    </label>
                                    <select
                                        id="service_type"
                                        value={workRecord.service_type}
                                        onChange={(e) => setWorkRecord({ ...workRecord, service_type: e.target.value as ServiceType })}
                                        required
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    >
                                        {SERVICE_TYPE_OPTIONS.map((service) => (
                                            <option key={service.value} value={service.value} className="bg-gray-800">
                                                {service.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 작업 일시 */}
                                <div>
                                    <label htmlFor="work_date" className="block text-sm font-medium text-gray-300 mb-2">
                                        작업 일시
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="work_date"
                                        value={workRecord.work_date}
                                        onChange={(e) => setWorkRecord({ ...workRecord, work_date: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    />
                                </div>
                            </div>

                            {/* 작업 제목 */}
                            <div>
                                <label htmlFor="work_title" className="block text-sm font-medium text-gray-300 mb-2">
                                    작업 제목
                                </label>
                                <input
                                    type="text"
                                    id="work_title"
                                    value={workRecord.work_title}
                                    onChange={(e) => setWorkRecord({ ...workRecord, work_title: e.target.value })}
                                    required
                                    placeholder="작업 제목을 입력해주세요"
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                />
                            </div>

                            {/* 작업 내용 */}
                            <div>
                                <label htmlFor="work_description" className="block text-sm font-medium text-gray-300 mb-2">
                                    작업 내용
                                </label>
                                <textarea
                                    id="work_description"
                                    value={workRecord.work_description}
                                    onChange={(e) => setWorkRecord({ ...workRecord, work_description: e.target.value })}
                                    rows={6}
                                    placeholder="작업 내용을 상세히 입력해주세요"
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                />
                            </div>

                            {/* 기존 이미지 (수정 모드에서만 표시) */}
                            {isEditMode && existingImages.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        기존 이미지
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {existingImages.map((image, index) => (
                                            <div key={image.id} className="relative group">
                                                <img
                                                    src={image.image_url}
                                                    alt={image.image_description || `기존 이미지 ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(image.id)}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 이미지 업로드 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    {isEditMode ? '새 이미지 추가' : '작업 이미지'}
                                </label>
                                <div className="space-y-4">
                                    {/* 이미지 업로드 버튼 */}
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/20 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-400">
                                                    <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
                                            </div>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {/* 업로드된 이미지 미리보기 */}
                                    {images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 버튼 */}
                            <div className="flex justify-end space-x-3 pt-6 border-t border-white/20">
                                <Link
                                    href={isEditMode ? `/admin/work-records/${id}` : "/admin/work-records"}
                                    className="px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                >
                                    취소
                                </Link>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
                                >
                                    {uploading ? '저장 중...' : (isEditMode ? '수정' : '작성')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
} 