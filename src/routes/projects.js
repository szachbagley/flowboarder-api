const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// GET all projects
router.get('/', projectController.getAllProjects);

// GET projects by user ID
router.get('/user/:userId', projectController.getProjectsByUserId);

// GET project by ID
router.get('/:id', projectController.getProjectById);

// POST create new project
router.post('/', projectController.createProject);

// PUT update project
router.put('/:id', projectController.updateProject);

// DELETE project
router.delete('/:id', projectController.deleteProject);

module.exports = router;
