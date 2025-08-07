-- 방문자 세션 테이블 생성
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id SERIAL PRIMARY KEY,
  session_key TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_key ON visitor_sessions(session_key);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_date ON visitor_sessions(date);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_visitor_id ON visitor_sessions(visitor_id);

-- RLS 정책 설정
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

-- 서비스 역할만 접근 가능하도록 정책 설정
CREATE POLICY "Allow service role to insert visitor sessions" ON visitor_sessions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role to select visitor sessions" ON visitor_sessions
  FOR SELECT USING (auth.role() = 'service_role');
