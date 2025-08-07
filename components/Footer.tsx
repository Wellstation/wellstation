import { useVisitorCount } from '../hooks/useVisitorCount';

export default function Footer() {
  const { visitorCount, totalVisitors, loading, error } = useVisitorCount();

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
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-white/40">
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  방문자 수 로딩 중...
                </span>
              ) : error ? (
                <span className="text-red-400">방문자 수 로드 실패</span>
              ) : (
                <span className="text-green-400 font-medium">
                  오늘 방문자: {visitorCount.toLocaleString()}명 |
                  전체 방문자: {totalVisitors.toLocaleString()}명
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
