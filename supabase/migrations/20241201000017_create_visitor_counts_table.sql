-- 방문자 수 테이블 생성
CREATE TABLE IF NOT EXISTS visitor_counts (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_visitor_counts_date ON visitor_counts(date);

-- RLS 정책 설정 (읽기만 허용)
ALTER TABLE visitor_counts ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 설정
CREATE POLICY "Allow read access to visitor counts" ON visitor_counts
  FOR SELECT USING (true);

-- 서비스 역할만 쓰기 가능하도록 정책 설정
CREATE POLICY "Allow service role to insert visitor counts" ON visitor_counts
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role to update visitor counts" ON visitor_counts
  FOR UPDATE USING (auth.role() = 'service_role');
