-- Update admin_auth to use plain text password verification
-- Drop the old function and create a new one for plain text comparison

-- Drop the old function
DROP FUNCTION IF EXISTS verify_admin_password(TEXT, TEXT);

-- Create new function for plain text password verification
CREATE OR REPLACE FUNCTION verify_admin_password(input_password TEXT, stored_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN input_password = stored_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing admin user password to plain text (if it was hashed)
UPDATE public.admin_auth 
SET password_hash = 'admin123' 
WHERE username = 'admin' AND password_hash != 'admin123'; 