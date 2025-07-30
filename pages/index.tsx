import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-4 py-10">
      {/* 로고 */}
      <header className="mb-12">
        <Image src="/logo1.svg" alt="로고" width={250} height={110} />
      </header>

      {/* 버튼 그룹 */}
      <main className="flex flex-col items-center gap-6 w-full max-w-xs">
        {/* 정비 예약 */}
        <Link href="/reserve/repair">
          <button
            className="w-full px-8 py-4 text-xl font-semibold text-white rounded-2xl shadow-xl
                       bg-[#2C3E50] dark:bg-[#34495E] dark:border-gray-600 border"
          >
            정비 예약
          </button>
        </Link>

        {/* 튜닝 예약 */}
        <Link href="/reserve/tuning">
          <button
            className="w-full px-8 py-4 text-xl font-semibold text-white rounded-2xl shadow-xl
                       bg-[#8E44AD] dark:bg-[#A569BD] dark:border-purple-300 border"
          >
            튜닝 예약
          </button>
        </Link>

        {/* 주차 예약 */}
        <Link href="/reserve/parking">
          <button
            className="w-full px-8 py-4 text-xl font-semibold text-white rounded-2xl shadow-xl
                       bg-[#C0392B] dark:bg-[#E74C3C] dark:border-red-300 border"
          >
            주차 예약
          </button>
        </Link>
      </main>

      {/* 하단 푸터 */}
      <footer className="mt-20 w-full">
        <Footer />
      </footer>
    </div>
  );
}