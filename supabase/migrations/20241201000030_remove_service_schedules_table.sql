-- Remove service_schedules table and related policies
-- This table is no longer used in the application

-- Drop all policies first
DROP POLICY IF EXISTS "Allow all operations on service_schedules" ON public.service_schedules;
DROP POLICY IF EXISTS "service_schedules_public_select" ON public.service_schedules;
DROP POLICY IF EXISTS "service_schedules_admin_insert" ON public.service_schedules;
DROP POLICY IF EXISTS "service_schedules_admin_update" ON public.service_schedules;
DROP POLICY IF EXISTS "service_schedules_admin_delete" ON public.service_schedules;

-- Drop the table
DROP TABLE IF EXISTS public.service_schedules;
