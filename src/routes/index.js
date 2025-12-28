const express = require('express');
const router = express.Router();
const userRoutes = require('./users');

// Welcome route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Flowboarder API' });
});

// User routes
router.use('/users', userRoutes);

module.exports = router;
