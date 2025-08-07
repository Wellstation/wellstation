-- Create reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL CHECK (service_type IN ('parking', 'repair', 'tuning')),
    vehicle_info TEXT,
    model TEXT,
    vin TEXT,
    request TEXT,
    reservation_date TIMESTAMPTZ NOT NULL,
    etc TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reservations_service_type ON public.reservations(service_type);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_service_date ON public.reservations(service_type, reservation_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.reservations TO authenticated;
GRANT ALL ON public.reservations TO anon; 