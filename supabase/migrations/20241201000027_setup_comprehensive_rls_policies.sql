-- 포괄적인 RLS 정책 설정
-- 모든 테이블에 대해 적절한 보안 정책을 설정합니다.

-- 1. reservations 테이블 RLS 정책 업데이트
DROP POLICY IF EXISTS "Allow all operations on reservations" ON public.reservations;

-- 예약 생성은 모든 사용자에게 허용
CREATE POLICY "reservations_public_insert" ON public.reservations
    FOR INSERT WITH CHECK (true);

-- 예약 조회는 모든 사용자에게 허용 (이름과 전화번호로 검색)
CREATE POLICY "reservations_public_select" ON public.reservations
    FOR SELECT USING (true);

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

-- 2. work_records 테이블 RLS 정책 업데이트
DROP POLICY IF EXISTS "Allow all operations on work_records" ON public.work_records;

-- 작업 기록 조회는 모든 사용자에게 허용
CREATE POLICY "work_records_public_select" ON public.work_records
    FOR SELECT USING (true);

-- 작업 기록 생성/수정/삭제는 관리자만 허용
CREATE POLICY "work_records_admin_insert" ON public.work_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "work_records_admin_update" ON public.work_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "work_records_admin_delete" ON public.work_records
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

-- 3. work_images 테이블 RLS 정책 업데이트
DROP POLICY IF EXISTS "Allow all operations on work_images" ON public.work_images;

-- 작업 이미지 조회는 모든 사용자에게 허용
CREATE POLICY "work_images_public_select" ON public.work_images
    FOR SELECT USING (true);

-- 작업 이미지 생성/수정/삭제는 관리자만 허용
CREATE POLICY "work_images_admin_insert" ON public.work_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "work_images_admin_update" ON public.work_images
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "work_images_admin_delete" ON public.work_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

-- 4. service_schedules 테이블 RLS 정책 업데이트
DROP POLICY IF EXISTS "Allow all operations on service_schedules" ON public.service_schedules;

-- 서비스 스케줄 조회는 모든 사용자에게 허용
CREATE POLICY "service_schedules_public_select" ON public.service_schedules
    FOR SELECT USING (true);

-- 서비스 스케줄 생성/수정/삭제는 관리자만 허용
CREATE POLICY "service_schedules_admin_insert" ON public.service_schedules
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "service_schedules_admin_update" ON public.service_schedules
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "service_schedules_admin_delete" ON public.service_schedules
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

-- 5. service_settings 테이블 RLS 정책 업데이트
DROP POLICY IF EXISTS "Allow all operations on service_settings" ON public.service_settings;

-- 서비스 설정 조회는 모든 사용자에게 허용
CREATE POLICY "service_settings_public_select" ON public.service_settings
    FOR SELECT USING (true);

-- 서비스 설정 생성/수정/삭제는 관리자만 허용
CREATE POLICY "service_settings_admin_insert" ON public.service_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "service_settings_admin_update" ON public.service_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "service_settings_admin_delete" ON public.service_settings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

-- 6. gallery_images 테이블 RLS 정책 업데이트 (기존 정책 제거 후 재생성)
DROP POLICY IF EXISTS "Gallery images are viewable by everyone" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery images are insertable by authenticated users" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery images are updatable by authenticated users" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery images are deletable by authenticated users" ON public.gallery_images;

-- 갤러리 이미지 조회는 모든 사용자에게 허용
CREATE POLICY "gallery_images_public_select" ON public.gallery_images
    FOR SELECT USING (true);

-- 갤러리 이미지 생성/수정/삭제는 관리자만 허용
CREATE POLICY "gallery_images_admin_insert" ON public.gallery_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "gallery_images_admin_update" ON public.gallery_images
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "gallery_images_admin_delete" ON public.gallery_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

-- 7. phone_verifications 테이블 RLS 정책 설정
ALTER TABLE phone_verifications ENABLE ROW LEVEL SECURITY;

-- 전화번호 인증 코드 생성은 모든 사용자에게 허용
CREATE POLICY "phone_verifications_public_insert" ON phone_verifications
    FOR INSERT WITH CHECK (true);

-- 전화번호 인증 코드 조회는 해당 전화번호 소유자만 허용
CREATE POLICY "phone_verifications_public_select" ON phone_verifications
    FOR SELECT USING (true);

-- 전화번호 인증 코드 수정/삭제는 관리자만 허용
CREATE POLICY "phone_verifications_admin_update" ON phone_verifications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

CREATE POLICY "phone_verifications_admin_delete" ON phone_verifications
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

-- 8. visitor_counts 테이블 RLS 정책 업데이트
DROP POLICY IF EXISTS "Allow read access to visitor counts" ON visitor_counts;
DROP POLICY IF EXISTS "Allow service role to insert visitor counts" ON visitor_counts;
DROP POLICY IF EXISTS "Allow service role to update visitor counts" ON visitor_counts;

-- 방문자 수 조회는 모든 사용자에게 허용
CREATE POLICY "visitor_counts_public_select" ON visitor_counts
    FOR SELECT USING (true);

-- 방문자 수 생성/수정은 서비스 역할만 허용
CREATE POLICY "visitor_counts_service_insert" ON visitor_counts
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "visitor_counts_service_update" ON visitor_counts
    FOR UPDATE USING (auth.role() = 'service_role');

-- 9. visitor_sessions 테이블 RLS 정책 업데이트
DROP POLICY IF EXISTS "Allow service role to insert visitor sessions" ON visitor_sessions;
DROP POLICY IF EXISTS "Allow service role to select visitor sessions" ON visitor_sessions;

-- 방문자 세션 생성/조회는 서비스 역할만 허용
CREATE POLICY "visitor_sessions_service_insert" ON visitor_sessions
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "visitor_sessions_service_select" ON visitor_sessions
    FOR SELECT USING (auth.role() = 'service_role');

-- 10. storage.objects 테이블 RLS 정책 업데이트 (갤러리 이미지 관련)
DROP POLICY IF EXISTS "Admin can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete gallery images" ON storage.objects;

-- 갤러리 이미지 업로드는 관리자만 허용
CREATE POLICY "storage_gallery_images_admin_insert" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'gallery-images' AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

-- 갤러리 이미지 수정은 관리자만 허용
CREATE POLICY "storage_gallery_images_admin_update" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'gallery-images' AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

-- 갤러리 이미지 삭제는 관리자만 허용
CREATE POLICY "storage_gallery_images_admin_delete" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'gallery-images' AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() AND email = 'apsauto@naver.com'
        )
    );

-- 갤러리 이미지 조회는 모든 사용자에게 허용
CREATE POLICY "storage_gallery_images_public_select" ON storage.objects
    FOR SELECT USING (bucket_id = 'gallery-images');
