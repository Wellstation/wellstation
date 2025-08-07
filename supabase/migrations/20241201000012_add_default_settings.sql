-- Add default service settings for time conflict management
-- These settings control the buffer time around reservations

-- Parking service settings
INSERT INTO service_settings (service_type, setting_key, setting_value, description) VALUES
('parking', 'buffer_before_minutes', '30', 'Buffer time before reservation (minutes)'),
('parking', 'buffer_after_minutes', '30', 'Buffer time after reservation (minutes)'),
('parking', 'enable_time_conflict_check', 'true', 'Enable time conflict checking')
ON CONFLICT (service_type, setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Repair service settings
INSERT INTO service_settings (service_type, setting_key, setting_value, description) VALUES
('repair', 'buffer_before_minutes', '30', 'Buffer time before reservation (minutes)'),
('repair', 'buffer_after_minutes', '30', 'Buffer time after reservation (minutes)'),
('repair', 'enable_time_conflict_check', 'true', 'Enable time conflict checking')
ON CONFLICT (service_type, setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Tuning service settings
INSERT INTO service_settings (service_type, setting_key, setting_value, description) VALUES
('tuning', 'buffer_before_minutes', '30', 'Buffer time before reservation (minutes)'),
('tuning', 'buffer_after_minutes', '30', 'Buffer time after reservation (minutes)'),
('tuning', 'enable_time_conflict_check', 'true', 'Enable time conflict checking')
ON CONFLICT (service_type, setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = NOW(); 