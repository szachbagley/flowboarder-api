const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Special routes (must come before /:id routes)
router.get('/search', userController.searchUsers);
router.get('/stats', userController.getUserStats);
router.get('/recent', userController.getRecentUsers);

// Standard CRUD routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
