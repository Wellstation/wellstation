-- profiles 테이블 및 관련 객체 제거
-- 더 이상 필요하지 않은 profiles 테이블과 관련 함수, 트리거를 제거합니다.

-- 1. 트리거 제거
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. 함수 제거
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. profiles 테이블 제거
DROP TABLE IF EXISTS public.profiles;

-- 4. RLS 정책 업데이트 (profiles 테이블 참조 제거)
-- feedback 테이블 RLS 정책 업데이트
DROP POLICY IF EXISTS "Allow public to insert feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow admin to view all feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow admin to update feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow admin to delete feedback" ON public.feedback;
DROP POLICY IF EXISTS "feedback_public_insert" ON public.feedback;
DROP POLICY IF EXISTS "feedback_admin_select" ON public.feedback;
DROP POLICY IF EXISTS "feedback_admin_update" ON public.feedback;
DROP POLICY IF EXISTS "feedback_admin_delete" ON public.feedback;

-- 피드백 생성은 모든 사용자에게 허용
CREATE POLICY "feedback_public_insert" ON public.feedback
    FOR INSERT WITH CHECK (true);

-- 피드백 조회/수정/삭제는 관리자만 허용
CREATE POLICY "feedback_admin_select" ON public.feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "feedback_admin_update" ON public.feedback
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "feedback_admin_delete" ON public.feedback
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

-- reservations 테이블 RLS 정책 업데이트
DROP POLICY IF EXISTS "Allow public to insert reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow admin to update reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow admin to delete reservations" ON public.reservations;
DROP POLICY IF EXISTS "reservations_public_insert" ON public.reservations;
DROP POLICY IF EXISTS "reservations_admin_update" ON public.reservations;
DROP POLICY IF EXISTS "reservations_admin_delete" ON public.reservations;

-- 예약 생성은 모든 사용자에게 허용
CREATE POLICY "reservations_public_insert" ON public.reservations
    FOR INSERT WITH CHECK (true);

-- 예약 수정/삭제는 관리자만 허용
CREATE POLICY "reservations_admin_update" ON public.reservations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "reservations_admin_delete" ON public.reservations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );
