// src/routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const { clerkAuth } = require("../middleware/auth");
const {
  create,
  listForPatient,
  listForDoctor,
  confirm,
  cancel,
  addNote,
} = require("../controllers/appointmentController");

// Patient books appointment
// POST /api/appointments
router.post("/", clerkAuth, create);

// Patient lists own appointments
// GET /api/appointments/patient
router.get("/patient", clerkAuth, listForPatient);

// Doctor lists own appointments
// GET /api/appointments/doctor
router.get("/doctor", clerkAuth, listForDoctor);

// Doctor confirms appointment
// PATCH /api/appointments/:id/status/confirm
router.patch("/:id/status/confirm", clerkAuth, confirm);

// Doctor cancels appointment
// PATCH /api/appointments/:id/status/cancel
router.patch("/:id/status/cancel", clerkAuth, cancel);

// Add note (doctor or patient)
// PATCH /api/appointments/:id/notes
router.patch("/:id/notes", clerkAuth, addNote);

module.exports = router;

console.log("✅ appointmentRoutes loaded");
