-- Migration: Add foreign key constraints
-- Establishes referential integrity between tables

-- Projects -> Users
ALTER TABLE projects
ADD CONSTRAINT fk_projects_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

-- Characters -> Projects
ALTER TABLE characters
ADD CONSTRAINT fk_characters_project
FOREIGN KEY (project_id) REFERENCES projects(id)
ON DELETE CASCADE;

-- Character Variants -> Characters
ALTER TABLE character_variants
ADD CONSTRAINT fk_character_variants_character
FOREIGN KEY (character_id) REFERENCES characters(id)
ON DELETE CASCADE;

-- Settings -> Projects
ALTER TABLE settings
ADD CONSTRAINT fk_settings_project
FOREIGN KEY (project_id) REFERENCES projects(id)
ON DELETE CASCADE;

-- Panels -> Projects
ALTER TABLE panels
ADD CONSTRAINT fk_panels_project
FOREIGN KEY (project_id) REFERENCES projects(id)
ON DELETE CASCADE;

-- Panels -> Settings (optional relationship)
ALTER TABLE panels
ADD CONSTRAINT fk_panels_setting
FOREIGN KEY (setting_id) REFERENCES settings(id)
ON DELETE SET NULL;

-- Panel Characters -> Panels
ALTER TABLE panel_characters
ADD CONSTRAINT fk_panel_characters_panel
FOREIGN KEY (panel_id) REFERENCES panels(id)
ON DELETE CASCADE;

-- Panel Characters -> Character Variants
ALTER TABLE panel_characters
ADD CONSTRAINT fk_panel_characters_variant
FOREIGN KEY (character_variant_id) REFERENCES character_variants(id)
ON DELETE CASCADE;
