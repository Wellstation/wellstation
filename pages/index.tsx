'use client';

import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-4 py-6">
      
      {/* 로고 */}
      <header className="mb-10">
        <Image src="/logo1.svg" alt="로고" width={250} height={110} />
      </header>

      {/* 버튼 그룹 */}
      <main className="flex flex-col items-center gap-10 mt-4">
        <Link href="/reserve/repair">
          <button className="min-w-[240px] px-8 py-4 text-xl font-semibold text-white bg-[#1C385B] rounded-xl shadow-xl
                            hover:opacity-90 hover:scale-105 transition duration-300">
            정비 예약
          </button>
        </Link>

        <Link href="/reserve/tuning">
          <button className="min-w-[240px] px-8 py-4 text-xl font-semibold text-white bg-[#8444dd] rounded-xl shadow-xl
                            hover:opacity-90 hover:scale-105 transition duration-300">
            튜닝 예약
          </button>
        </Link>

        <Link href="/reserve/parking">
          <button className="min-w-[240px] px-8 py-4 text-xl font-semibold text-white bg-[#a52c1e] rounded-xl shadow-xl
                            hover:opacity-90 hover:scale-105 transition duration-300">
            주차 예약
          </button>
        </Link>
      </main>

      {/* 푸터 */}
      <footer className="mt-20 w-full">
        <Footer />
      </footer>
    </div>
  );
}
