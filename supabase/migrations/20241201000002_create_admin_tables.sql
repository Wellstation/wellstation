-- Create work_records table for storing work details
CREATE TABLE IF NOT EXISTS public.work_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_type TEXT NOT NULL CHECK (service_type IN ('parking', 'repair', 'tuning')),
    work_title TEXT NOT NULL,
    work_description TEXT,
    work_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create work_images table for storing work photos
CREATE TABLE IF NOT EXISTS public.work_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    work_record_id UUID REFERENCES public.work_records(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_schedules table for managing available time slots
CREATE TABLE IF NOT EXISTS public.service_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_type TEXT NOT NULL CHECK (service_type IN ('parking', 'repair', 'tuning')),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(service_type, day_of_week)
);

-- Create service_settings table for managing service-specific settings
CREATE TABLE IF NOT EXISTS public.service_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_type TEXT NOT NULL CHECK (service_type IN ('parking', 'repair', 'tuning')),
    setting_key TEXT NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(service_type, setting_key)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_work_records_service_type ON public.work_records(service_type);
CREATE INDEX IF NOT EXISTS idx_work_records_date ON public.work_records(work_date);
CREATE INDEX IF NOT EXISTS idx_work_images_work_record_id ON public.work_images(work_record_id);
CREATE INDEX IF NOT EXISTS idx_service_schedules_service_type ON public.service_schedules(service_type);
CREATE INDEX IF NOT EXISTS idx_service_schedules_day ON public.service_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_service_settings_service_type ON public.service_settings(service_type);

-- Create triggers for updated_at columns
CREATE TRIGGER update_work_records_updated_at
    BEFORE UPDATE ON public.work_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_schedules_updated_at
    BEFORE UPDATE ON public.service_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_settings_updated_at
    BEFORE UPDATE ON public.service_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.work_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can modify this based on your needs)
CREATE POLICY "Allow all operations on work_records" ON public.work_records
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on work_images" ON public.work_images
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on service_schedules" ON public.service_schedules
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on service_settings" ON public.service_settings
    FOR ALL USING (true);

-- Grant necessary permissions
GRANT ALL ON public.work_records TO authenticated;
GRANT ALL ON public.work_records TO anon;
GRANT ALL ON public.work_images TO authenticated;
GRANT ALL ON public.work_images TO anon;
GRANT ALL ON public.service_schedules TO authenticated;
GRANT ALL ON public.service_schedules TO anon;
GRANT ALL ON public.service_settings TO authenticated;
GRANT ALL ON public.service_settings TO anon;

-- Insert default service schedules
INSERT INTO public.service_schedules (service_type, day_of_week, start_time, end_time) VALUES
    ('repair', 1, '09:00:00', '18:00:00'), -- Monday
    ('repair', 2, '09:00:00', '18:00:00'), -- Tuesday
    ('repair', 3, '09:00:00', '18:00:00'), -- Wednesday
    ('repair', 4, '09:00:00', '18:00:00'), -- Thursday
    ('repair', 5, '09:00:00', '18:00:00'), -- Friday
    ('repair', 6, '09:00:00', '17:00:00'), -- Saturday
    ('tuning', 1, '09:00:00', '18:00:00'),
    ('tuning', 2, '09:00:00', '18:00:00'),
    ('tuning', 3, '09:00:00', '18:00:00'),
    ('tuning', 4, '09:00:00', '18:00:00'),
    ('tuning', 5, '09:00:00', '18:00:00'),
    ('tuning', 6, '09:00:00', '17:00:00'),
    ('parking', 0, '00:00:00', '23:59:59'), -- Sunday (24/7)
    ('parking', 1, '00:00:00', '23:59:59'), -- Monday (24/7)
    ('parking', 2, '00:00:00', '23:59:59'), -- Tuesday (24/7)
    ('parking', 3, '00:00:00', '23:59:59'), -- Wednesday (24/7)
    ('parking', 4, '00:00:00', '23:59:59'), -- Thursday (24/7)
    ('parking', 5, '00:00:00', '23:59:59'), -- Friday (24/7)
    ('parking', 6, '00:00:00', '23:59:59')  -- Saturday (24/7)
ON CONFLICT (service_type, day_of_week) DO UPDATE SET
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time,
    updated_at = NOW();

-- Insert default service settings
INSERT INTO public.service_settings (service_type, setting_key, setting_value, description) VALUES
    ('repair', 'buffer_before_minutes', '30', 'Buffer time before repair appointment (minutes)'),
    ('repair', 'buffer_after_minutes', '30', 'Buffer time after repair appointment (minutes)'),
    ('repair', 'max_duration_hours', '4', 'Maximum repair duration (hours)'),
    ('repair', 'enable_time_conflict_check', 'true', 'Enable time conflict checking for repair'),
    ('tuning', 'buffer_before_minutes', '15', 'Buffer time before tuning appointment (minutes)'),
    ('tuning', 'buffer_after_minutes', '15', 'Buffer time after tuning appointment (minutes)'),
    ('tuning', 'max_duration_hours', '2', 'Maximum tuning duration (hours)'),
    ('tuning', 'enable_time_conflict_check', 'true', 'Enable time conflict checking for tuning'),
    ('parking', 'buffer_before_minutes', '0', 'Buffer time before parking (minutes)'),
    ('parking', 'buffer_after_minutes', '0', 'Buffer time after parking (minutes)'),
    ('parking', 'max_duration_days', '30', 'Maximum parking duration (days)'),
    ('parking', 'enable_time_conflict_check', 'true', 'Enable time conflict checking for parking')
ON CONFLICT (service_type, setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description; 