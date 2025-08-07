-- Create gallery_images table for managing images for each service type
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_type TEXT NOT NULL CHECK (service_type IN ('parking', 'repair', 'tuning')),
    image_url TEXT NOT NULL,
    image_alt TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gallery_images_service_type ON public.gallery_images(service_type);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON public.gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_active ON public.gallery_images(is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_gallery_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_gallery_images_updated_at
    BEFORE UPDATE ON public.gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION update_gallery_images_updated_at();

-- Enable Row Level Security
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Gallery images are viewable by everyone" ON public.gallery_images
    FOR SELECT USING (true);

CREATE POLICY "Gallery images are insertable by authenticated users" ON public.gallery_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Gallery images are updatable by authenticated users" ON public.gallery_images
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Gallery images are deletable by authenticated users" ON public.gallery_images
    FOR DELETE USING (auth.role() = 'authenticated');