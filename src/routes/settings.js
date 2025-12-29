const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

// GET all settings
router.get('/', settingController.getAllSettings);

// GET settings by project ID
router.get('/project/:projectId', settingController.getSettingsByProjectId);

// GET setting by ID
router.get('/:id', settingController.getSettingById);

// POST create new setting
router.post('/', settingController.createSetting);

// PUT update setting
router.put('/:id', settingController.updateSetting);

// DELETE setting
router.delete('/:id', settingController.deleteSetting);

module.exports = router;
