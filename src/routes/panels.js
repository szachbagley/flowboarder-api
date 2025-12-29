const express = require('express');
const router = express.Router();
const panelController = require('../controllers/panelController');

// GET all panels
router.get('/', panelController.getAllPanels);

// GET panels by project ID
router.get('/project/:projectId', panelController.getPanelsByProjectId);

// GET panel by ID with characters
router.get('/:id/characters', panelController.getPanelWithCharacters);

// GET panel by ID
router.get('/:id', panelController.getPanelById);

// POST create new panel
router.post('/', panelController.createPanel);

// PUT update panel
router.put('/:id', panelController.updatePanel);

// DELETE panel
router.delete('/:id', panelController.deletePanel);

// POST add character variant to panel
router.post('/:id/characters', panelController.addCharacterToPanel);

// DELETE remove character variant from panel
router.delete('/:id/characters/:variantId', panelController.removeCharacterFromPanel);

module.exports = router;
