-- Migration: Create panels table
-- Generated from Panel model

CREATE TABLE IF NOT EXISTS panels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  setting_id INT,
  image_link VARCHAR(500),
  shot_type VARCHAR(100),
  aspect_ratio VARCHAR(50),
  description TEXT,
  reference_img VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_project_id (project_id),
  INDEX idx_setting_id (setting_id)
);
