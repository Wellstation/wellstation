'use client';

import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-black px-4 pt-4 pb-10">

      {/* 로고 */}
      <header className="flex justify-center mb-81">
        <Image src="/logo1.svg" alt="로고" width={270} height={120} />
      </header>

      {/* 버튼 그룹 */}
      <main className="flex flex-col items-center gap-18 mb-24">
        <Link href="/reserve/repair">
          <button className="min-w-[240px] px-10 py-5 text-[1.25rem] font-semibold text-white bg-[#1C385B] rounded-xl shadow-xl
                            hover:opacity-90 hover:scale-105 transition duration-300">
            정비 예약
          </button>
        </Link>

        <Link href="/reserve/tuning">
          <button className="min-w-[240px] px-10 py-5 text-[1.25rem] font-semibold text-white bg-[#8444dd] rounded-xl shadow-xl
                            hover:opacity-90 hover:scale-105 transition duration-300">
            튜닝 예약
          </button>
        </Link>

        <Link href="/reserve/parking">
          <button className="min-w-[240px] px-10 py-5 text-[1.25rem] font-semibold text-white bg-[#a52c1e] rounded-xl shadow-xl
                            hover:opacity-90 hover:scale-105 transition duration-300">
            주차 예약
          </button>
        </Link>
      </main>

      {/* 푸터 */}
      <footer className="text-center text-[9px] text-gray-700 leading-[0.09] space-y-0.5">
        <p>신흥모터스 & 앱스 대표 : 박경남 | 주소 : 부산광역시 강서구 대저중앙로 383-1</p>
        <p>사업자등록번호 : 859-37-01635 | 호스팅서비스사업자 : Vercel Inc.</p>
        <p>
          이메일 : <a href="mailto:apsauto@naver.com" className="text-blue-600">apsauto@naver.com</a> | 
          고객센터 : <a href="tel:16684590" className="text-blue-600">1668-4590</a>
        </p>
      </footer>
    </div>
  );
}
