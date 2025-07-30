// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-sm text-center px-4 py-6 mt-10">
      <div className="space-y-1 leading-relaxed">
        <p className="font-semibold">신흥모터스 & 앱스 대표 : 박경남</p>
        <p>주소: 부산광역시 강서구 대저중앙로 383-1</p>
        <p>사업자등록번호: 859-37-01635</p>
        <p>호스팅서비스사업자: Vercel Inc.</p>
        <p>
          이메일: <a href="mailto:apsauto@naver.com" className="underline">apsauto@naver.com</a>
        </p>
        <p>
          고객센터: <a href="tel:16684509" className="font-semibold">1668-4509</a>
        </p>
      </div>
    </footer>
  );
}
