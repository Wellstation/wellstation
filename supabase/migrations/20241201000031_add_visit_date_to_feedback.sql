-- Add visit_date column to feedback table
ALTER TABLE feedback ADD COLUMN visit_date TIMESTAMP WITH TIME ZONE;

-- Add comment for the new column
COMMENT ON COLUMN feedback.visit_date IS '방문일시';
