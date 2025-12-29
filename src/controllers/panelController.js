const Panel = require('../models/Panel');
const PanelCharacter = require('../models/PanelCharacter');

/**
 * Get all panels
 */
const getAllPanels = async (req, res) => {
  try {
    const panels = await Panel.findAll();
    res.json({ success: true, data: panels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get panels by project ID
 */
const getPanelsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const panels = await Panel.findByProjectId(projectId);
    res.json({ success: true, data: panels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get panel by ID
 */
const getPanelById = async (req, res) => {
  try {
    const { id } = req.params;
    const panel = await Panel.findById(id);

    if (!panel) {
      return res.status(404).json({ success: false, error: 'Panel not found' });
    }

    res.json({ success: true, data: panel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get panel with all characters
 */
const getPanelWithCharacters = async (req, res) => {
  try {
    const { id } = req.params;
    const panel = await Panel.getPanelWithCharacters(id);

    if (!panel) {
      return res.status(404).json({ success: false, error: 'Panel not found' });
    }

    res.json({ success: true, data: panel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Create a new panel
 */
const createPanel = async (req, res) => {
  try {
    const {
      project_id,
      setting_id,
      image_link,
      shot_type,
      aspect_ratio,
      description,
      reference_img
    } = req.body;

    const panel = await Panel.create({
      project_id,
      setting_id,
      image_link,
      shot_type,
      aspect_ratio,
      description,
      reference_img
    });

    res.status(201).json({ success: true, data: panel });
  } catch (error) {
    const statusCode = error.message.includes('required') ? 400 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * Update panel
 */
const updatePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      setting_id,
      image_link,
      shot_type,
      aspect_ratio,
      description,
      reference_img
    } = req.body;

    const panel = await Panel.update(id, {
      setting_id,
      image_link,
      shot_type,
      aspect_ratio,
      description,
      reference_img
    });

    if (!panel) {
      return res.status(404).json({ success: false, error: 'Panel not found' });
    }

    res.json({ success: true, data: panel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete panel
 */
const deletePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Panel.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Panel not found' });
    }

    res.json({ success: true, message: 'Panel deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Add character variant to panel
 */
const addCharacterToPanel = async (req, res) => {
  try {
    const { id } = req.params;
    const { character_variant_id } = req.body;

    if (!character_variant_id) {
      return res.status(400).json({
        success: false,
        error: 'character_variant_id is required'
      });
    }

    const panelCharacter = await PanelCharacter.create({
      panel_id: id,
      character_variant_id
    });

    res.status(201).json({ success: true, data: panelCharacter });
  } catch (error) {
    const statusCode = error.message.includes('already in this panel') ? 409 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * Remove character variant from panel
 */
const removeCharacterFromPanel = async (req, res) => {
  try {
    const { id, variantId } = req.params;

    const removed = await PanelCharacter.removeCharacterFromPanel(id, variantId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: 'Character variant not found in this panel'
      });
    }

    res.json({ success: true, message: 'Character removed from panel successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllPanels,
  getPanelsByProjectId,
  getPanelById,
  getPanelWithCharacters,
  createPanel,
  updatePanel,
  deletePanel,
  addCharacterToPanel,
  removeCharacterFromPanel
};
