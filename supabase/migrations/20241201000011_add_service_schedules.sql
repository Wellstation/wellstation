-- Add default service schedules for all service types
-- Each service type will have schedules for Monday to Friday (1-5)
-- with different time slots

-- Parking service schedules (Monday to Friday, 9:00-18:00)
INSERT INTO service_schedules (service_type, day_of_week, start_time, end_time, is_active) VALUES
('parking', 1, '09:00:00', '18:00:00', true), -- Monday
('parking', 2, '09:00:00', '18:00:00', true), -- Tuesday
('parking', 3, '09:00:00', '18:00:00', true), -- Wednesday
('parking', 4, '09:00:00', '18:00:00', true), -- Thursday
('parking', 5, '09:00:00', '18:00:00', true) -- Friday
ON CONFLICT (service_type, day_of_week) DO UPDATE SET
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Repair service schedules (Monday to Friday, 9:00-18:00)
INSERT INTO service_schedules (service_type, day_of_week, start_time, end_time, is_active) VALUES
('repair', 1, '09:00:00', '18:00:00', true), -- Monday
('repair', 2, '09:00:00', '18:00:00', true), -- Tuesday
('repair', 3, '09:00:00', '18:00:00', true), -- Wednesday
('repair', 4, '09:00:00', '18:00:00', true), -- Thursday
('repair', 5, '09:00:00', '18:00:00', true) -- Friday
ON CONFLICT (service_type, day_of_week) DO UPDATE SET
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Tuning service schedules (Monday to Friday, 9:00-18:00)
INSERT INTO service_schedules (service_type, day_of_week, start_time, end_time, is_active) VALUES
('tuning', 1, '09:00:00', '18:00:00', true), -- Monday
('tuning', 2, '09:00:00', '18:00:00', true), -- Tuesday
('tuning', 3, '09:00:00', '18:00:00', true), -- Wednesday
('tuning', 4, '09:00:00', '18:00:00', true), -- Thursday
('tuning', 5, '09:00:00', '18:00:00', true) -- Friday
ON CONFLICT (service_type, day_of_week) DO UPDATE SET
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time,
    is_active = EXCLUDED.is_active,
    updated_at = NOW(); 