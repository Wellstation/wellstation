import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/bg-placeholder.jpg')" }} // 임시 배경 이미지
    >
      <header className="mb-12">
        <Image src="/logo-placeholder.png" alt="로고" width={180} height={80} />
      </header>
      <main className="flex flex-col items-center gap-6">
        <Link href="/reserve/repair">
          <button className="px-8 py-4 text-xl font-semibold bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700">
            정비 예약
          </button>
        </Link>
        <Link href="/reserve/tuning">
          <button className="px-8 py-4 text-xl font-semibold bg-green-600 text-white rounded-2xl shadow-xl hover:bg-green-700">
            튜닝 예약
          </button>
        </Link>
        <Link href="/reserve/parking">
          <button className="px-8 py-4 text-xl font-semibold bg-orange-600 text-white rounded-2xl shadow-xl hover:bg-orange-700">
            주차 예약
          </button>
        </Link>
      </main>
    </div>
  );
}
