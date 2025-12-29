const CharacterVariant = require('../models/CharacterVariant');

/**
 * Get all character variants
 */
const getAllVariants = async (req, res) => {
  try {
    const variants = await CharacterVariant.findAll();
    res.json({ success: true, data: variants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get variants by character ID
 */
const getVariantsByCharacterId = async (req, res) => {
  try {
    const { characterId } = req.params;
    const variants = await CharacterVariant.findByCharacterId(characterId);
    res.json({ success: true, data: variants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get variant by ID
 */
const getVariantById = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await CharacterVariant.findById(id);

    if (!variant) {
      return res.status(404).json({ success: false, error: 'Character variant not found' });
    }

    res.json({ success: true, data: variant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Create a new character variant
 */
const createVariant = async (req, res) => {
  try {
    const { character_id, name, description, reference_img } = req.body;
    const variant = await CharacterVariant.create({
      character_id,
      name,
      description,
      reference_img
    });

    res.status(201).json({ success: true, data: variant });
  } catch (error) {
    const statusCode = error.message.includes('required') ? 400 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * Update character variant
 */
const updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, reference_img } = req.body;

    const variant = await CharacterVariant.update(id, {
      name,
      description,
      reference_img
    });

    if (!variant) {
      return res.status(404).json({ success: false, error: 'Character variant not found' });
    }

    res.json({ success: true, data: variant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete character variant
 */
const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CharacterVariant.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Character variant not found' });
    }

    res.json({ success: true, message: 'Character variant deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllVariants,
  getVariantsByCharacterId,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant
};
