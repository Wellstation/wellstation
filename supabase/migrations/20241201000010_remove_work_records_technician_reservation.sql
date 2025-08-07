-- Remove technician_name and reservation_id columns from work_records table
ALTER TABLE public.work_records DROP COLUMN IF EXISTS technician_name;
ALTER TABLE public.work_records DROP COLUMN IF EXISTS reservation_id;

-- Drop the foreign key constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'work_records_reservation_id_fkey'
    ) THEN
        ALTER TABLE public.work_records DROP CONSTRAINT work_records_reservation_id_fkey;
    END IF;
END $$;

-- Drop the index for reservation_id if it exists
DROP INDEX IF EXISTS idx_work_records_reservation_id; 