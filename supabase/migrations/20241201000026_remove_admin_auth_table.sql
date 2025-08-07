-- Remove admin_auth table as we're now using Supabase auth system

-- Drop admin_auth table and related objects
DROP TRIGGER IF EXISTS trigger_admin_auth_updated_at ON public.admin_auth;
DROP FUNCTION IF EXISTS update_admin_auth_updated_at();
DROP FUNCTION IF EXISTS verify_admin_password(TEXT, TEXT);
DROP TABLE IF EXISTS public.admin_auth;

-- Update gallery_images RLS policies to use new auth system
DROP POLICY IF EXISTS "Gallery images are insertable by admin" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery images are updatable by admin" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery images are deletable by admin" ON public.gallery_images;

CREATE POLICY "Gallery images are insertable by admin" ON public.gallery_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Gallery images are updatable by admin" ON public.gallery_images
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Gallery images are deletable by admin" ON public.gallery_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update storage policies to use new auth system
DROP POLICY IF EXISTS "Admin can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete gallery images" ON storage.objects;

CREATE POLICY "Admin can upload gallery images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'gallery-images' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin can update gallery images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'gallery-images' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin can delete gallery images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'gallery-images' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
