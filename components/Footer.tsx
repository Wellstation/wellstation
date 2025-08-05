export default function Footer() {
  return (
    <footer className="glass-dark text-white text-sm px-4 sm:px-6 py-6 sm:py-8 mt-10 w-full rounded-t-2xl backdrop-blur-md border border-white/10 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-xs text-white/50 space-y-1 text-center">
          <p>신흥모터스 대표 : 박경남 | 주소 : 부산광역시 강서구 대저중앙로 383-1</p>
          <p>사업자등록번호 : 859-37-01635 | 호스팅서비스사업자 : Vercel Inc.</p>
          <p>
            이메일 : <a href="mailto:apsauto@naver.com" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 underline decoration-blue-400/30 hover:decoration-blue-300/50">apsauto@naver.com</a> |
            고객센터 : <a href="tel:16684590" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 underline decoration-blue-400/30 hover:decoration-blue-300/50">1668-4590</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
