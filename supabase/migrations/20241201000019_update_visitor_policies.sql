-- 기존 정책 삭제
DROP POLICY IF EXISTS "Allow service role to insert visitor counts" ON visitor_counts;
DROP POLICY IF EXISTS "Allow service role to update visitor counts" ON visitor_counts;

-- 새로운 정책 생성 - 모든 사용자가 쓰기 가능하도록
CREATE POLICY "Allow all users to insert visitor counts" ON visitor_counts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all users to update visitor counts" ON visitor_counts
  FOR UPDATE USING (true);

-- 방문자 세션 테이블 정책도 수정
DROP POLICY IF EXISTS "Allow service role to insert visitor sessions" ON visitor_sessions;
DROP POLICY IF EXISTS "Allow service role to select visitor sessions" ON visitor_sessions;

CREATE POLICY "Allow all users to insert visitor sessions" ON visitor_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all users to select visitor sessions" ON visitor_sessions
  FOR SELECT USING (true);
