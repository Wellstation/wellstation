-- Add visit details columns to reservations table
ALTER TABLE reservations ADD COLUMN work_details TEXT DEFAULT NULL;
ALTER TABLE reservations ADD COLUMN next_inspection_date DATE DEFAULT NULL;
ALTER TABLE reservations ADD COLUMN notes TEXT DEFAULT NULL;

-- Create index for work_details queries
CREATE INDEX IF NOT EXISTS idx_reservations_work_details ON reservations(work_details);

-- Create index for next_inspection_date queries
CREATE INDEX IF NOT EXISTS idx_reservations_next_inspection_date ON reservations(next_inspection_date);
