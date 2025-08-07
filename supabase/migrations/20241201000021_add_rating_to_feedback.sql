-- Add rating column to feedback table
ALTER TABLE feedback ADD COLUMN rating INTEGER CHECK (rating >= 1 AND rating <= 5);

-- Update the check constraint to include rating
ALTER TABLE feedback DROP CONSTRAINT IF EXISTS feedback_service_type_check;
ALTER TABLE feedback ADD CONSTRAINT feedback_service_type_check 
    CHECK (service_type IN ('repair', 'tuning', 'parking'));

-- Add index for rating queries
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);
