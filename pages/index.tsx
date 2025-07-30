import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer'; // 푸터 컴포넌트 import

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-cover bg-center px-4"
      style={{ backgroundImage: 'url("/bg.placeholder.jpg")' }} // 임시 배경 이미지
    >
      <header className="mt-10 mb-12 flex justify-center">
        <Image src="/logo1.svg" alt="로고" width={250} height={110} />
      </header>

      <main className="flex flex-col items-center gap-6">
        {/* 정비 예약 */}
        <Link href="/reserve/repair">
          <button
            className="px-8 py-4 text-xl font-semibold text-white rounded-2xl shadow-xl w-full max-w-xs"
            style={{ backgroundColor: '#2C3E50' }}
          >
            정비 예약
          </button>
        </Link>

        {/* 튜닝 예약 */}
        <Link href="/reserve/tuning">
          <button
            className="px-8 py-4 text-xl font-semibold text-white rounded-2xl shadow-xl w-full max-w-xs"
            style={{ backgroundColor: '#8E44AD' }}
          >
            튜닝 예약
          </button>
        </Link>

        {/* 주차 예약 */}
        <Link href="/reserve/parking">
          <button
            className="px-8 py-4 text-xl font-semibold text-white rounded-2xl shadow-xl w-full max-w-xs"
            style={{ backgroundColor: '#C0392B' }}
          >
            주차 예약
          </button>
        </Link>
      </main>

      <Footer /> {/* 푸터 컴포넌트 삽입 */}
    </div>
  );
}
