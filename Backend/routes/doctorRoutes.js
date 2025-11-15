const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const {
  getDoctors,
  getDoctorById,
  getDoctorByClerkId,
  createDoctor,
  updateDoctorProfile,
  getAppointmentsForDoctor,
  updateAppointmentStatus,
} = require('../controllers/doctorController');

router.get('/', requireAuth(), getDoctors);

// Put fixed routes before the dynamic param
router.get('/me', requireAuth(), getDoctorByClerkId); // logged-in doctor

// Make profile public by removing requireAuth,
// or keep requireAuth() if only authenticated users may view profiles
router.get('/:id', /* requireAuth(), */ getDoctorById);

router.post('/', requireAuth(), createDoctor);
router.patch('/me', requireAuth(), updateDoctorProfile);

// doctor appointments and status routes
router.get('/appointments/doctor', requireAuth(), getAppointmentsForDoctor);
router.patch('/appointments/:id/status', requireAuth(), updateAppointmentStatus);

module.exports = router;
