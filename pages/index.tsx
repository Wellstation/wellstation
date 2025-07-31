'use client';

import Image from 'next/image';
import Footer from '../components/Footer';
import ActionButton from '../components/ActionButton';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black px-4 py-10 flex flex-col items-center justify-between">
      {/* 로고 */}
      <header className="flex justify-center mt-10 mb-12 w-full max-w-screen-md">
        <Image src="/logo1.svg" alt="로고" width={270} height={120} />
      </header>

      {/* 버튼 그룹 */}
      <main className="flex flex-col items-center mb-20 w-full max-w-screen-md">
        <ActionButton label="정비 예약" href="/reserve/repair" bgColor="bg-[#1C3058]" />
        <ActionButton label="튜닝 예약" href="/reserve/tuning" bgColor="bg-[#4040dd]" />
        <ActionButton label="주차 예약" href="/reserve/parking" bgColor="bg-[#fa52c1]" />
      </main>

      {/* 푸터 – 절대 수정 금지 */}
      <footer className="text-center text-[9px] text-gray-700 leading-[0.09] space-y-0.5 w-full max-w-screen-md px-2">
        <p>신흥모터스 & 앱스 대표 : 박경남 | 주소 : 부산광역시 강서구 대저중앙로 383-1<br />
        사업자등록번호 : 859-37-01635 | 호스팅서비스사업자 : Vercel Inc.</p>
        <p>
          이메일 : <a href="mailto:apsauto@naver.com" className="text-blue-600">apsauto@naver.com</a> |
          고객센터 : <a href="tel:16684590" className="text-blue-600">1668-4590</a>
        </p>
      </footer>
    </div>
  );
}
