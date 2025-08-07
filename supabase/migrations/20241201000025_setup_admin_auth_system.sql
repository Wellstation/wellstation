-- Setup admin authentication system for apsauto@naver.com

-- Create profiles table for user roles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (
        NEW.id,
        NEW.email,
        CASE 
            WHEN NEW.email = 'apsauto@naver.com' THEN 'admin'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update feedback RLS policies to use auth.uid() and role check
DROP POLICY IF EXISTS "Allow public to insert feedback" ON feedback;
DROP POLICY IF EXISTS "Allow admin to view all feedback" ON feedback;
DROP POLICY IF EXISTS "Allow admin to update feedback" ON feedback;
DROP POLICY IF EXISTS "Allow admin to delete feedback" ON feedback;

-- Create policy for inserting feedback (public access)
CREATE POLICY "Allow public to insert feedback" ON feedback
    FOR INSERT WITH CHECK (true);

-- Create policy for admin to view all feedback
CREATE POLICY "Allow admin to view all feedback" ON feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create policy for admin to update feedback
CREATE POLICY "Allow admin to update feedback" ON feedback
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create policy for admin to delete feedback
CREATE POLICY "Allow admin to delete feedback" ON feedback
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update reservations RLS policies to use auth.uid() and role check
DROP POLICY IF EXISTS "Allow public to insert reservations" ON reservations;
DROP POLICY IF EXISTS "Allow admin to view all reservations" ON reservations;
DROP POLICY IF EXISTS "Allow admin to update reservations" ON reservations;
DROP POLICY IF EXISTS "Allow admin to delete reservations" ON reservations;

-- Create policy for inserting reservations (public access)
CREATE POLICY "Allow public to insert reservations" ON reservations
    FOR INSERT WITH CHECK (true);

-- Create policy for admin to view all reservations
CREATE POLICY "Allow admin to view all reservations" ON reservations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create policy for admin to update reservations
CREATE POLICY "Allow admin to update reservations" ON reservations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create policy for admin to delete reservations
CREATE POLICY "Allow admin to delete reservations" ON reservations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
