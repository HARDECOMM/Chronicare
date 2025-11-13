const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { getDoctors, getDoctorById} = require('../controllers/doctorController');

router.get('/', requireAuth(), getDoctors); // 🔒 protected
router.get('/:id', requireAuth(), getDoctorById); // Get doctor by ID

module.exports = router;