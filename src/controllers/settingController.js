const Setting = require('../models/Setting');

/**
 * Get all settings
 */
const getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get settings by project ID
 */
const getSettingsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const settings = await Setting.findByProjectId(projectId);
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get setting by ID
 */
const getSettingById = async (req, res) => {
  try {
    const { id } = req.params;
    const setting = await Setting.findById(id);

    if (!setting) {
      return res.status(404).json({ success: false, error: 'Setting not found' });
    }

    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Create a new setting
 */
const createSetting = async (req, res) => {
  try {
    const { project_id, name, description, reference_img } = req.body;
    const setting = await Setting.create({
      project_id,
      name,
      description,
      reference_img
    });

    res.status(201).json({ success: true, data: setting });
  } catch (error) {
    const statusCode = error.message.includes('required') ? 400 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * Update setting
 */
const updateSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, reference_img } = req.body;

    const setting = await Setting.update(id, {
      name,
      description,
      reference_img
    });

    if (!setting) {
      return res.status(404).json({ success: false, error: 'Setting not found' });
    }

    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete setting
 */
const deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Setting.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Setting not found' });
    }

    res.json({ success: true, message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllSettings,
  getSettingsByProjectId,
  getSettingById,
  createSetting,
  updateSetting,
  deleteSetting
};
