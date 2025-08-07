-- Add status column to reservations table
ALTER TABLE reservations ADD COLUMN status TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'visited', 'cancelled'));

-- Add visited_date and cancelled_date columns (nullable)
ALTER TABLE reservations ADD COLUMN visited_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE reservations ADD COLUMN cancelled_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Update existing reservations to have 'reserved' status
UPDATE reservations SET status = 'reserved' WHERE status IS NULL;
