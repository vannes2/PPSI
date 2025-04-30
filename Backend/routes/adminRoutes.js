// File: routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to fetch admin profile
router.get('/admin/profile', adminController.getAdminProfile);

module.exports = router;
