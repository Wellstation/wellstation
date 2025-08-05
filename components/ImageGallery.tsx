"use client";

import { useState } from "react";

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* 메인 이미지 */}
      <div className="mb-4">
        <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg bg-gray-800 flex items-center justify-center">
          <img
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* 미리보기 이미지들 */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${selectedImage === index
              ? "ring-2 ring-white/50 scale-105"
              : "hover:scale-105"
              }`}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 