-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_type TEXT NOT NULL CHECK (service_type IN ('repair', 'tuning', 'parking')),
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_service_type ON feedback(service_type);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_feedback_updated_at 
    BEFORE UPDATE ON feedback 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
