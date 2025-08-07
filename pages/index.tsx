'use client';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import ServiceButton from '../components/ServiceButton';
import { ParkingIcon, RepairIcon, TuningIcon } from '../components/icons';

export default function Home() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [centerCardId, setCenterCardId] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 중앙 카드 감지
  useEffect(() => {
    let scrollDirection = 'down';
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = entry.target.getAttribute('data-card-id');
          if (entry.isIntersecting && cardId) {
            // 스크롤 방향에 따라 다른 threshold 사용
            const threshold = scrollDirection === 'down' ? 0.6 : 0.3;
            if (entry.intersectionRatio >= threshold) {
              setCenterCardId(cardId);
            }
          }
        });
      },
      {
        threshold: [0.3, 0.6], // 두 가지 threshold 사용
        rootMargin: '0px 0px -20% 0px' // 화면 중앙 영역
      }
    );

    // 모든 카드 요소 관찰
    const cards = document.querySelectorAll('[data-card-id]');
    cards.forEach(card => observer.observe(card));

    return () => {
      cards.forEach(card => observer.unobserve(card));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const services = [
    {
      id: 'repair',
      label: '정비 예약',
      href: '/reserve/repair',
      recordsHref: '/records/repair',
      icon: <RepairIcon />,
      description: '차량 정비 및 점검 서비스',
      bgColor: 'from-blue-600 via-blue-700 to-blue-800',
      delay: '0s'
    },
    {
      id: 'tuning',
      label: '튜닝 예약',
      href: '/reserve/tuning',
      recordsHref: '/records/tuning',
      icon: <TuningIcon />,
      description: '차량 성능 튜닝 서비스',
      bgColor: 'from-purple-600 via-purple-700 to-purple-800',
      delay: '0.2s'
    },
    {
      id: 'parking',
      label: '주차 예약',
      href: '/reserve/parking',
      recordsHref: '/records/parking',
      icon: <ParkingIcon />,
      description: '카라반 및 제트스키&보트 보관',
      bgColor: 'from-green-600 via-green-700 to-green-800',
      delay: '0.4s'
    }
  ];

  return (
    <>
      <Head>
        <title>웰스테이션 - 차량 서비스 전문</title>
        <meta name="description" content="차량 정비, 튜닝, 주차 서비스를 한 곳에서. 카라반 및 제트스키&보트 보관까지 편리하게 예약하세요." />
        <meta name="keywords" content="차량정비, 튜닝, 주차, 카라반, 제트스키, 보트, 웰스테이션, 예약" />

        {/* 카카오톡 공유 최적화 */}
        <meta property="og:title" content="웰스테이션 - 차량 서비스 전문" />
        <meta property="og:description" content="차량 정비, 튜닝, 주차 서비스를 한 곳에서. 카라반 및 제트스키&보트 보관까지 편리하게 예약하세요." />
        <meta property="og:image" content="/logo1.svg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wellstation.app" />

        {/* 추가 메타데이터 */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://wellstation.app" />
      </Head>

      <div className="min-h-screen bg-black text-center flex flex-col items-center justify-between px-4 pt-10 pb-6 sm:px-10 sm:pt-20 sm:pb-10 bg-main-background relative overflow-hidden">

        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        {/* 애니메이션 배경 요소들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-2000" />
          <div className="absolute top-60 left-1/4 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-1500" />
        </div>

        {/* 로고 */}
        <header className="flex justify-center relative z-10">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Image
              src="/logo1.svg"
              alt="웰스테이션 로고"
              width={450}
              height={200}
              className="sm:w-[270px] h-auto drop-shadow-2xl"
              priority
            />
          </div>
        </header>

        {/* 서비스 버튼 그리드 */}
        <main className="flex-1 flex items-center justify-center py-8 sm:py-12 relative z-10">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 lg:gap-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: service.delay }}
                data-card-id={service.id}
              >
                <div className="flex flex-col items-center gap-4">
                  <ServiceButton
                    id={service.id}
                    label={service.label}
                    href={service.href}
                    icon={service.icon}
                    description={service.description}
                    bgColor={service.bgColor}
                    isHovered={hoveredButton === service.id}
                    onMouseEnter={() => setHoveredButton(service.id)}
                    onMouseLeave={() => setHoveredButton(null)}
                    centerCardId={centerCardId}
                  />

                  {/* 버튼 그룹 */}
                  <div className="flex gap-3">
                    {/* 작업 내역 버튼 */}
                    <Link
                      href={service.recordsHref}
                      className="group relative cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      <div className="glass rounded-full px-6 py-3 border border-white/30 btn-hover backdrop-blur-sm">
                        <span className="text-sm font-medium text-white">작업 내역</span>
                        <svg className="w-4 h-4 ml-2 inline text-white transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>

                    {/* 예약 조회 버튼 */}
                    <Link
                      href={`/reservations/${service.id}/search`}
                      className="group relative cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      <div className="glass rounded-full px-6 py-3 border border-white/30 btn-hover backdrop-blur-sm">
                        <span className="text-sm font-medium text-white">예약 조회</span>
                        <svg className="w-4 h-4 ml-2 inline text-white transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer 컴포넌트 사용 */}
        <Footer />

        {/* 플로팅 버튼 */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          <Link
            href="/feedback"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 opacity-70 hover:opacity-100 hover:scale-110"
            title="피드백"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Link>
          <Link
            href="/admin"
            className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full shadow-lg transition-all duration-200 opacity-70 hover:opacity-100 hover:scale-110"
            title="관리자"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
