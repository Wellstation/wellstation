-- Add likes and views columns to work_records table
ALTER TABLE public.work_records 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- Create work_record_likes table for tracking user likes
CREATE TABLE IF NOT EXISTS public.work_record_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    work_record_id UUID REFERENCES public.work_records(id) ON DELETE CASCADE,
    user_ip TEXT NOT NULL, -- Store IP address for anonymous users
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(work_record_id, user_ip)
);

-- Create work_record_views table for tracking unique views
CREATE TABLE IF NOT EXISTS public.work_record_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    work_record_id UUID REFERENCES public.work_records(id) ON DELETE CASCADE,
    user_ip TEXT NOT NULL, -- Store IP address for anonymous users
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(work_record_id, user_ip)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_work_record_likes_work_record_id ON public.work_record_likes(work_record_id);
CREATE INDEX IF NOT EXISTS idx_work_record_likes_user_ip ON public.work_record_likes(user_ip);
CREATE INDEX IF NOT EXISTS idx_work_record_views_work_record_id ON public.work_record_views(work_record_id);
CREATE INDEX IF NOT EXISTS idx_work_record_views_user_ip ON public.work_record_views(user_ip);

-- Enable Row Level Security (RLS)
ALTER TABLE public.work_record_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_record_views ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations
CREATE POLICY "Allow all operations on work_record_likes" ON public.work_record_likes
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on work_record_views" ON public.work_record_views
    FOR ALL USING (true);

-- Grant necessary permissions
GRANT ALL ON public.work_record_likes TO authenticated;
GRANT ALL ON public.work_record_likes TO anon;
GRANT ALL ON public.work_record_views TO authenticated;
GRANT ALL ON public.work_record_views TO anon;

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_work_record_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.work_records 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.work_record_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.work_records 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.work_record_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for likes count
CREATE TRIGGER update_work_record_likes_count_trigger
    AFTER INSERT OR DELETE ON public.work_record_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_work_record_likes_count();

-- Create function to update views count
CREATE OR REPLACE FUNCTION update_work_record_views_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.work_records 
        SET views_count = views_count + 1 
        WHERE id = NEW.work_record_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for views count
CREATE TRIGGER update_work_record_views_count_trigger
    AFTER INSERT ON public.work_record_views
    FOR EACH ROW
    EXECUTE FUNCTION update_work_record_views_count(); 