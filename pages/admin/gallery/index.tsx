"use client";

import AdminHeader from "@/components/AdminHeader";
import AdminLayout from "@/components/AdminLayout";
import ServiceTypeSelector from "@/components/ServiceTypeSelector";
import { supabase } from "@/supabase/client";
import { convertDatabaseGalleryImage, GalleryImage } from "@/types/api";
import { SERVICE_TYPE_LABELS, ServiceType } from "@/types/enums";
import { Tables } from '@/types/supabase';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GalleryManagementPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(ServiceType.REPAIR);
    const [uploading, setUploading] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchImages();
    }, [selectedServiceType]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            if (!selectedServiceType) {
                setImages([]);
                return;
            }

            const { data, error } = await supabase
                .from("gallery_images")
                .select("*")
                .eq("service_type", selectedServiceType)
                .order("display_order", { ascending: true });

            if (error) {
                console.error("Error fetching images:", error);
                alert("이미지를 불러오는데 실패했습니다.");
                return;
            }
            const convertedData = (data || []).map((item: Tables<"gallery_images">) => convertDatabaseGalleryImage(item));
            setImages(convertedData);
        } catch (error) {
            console.error("Error fetching images:", error);
            alert("이미지를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            // 파일 확장자 확인
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            if (!allowedTypes.includes(file.type)) {
                alert("지원되는 이미지 형식: JPG, PNG, WebP");
                return;
            }

            // 파일 크기 확인 (5MB 제한)
            if (file.size > 5 * 1024 * 1024) {
                alert("파일 크기는 5MB 이하여야 합니다.");
                return;
            }

            // Supabase Storage에 업로드
            const fileName = `${selectedServiceType}/${Date.now()}_${file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("gallery-images")
                .upload(fileName, file);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                alert("이미지 업로드에 실패했습니다.");
                return;
            }

            // 공개 URL 생성
            const { data: urlData } = supabase.storage
                .from("gallery-images")
                .getPublicUrl(fileName);

            // 데이터베이스에 이미지 정보 저장
            const { error: insertError } = await supabase
                .from("gallery_images")
                .insert({
                    service_type: selectedServiceType!,
                    image_url: urlData.publicUrl,
                    image_alt: file.name,
                    display_order: images.length + 1
                });

            if (insertError) {
                console.error("Insert error:", insertError);
                alert("이미지 정보 저장에 실패했습니다.");
                return;
            }

            // 이미지 목록 새로고침
            await fetchImages();
            alert("이미지가 성공적으로 업로드되었습니다.");
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("이미지 업로드에 실패했습니다.");
        } finally {
            setUploading(false);
        }
    };

    const handleEditImage = async (image: GalleryImage) => {
        setEditingImage(image);
        setShowEditModal(true);
    };

    const handleUpdateImage = async (formData: { image_alt: string; display_order: number; is_active: boolean }) => {
        if (!editingImage) return;

        try {
            const { error } = await supabase
                .from("gallery_images")
                .update({
                    image_alt: formData.image_alt,
                    display_order: formData.display_order,
                    is_active: formData.is_active
                })
                .eq("id", editingImage.id);

            if (error) {
                console.error("Update error:", error);
                alert("이미지 수정에 실패했습니다.");
                return;
            }

            await fetchImages();
            setShowEditModal(false);
            setEditingImage(null);
            alert("이미지가 성공적으로 수정되었습니다.");
        } catch (error) {
            console.error("Error updating image:", error);
            alert("이미지 수정에 실패했습니다.");
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        if (!confirm("정말로 이 이미지를 삭제하시겠습니까?")) return;

        try {
            const { error } = await supabase
                .from("gallery_images")
                .delete()
                .eq("id", imageId);

            if (error) {
                console.error("Delete error:", error);
                alert("이미지 삭제에 실패했습니다.");
                return;
            }

            await fetchImages();
            alert("이미지가 성공적으로 삭제되었습니다.");
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("이미지 삭제에 실패했습니다.");
        }
    };

    const handleToggleActive = async (imageId: string, currentActive: boolean) => {
        try {
            const { error } = await supabase
                .from("gallery_images")
                .update({ is_active: !currentActive })
                .eq("id", imageId);

            if (error) {
                console.error("Toggle error:", error);
                alert("상태 변경에 실패했습니다.");
                return;
            }

            await fetchImages();
        } catch (error) {
            console.error("Error toggling image status:", error);
            alert("상태 변경에 실패했습니다.");
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-black">
                <AdminHeader
                    title="이미지 갤러리 관리"
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 서비스 타입 선택 */}
                    <ServiceTypeSelector
                        selectedServiceType={selectedServiceType}
                        onServiceTypeChange={setSelectedServiceType}
                    />

                    {/* 이미지 업로드 */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-white">이미지 업로드</h2>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                            {uploading && (
                                <div className="flex items-center text-blue-400">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                                    업로드 중...
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                            지원 형식: JPG, PNG, WebP (최대 5MB)
                        </p>
                    </div>

                    {/* 이미지 목록 */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
                        <div className="px-6 py-4 border-b border-white/20">
                            <h2 className="text-xl font-semibold text-white">{selectedServiceType ? SERVICE_TYPE_LABELS[selectedServiceType] : '전체'} 이미지 목록</h2>
                        </div>

                        {loading ? (
                            <div className="p-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                            </div>
                        ) : images.length === 0 ? (
                            <div className="p-6 text-center text-gray-300">
                                등록된 이미지가 없습니다.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {images.map((image) => (
                                    <div key={image.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
                                        <div className="relative">
                                            <img
                                                src={image.image_url}
                                                alt={image.image_alt || ""}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <button
                                                    onClick={() => handleToggleActive(image.id, image.is_active ?? false)}
                                                    className={`px-2 py-1 rounded text-xs font-medium ${image.is_active
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-500 text-white"
                                                        }`}
                                                >
                                                    {image.is_active ? "활성" : "비활성"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-300 mb-1">
                                                        순서: {image.display_order}
                                                    </p>
                                                    <p className="text-sm text-white font-medium">
                                                        {image.image_alt || "제목 없음"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditImage(image)}
                                                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteImage(image.id)}
                                                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 수정 모달 */}
                    {showEditModal && editingImage && (
                        <EditImageModal
                            image={editingImage}
                            onUpdate={handleUpdateImage}
                            onClose={() => {
                                setShowEditModal(false);
                                setEditingImage(null);
                            }}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

// 수정 모달 컴포넌트
function EditImageModal({
    image,
    onUpdate,
    onClose
}: {
    image: GalleryImage;
    onUpdate: (data: { image_alt: string; display_order: number; is_active: boolean }) => void;
    onClose: () => void;
}) {
    const [formData, setFormData] = useState({
        image_alt: image.image_alt || "",
        display_order: image.display_order || 0,
        is_active: image.is_active ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-white/20 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-white">이미지 수정</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            이미지 제목
                        </label>
                        <input
                            type="text"
                            value={formData.image_alt}
                            onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            표시 순서
                        </label>
                        <input
                            type="number"
                            value={formData.display_order.toString()}
                            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active || false}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/10"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-white">
                            활성 상태
                        </label>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            저장
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 