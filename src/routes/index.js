const express = require('express');
const router = express.Router();

// Import all route modules
const userRoutes = require('./users');
const projectRoutes = require('./projects');
const characterRoutes = require('./characters');
const characterVariantRoutes = require('./characterVariants');
const settingRoutes = require('./settings');
const panelRoutes = require('./panels');

// Welcome route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Flowboarder API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      projects: '/api/projects',
      characters: '/api/characters',
      characterVariants: '/api/character-variants',
      settings: '/api/settings',
      panels: '/api/panels'
    }
  });
});

// Mount routes
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/characters', characterRoutes);
router.use('/character-variants', characterVariantRoutes);
router.use('/settings', settingRoutes);
router.use('/panels', panelRoutes);

module.exports = router;
