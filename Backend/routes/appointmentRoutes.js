const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const {
  createAppointment,
  getAppointments,
  getAppointmentsForUser,
  updateAppointmentStatus,
  getAppointmentsByPatient,
  getAppointmentsForDoctor,
  deleteAppointment,
} = require('../controllers/appointmentController');

// ✅ Appointment creation
router.post('/', requireAuth(), createAppointment);

// ✅ Appointments for current user
router.get('/mine', requireAuth(), getAppointmentsForUser);

// ✅ All appointments for authenticated user (admin or patient)
router.get('/', requireAuth(), getAppointments);

// ✅ Appointments for logged-in doctor
router.get('/doctor', requireAuth(), getAppointmentsForDoctor);

// ✅ Appointments by patient ID (admin view)
router.get('/patient/:id', requireAuth(), getAppointmentsByPatient);

// ✅ Update appointment status
router.patch('/:id/status', requireAuth(), updateAppointmentStatus);

// ✅ Delete appointment
router.delete('/:id', requireAuth(), deleteAppointment);

module.exports = router;
