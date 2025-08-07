-- Remove max_duration_hours and max_duration_days settings from service_settings table
DELETE FROM public.service_settings WHERE setting_key IN ('max_duration_hours', 'max_duration_days'); 