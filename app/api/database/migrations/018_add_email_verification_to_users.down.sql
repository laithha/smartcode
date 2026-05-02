ALTER TABLE users DROP COLUMN IF EXISTS is_verified;
ALTER TABLE users DROP COLUMN IF EXISTS verification_code;
ALTER TABLE users DROP COLUMN IF EXISTS verification_expires;
