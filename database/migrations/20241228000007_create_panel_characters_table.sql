-- Migration: Create panel_characters table
-- Generated from PanelCharacter model

CREATE TABLE IF NOT EXISTS panel_characters (
  panel_id INT NOT NULL,
  character_variant_id INT NOT NULL,
  PRIMARY KEY (panel_id, character_variant_id)
);
