-- Add unique constraint to prevent duplicate reservations for the same service type and date
-- This ensures that no two reservations can have the same service_type and reservation_date

-- First, let's check if there are any duplicate service_type + reservation_date combinations and handle them
-- We'll keep the most recent reservation for each duplicate combination
WITH duplicates AS (
    SELECT service_type, reservation_date, COUNT(*) as count
    FROM public.reservations
    GROUP BY service_type, reservation_date
    HAVING COUNT(*) > 1
),
ranked_reservations AS (
    SELECT id, service_type, reservation_date, created_at,
           ROW_NUMBER() OVER (PARTITION BY service_type, reservation_date ORDER BY created_at DESC) as rn
    FROM public.reservations
    WHERE (service_type, reservation_date) IN (SELECT service_type, reservation_date FROM duplicates)
)
DELETE FROM public.reservations
WHERE id IN (
    SELECT id FROM ranked_reservations WHERE rn > 1
);

-- Now add the unique constraint on service_type + reservation_date combination
-- This allows different service types to have reservations at the same time
-- but prevents duplicate reservations for the same service type and time
CREATE UNIQUE INDEX IF NOT EXISTS idx_reservations_unique_service_date 
ON public.reservations(service_type, reservation_date);

-- Add a comment to explain the constraint
COMMENT ON INDEX public.idx_reservations_unique_service_date IS 
'Prevents duplicate reservations for the same service type and date/time combination'; 