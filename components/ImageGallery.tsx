"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { ServiceType } from "../types/enums";
import type { Tables } from "../types/supabase";

type GalleryImage = Tables<'gallery_images'>;

interface ImageGalleryProps {
  serviceType: ServiceType;
  title?: string;
}

export default function ImageGallery({ serviceType, title }: ImageGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchImages();
  }, [serviceType]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("service_type", serviceType)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching gallery images:", error);
        return;
      }
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg bg-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {title && (
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      )}

      {/* 메인 이미지 */}
      <div className="mb-4">
        <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg bg-gray-800 flex items-center justify-center">
          <img
            src={images[selectedImage].image_url}
            alt={images[selectedImage].image_alt || ""}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* 미리보기 이미지들 */}
      {images.length > 1 && (
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${selectedImage === index
                ? "ring-2 ring-white/50 scale-105"
                : "hover:scale-105"
                }`}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.image_url}
                alt={image.image_alt || ""}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 