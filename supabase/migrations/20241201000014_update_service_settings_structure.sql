-- Update service settings structure to new format
-- Remove old settings and add new time-based settings

-- Delete old settings
DELETE FROM service_settings WHERE setting_key IN (
    'buffer_before_minutes',
    'buffer_after_minutes', 
    'max_duration_hours',
    'max_duration_days',
    'enable_time_conflict_check'
);

-- Insert new settings for each service type
INSERT INTO service_settings (service_type, setting_key, setting_value, description) VALUES
-- Repair service settings
('repair', 'start_time', '09:00', '서비스 시작 시간 (HH:MM 형식)'),
('repair', 'end_time', '18:00', '서비스 종료 시간 (HH:MM 형식)'),
('repair', 'interval_minutes', '30', '예약 간격 (분)'),
('repair', 'disable_after_slots', '1', '예약 후 비활성화할 타임슬롯 수'),

-- Tuning service settings  
('tuning', 'start_time', '09:00', '서비스 시작 시간 (HH:MM 형식)'),
('tuning', 'end_time', '18:00', '서비스 종료 시간 (HH:MM 형식)'),
('tuning', 'interval_minutes', '30', '예약 간격 (분)'),
('tuning', 'disable_after_slots', '1', '예약 후 비활성화할 타임슬롯 수'),

-- Parking service settings
('parking', 'start_time', '09:00', '서비스 시작 시간 (HH:MM 형식)'),
('parking', 'end_time', '18:00', '서비스 종료 시간 (HH:MM 형식)'),
('parking', 'interval_minutes', '30', '예약 간격 (분)'),
('parking', 'disable_after_slots', '1', '예약 후 비활성화할 타임슬롯 수')
ON CONFLICT (service_type, setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = NOW(); 