-- Fix feedback RLS policies
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public to insert feedback" ON feedback;
DROP POLICY IF EXISTS "Allow admin to view all feedback" ON feedback;
DROP POLICY IF EXISTS "Allow admin to update feedback" ON feedback;
DROP POLICY IF EXISTS "Allow admin to delete feedback" ON feedback;

-- Create policy for inserting feedback (public access)
CREATE POLICY "Allow public to insert feedback" ON feedback
    FOR INSERT WITH CHECK (true);

-- Create policy for admin to view all feedback
CREATE POLICY "Allow admin to view all feedback" ON feedback
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for admin to update feedback
CREATE POLICY "Allow admin to update feedback" ON feedback
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for admin to delete feedback
CREATE POLICY "Allow admin to delete feedback" ON feedback
    FOR DELETE USING (auth.role() = 'authenticated');
