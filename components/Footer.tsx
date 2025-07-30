export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-sm px-4 py-6 mt-10 w-full">
      <div className="max-w-screen-md mx-auto space-y-2 text-center leading-relaxed">
        <p className="font-semibold">신흥모터스 & 앱스 대표 : 박경남</p>
        <p>주소 : 부산광역시 강서구 대저중앙로 383-1</p>
        <p>사업자등록번호 : 859-37-01635</p>
        <p>호스팅서비스사업자 : Vercel Inc.</p>
        <p>
          이메일 :{" "}
          <a
            href="mailto:apsauto@naver.com"
            className="underline text-blue-300 break-all"
          >
            apsauto@naver.com
          </a>
        </p>
        <p>
          고객센터 :{" "}
          <a href="tel:16684509" className="font-semibold text-blue-400">
            1668-4509
          </a>
        </p>
      </div>
    </footer>
  );
}
