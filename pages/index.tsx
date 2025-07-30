'use client';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-4 py-10">
      {/* 로고 */}
      <header className="mb-16">
        <Image src="/logo1.svg" alt="로고" width={250} height={110} />
      </header>

      {/* 버튼 */}
      <main className="flex flex-col items-center gap-6 w-full max-w-xs">
        <Link href="/reserve/repair">
          <button className="w-full px-8 py-5 text-xl font-semibold text-white rounded-2xl shadow-xl 
                             bg-[#2C3E50] hover:scale-105 hover:shadow-2xl transition 
                             dark:bg-[#34495E] dark:border-gray-600 border">
            정비 예약
          </button>
        </Link>

        <Link href="/reserve/tuning">
          <button className="w-full px-8 py-5 text-xl font-semibold text-white rounded-2xl shadow-xl 
                             bg-[#8E44AD] hover:scale-105 hover:shadow-2xl transition 
                             dark:bg-[#A569BD] dark:border-purple-300 border">
            튜닝 예약
          </button>
        </Link>

        <Link href="/reserve/parking">
          <button className="w-full px-8 py-5 text-xl font-semibold text-white rounded-2xl shadow-xl 
                             bg-[#C0392B] hover:scale-105 hover:shadow-2xl transition 
                             dark:bg-[#E74C3C] dark:border-red-300 border">
            주차 예약
          </button>
        </Link>
      </main>

      {/* 하단 회사 정보 */}
      <footer className="mt-20 text-sm text-center space-y-2 text-black dark:text-white">
        <p>신흥모터스 & 앱스 대표 : 박경남 | 주소 : 부산광역시 강서구 대저중앙로 383-1</p>
        <p>사업자등록번호 : 859-37-01635 | 호스팅서비스사업자 : Vercel Inc.</p>
        <p>
          이메일 : <a className="text-blue-500 underline" href="mailto:apsauto@naver.com">apsauto@naver.com</a> | 고객센터 : <a className="text-blue-500 underline" href="tel:16684509">1668-4509</a>
        </p>
      </footer>
    </div>
  );
}
