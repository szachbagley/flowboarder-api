const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

// GET all characters
router.get('/', characterController.getAllCharacters);

// GET characters by project ID
router.get('/project/:projectId', characterController.getCharactersByProjectId);

// GET character by ID
router.get('/:id', characterController.getCharacterById);

// POST create new character
router.post('/', characterController.createCharacter);

// PUT update character
router.put('/:id', characterController.updateCharacter);

// DELETE character
router.delete('/:id', characterController.deleteCharacter);

module.exports = router;
