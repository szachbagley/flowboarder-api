-- This script runs automatically when the MySQL container first starts

-- Use the database (it's already created by Docker from MYSQL_DATABASE env var)
USE flowboarder_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Insert sample data (optional)
INSERT INTO users (email, name) VALUES
  ('admin@flowboarder.com', 'Admin User'),
  ('demo@flowboarder.com', 'Demo User')
ON DUPLICATE KEY UPDATE name=VALUES(name);
