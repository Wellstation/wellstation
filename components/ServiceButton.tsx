import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface ServiceButtonProps {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    description: string;
    bgColor: string;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    centerCardId?: string | null;
}

export default function ServiceButton({
    id,
    label,
    href,
    icon,
    description,
    bgColor,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    centerCardId
}: ServiceButtonProps) {
    const [isMobile, setIsMobile] = useState(false);

    // 모바일 감지
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // 768px 미만을 모바일로 간주
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 모바일에서는 중앙 카드만 효과 표시, 데스크톱에서는 호버 효과 사용
    const shouldShowEffects = isMobile ? (centerCardId === id) : isHovered;

    // 배경 색상 매핑
    const getBackgroundStyle = () => {
        switch (bgColor) {
            case 'from-blue-600 via-blue-700 to-blue-800':
                return 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1e3a8a 100%)';
            case 'from-purple-600 via-purple-700 to-purple-800':
                return 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #581c87 100%)';
            case 'from-green-600 via-green-700 to-green-800':
                return 'linear-gradient(135deg, #065f46 0%, #059669 50%, #065f46 100%)';
            default:
                return 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1e3a8a 100%)';
        }
    };

    // 제목 전용 네온 글로우 스타일
    const getTitleNeonStyle = () => {
        switch (bgColor) {
            case 'from-blue-600 via-blue-700 to-blue-800':
                return {
                    textShadow: shouldShowEffects
                        ? '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 30px #00f5ff, 0 0 40px #00f5ff'
                        : '0 0 5px rgba(255, 255, 255, 0.3)',
                    transition: 'text-shadow 0.5s ease-in-out, transform 0.5s ease-in-out'
                };
            case 'from-purple-600 via-purple-700 to-purple-800':
                return {
                    textShadow: shouldShowEffects
                        ? '0 0 10px #bf00ff, 0 0 20px #bf00ff, 0 0 30px #bf00ff, 0 0 40px #bf00ff'
                        : '0 0 5px rgba(255, 255, 255, 0.3)',
                    transition: 'text-shadow 0.5s ease-in-out, transform 0.5s ease-in-out'
                };
            case 'from-green-600 via-green-700 to-green-800':
                return {
                    textShadow: shouldShowEffects
                        ? '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41, 0 0 40px #00ff41'
                        : '0 0 5px rgba(255, 255, 255, 0.3)',
                    transition: 'text-shadow 0.5s ease-in-out, transform 0.5s ease-in-out'
                };
            default:
                return {
                    textShadow: shouldShowEffects
                        ? '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 30px #00f5ff, 0 0 40px #00f5ff'
                        : '0 0 5px rgba(255, 255, 255, 0.3)',
                    transition: 'text-shadow 0.5s ease-in-out, transform 0.5s ease-in-out'
                };
        }
    };

    return (
        <Link href={href} className="block">
            <div
                className="group relative cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${id === 'repair' ? '0s' : id === 'tuning' ? '0.2s' : '0.4s'}` }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {/* 메인 카드 */}
                <div
                    className={`
                     relative rounded-3xl overflow-hidden
                     transition-all duration-700 ease-out transform
                     group-hover:scale-105 group-hover:-translate-y-2
                     ${shouldShowEffects ? 'ring-4 ring-white/30 shadow-2xl' : 'shadow-xl'}
                     ${isMobile && shouldShowEffects ? 'scale-105 -translate-y-2' : ''}
                     backdrop-blur-sm card-hover
                     w-[280px] h-[320px] sm:w-[320px] sm:h-[400px]
                     min-w-[280px] min-h-[320px] sm:min-w-[320px] sm:min-h-[400px]
                     max-w-[280px] max-h-[320px] sm:max-w-[320px] sm:max-h-[400px]
                 `}
                    style={{
                        background: getBackgroundStyle(),
                        boxShadow: shouldShowEffects
                            ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                            : '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                    }}
                >
                    {/* 배경 오버레이 */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                    {/* 상단 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

                    {/* 콘텐츠 컨테이너 */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 sm:p-8 text-white text-center">

                        {/* 아이콘 - 글로우 효과 없음 */}
                        <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                            {icon}
                        </div>

                        {/* 제목 - 네온 글로우 효과만 적용 */}
                        <h3
                            className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-white drop-shadow-lg transition-all duration-500 group-hover:scale-105"
                            style={getTitleNeonStyle()}
                        >
                            {label}
                        </h3>

                        {/* 설명 - 글로우 효과 없음 */}
                        <p className="text-sm sm:text-base text-white/90 text-center leading-relaxed px-2 sm:px-4 drop-shadow-md group-hover:text-white transition-colors duration-300">
                            {description}
                        </p>

                        {/* 하단 액션 영역 - 글로우 효과 없음 */}
                        <div className={`absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${shouldShowEffects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <div className="glass rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-white/30 btn-hover">
                                <span className="text-xs sm:text-sm font-medium text-white">예약하기</span>
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 inline text-white transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* 호버 시 나타나는 파티클 효과 */}
                    <div className={`absolute inset-0 transition-opacity duration-700 ${shouldShowEffects ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 rounded-full animate-pulse" />
                        <div className="absolute top-4 sm:top-8 right-3 sm:right-6 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-100" />
                        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/50 rounded-full animate-pulse delay-200" />
                        <div className="absolute top-1/2 right-2 sm:right-4 w-1 h-1 bg-white/25 rounded-full animate-pulse delay-300" />
                        <div className="absolute bottom-1/3 right-4 sm:right-8 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/35 rounded-full animate-pulse delay-400" />
                    </div>

                    {/* 클릭 효과를 위한 오버레이 */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 active:opacity-100 transition-opacity duration-150" />

                    {/* 상단 하이라이트 */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-opacity duration-500 ${shouldShowEffects ? 'opacity-100' : 'opacity-0'}`} />

                    {/* 호버 시 그라데이션 오버레이 */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent transition-opacity duration-500 ${shouldShowEffects ? 'opacity-100' : 'opacity-0'}`} />
                </div>

                {/* 그림자 효과 */}
                <div
                    className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 h-3 sm:h-4 bg-black/20 rounded-full blur-xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-60"
                    style={{
                        width: '240px',
                        filter: 'blur(20px)'
                    }}
                />

                {/* 호버 시 추가 그림자 */}
                <div
                    className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 h-4 sm:h-6 bg-black/10 rounded-full blur-2xl transition-all duration-700 group-hover:scale-120 group-hover:opacity-40"
                    style={{
                        width: '260px',
                        filter: 'blur(30px)'
                    }}
                />
            </div>
        </Link>
    );
} 