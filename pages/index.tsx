// pages/index.tsx
import Image from 'next/image';
import Link from 'next/link';
import ReservationButton from '@/components/ReservationButton';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-10 font-sans">
      <div className="flex flex-col items-center gap-8">
        <Image src="/logo.png" alt="Logo" width={200} height={120} />

        <div className="flex flex-col items-center gap-6">
          <ReservationButton
            text="정비 예약"
            color="bg-gray-800"
            onClick={() => (window.location.href = '/repair')}
          />
          <ReservationButton
            text="튜닝 예약"
            color="bg-purple-600"
            onClick={() => (window.location.href = '/tuning')}
          />
          <ReservationButton
            text="주차 예약"
            color="bg-red-600"
            onClick={() => (window.location.href = '/parking')}
          />
        </div>
      </div>

      {/* 푸터 – 건드리지 않음 */}
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
