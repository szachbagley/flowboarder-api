const Character = require('../models/Character');

/**
 * Get all characters
 */
const getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.findAll();
    res.json({ success: true, data: characters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get characters by project ID
 */
const getCharactersByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const characters = await Character.findByProjectId(projectId);
    res.json({ success: true, data: characters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get character by ID
 */
const getCharacterById = async (req, res) => {
  try {
    const { id } = req.params;
    const character = await Character.findById(id);

    if (!character) {
      return res.status(404).json({ success: false, error: 'Character not found' });
    }

    res.json({ success: true, data: character });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Create a new character
 */
const createCharacter = async (req, res) => {
  try {
    const { project_id, name, description, default_variant, variant, reference_img } = req.body;
    const character = await Character.create({
      project_id,
      name,
      description,
      default_variant,
      variant,
      reference_img
    });

    res.status(201).json({ success: true, data: character });
  } catch (error) {
    const statusCode = error.message.includes('required') ? 400 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * Update character
 */
const updateCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, default_variant, variant, reference_img } = req.body;

    const character = await Character.update(id, {
      name,
      description,
      default_variant,
      variant,
      reference_img
    });

    if (!character) {
      return res.status(404).json({ success: false, error: 'Character not found' });
    }

    res.json({ success: true, data: character });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete character
 */
const deleteCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Character.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Character not found' });
    }

    res.json({ success: true, message: 'Character deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllCharacters,
  getCharactersByProjectId,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter
};
