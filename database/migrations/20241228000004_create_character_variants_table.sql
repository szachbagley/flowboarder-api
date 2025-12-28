-- Migration: Create character_variants table
-- Generated from CharacterVariant model

CREATE TABLE IF NOT EXISTS character_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  character_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  reference_img VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_character_id (character_id)
);
