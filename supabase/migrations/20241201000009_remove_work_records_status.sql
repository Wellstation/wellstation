-- Remove status column from work_records table
ALTER TABLE public.work_records DROP COLUMN IF EXISTS status; 