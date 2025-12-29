const express = require('express');
const router = express.Router();
const characterVariantController = require('../controllers/characterVariantController');

// GET all character variants
router.get('/', characterVariantController.getAllVariants);

// GET variants by character ID
router.get('/character/:characterId', characterVariantController.getVariantsByCharacterId);

// GET variant by ID
router.get('/:id', characterVariantController.getVariantById);

// POST create new variant
router.post('/', characterVariantController.createVariant);

// PUT update variant
router.put('/:id', characterVariantController.updateVariant);

// DELETE variant
router.delete('/:id', characterVariantController.deleteVariant);

module.exports = router;
