'use client';

import Image from 'next/image';
import Footer from '../components/Footer';
import ActionButton from '../components/ActionButton';

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-black px-4 pt-4 pb-10">

      {/* 로고 */}
      <header className="flex justify-center mb-[81px]">
        <Image src="/logo1.svg" alt="로고" width={270} height={120} />
      </header>

      {/* 버튼 그룹 */}
      <main className="flex flex-col items-center gap-[72px] mb-[96px]">
        <ActionButton label="정비 예약" href="/reserve/repair" bgColor="bg-[#1C385B]" />
        <ActionButton label="튜닝 예약" href="/reserve/tuning" bgColor="bg-[#8444dd]" />
        <ActionButton label="주차 예약" href="/reserve/parking" bgColor="bg-[#a52c1e]" />
      </main>

      {/* 푸터 (절대 수정하지 않음) */}
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
