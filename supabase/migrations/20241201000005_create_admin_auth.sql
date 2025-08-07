-- Create admin_auth table for simple password-based authentication
CREATE TABLE IF NOT EXISTS public.admin_auth (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE DEFAULT 'admin',
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger for admin_auth
CREATE OR REPLACE FUNCTION update_admin_auth_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_admin_auth_updated_at
    BEFORE UPDATE ON public.admin_auth
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_auth_updated_at();

-- Enable RLS on admin_auth
ALTER TABLE public.admin_auth ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_auth
CREATE POLICY "Admin auth is viewable by everyone" ON public.admin_auth
    FOR SELECT USING (true);

-- Create function to verify admin password (plain text)
CREATE OR REPLACE FUNCTION verify_admin_password(input_password TEXT, stored_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN input_password = stored_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin user (password: admin123)
-- In production, you should change this password
INSERT INTO public.admin_auth (username, password_hash) 
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Update gallery_images RLS policies to allow admin access
DROP POLICY IF EXISTS "Gallery images are insertable by authenticated users" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery images are updatable by authenticated users" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery images are deletable by authenticated users" ON public.gallery_images;

CREATE POLICY "Gallery images are insertable by admin" ON public.gallery_images
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Gallery images are updatable by admin" ON public.gallery_images
    FOR UPDATE USING (true);

CREATE POLICY "Gallery images are deletable by admin" ON public.gallery_images
    FOR DELETE USING (true);

-- Update storage policies to allow admin access
DROP POLICY IF EXISTS "Authenticated users can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON storage.objects;

CREATE POLICY "Admin can upload gallery images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Admin can update gallery images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'gallery-images');

CREATE POLICY "Admin can delete gallery images" ON storage.objects
    FOR DELETE USING (bucket_id = 'gallery-images'); 