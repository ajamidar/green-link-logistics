ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN phone_number VARCHAR(50);

CREATE INDEX idx_users_full_name ON users(full_name);
