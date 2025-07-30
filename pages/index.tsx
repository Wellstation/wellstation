'use client';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white dark:bg-black px-4 py-6">

      {/* 로고 */}
      <header className="mb-6">
        <Image src="/logo1.svg" alt="로고" width={250} height={110} />
      </header>

      {/* 버튼 그룹 */}
      <main className="flex flex-col items-center gap-16 w-full max-w-xs">
        <Link href="/reserve/repair">
          <button className="w-full px-8 py-6 text-2xl font-semibold text-white rounded-2xl shadow-xl
                            bg-[#1C3058] dark:bg-[#1C3058] dark:border-gray-600 border
                            hover:opacity-90 hover:scale-105 transition duration-300">
            정비 예약
          </button>
        </Link>

        <Link href="/reserve/tuning">
          <button className="w-full px-8 py-6 text-2xl font-semibold text-white rounded-2xl shadow-xl
                            bg-[#8444dd] dark:bg-[#A569BD] dark:border-purple-300 border
                            hover:opacity-90 hover:scale-105 transition duration-300">
            튜닝 예약
          </button>
        </Link>

        <Link href="/reserve/parking">
          <button className="w-full px-8 py-6 text-2xl font-semibold text-white rounded-2xl shadow-xl
                            bg-[#a52c1e] dark:bg-[#E74C3C] dark:border-red-300 border
                            hover:opacity-90 hover:scale-105 transition duration-300">
            주차 예약
          </button>
        </Link>
      </main>

      {/* 푸터 */}
      <footer className="mt-12 w-full">
        <Footer />
      </footer>
    </div>
  );
}
