const express = require("express");
const router = express.Router();
const { clerkAuth } = require("../middleware/auth");

const {
  create,           // Patient books appointment
  listForPatient,   // Patient lists own appointments
  listForDoctor,    // Doctor lists own appointments
  confirm,          // Doctor confirms appointment
  cancelByDoctor,   // Doctor cancels appointment
  cancelByPatient,  // Patient cancels appointment
  addNote,          // Add note (doctor or patient)
  updateNote,       // Update note (doctor or patient)
  deleteNote,       // Delete note (doctor or patient)
} = require("../controllers/appointmentController");

// ===============================
// 📌 Patient routes
// ===============================

// Patient books appointment
// POST /api/appointments
router.post("/", clerkAuth, create);

// Patient lists own appointments
// GET /api/appointments/patient
router.get("/patient", clerkAuth, listForPatient);

// Patient cancels appointment
// PATCH /api/appointments/:id/status/cancel/patient
router.patch("/:id/status/cancel/patient", clerkAuth, cancelByPatient);

// ===============================
// 📌 Doctor routes
// ===============================

// Doctor lists own appointments
// GET /api/appointments/doctor
router.get("/doctor", clerkAuth, listForDoctor);

// Doctor confirms appointment
// PATCH /api/appointments/:id/status/confirm
router.patch("/:id/status/confirm", clerkAuth, confirm);

// Doctor cancels appointment
// PATCH /api/appointments/:id/status/cancel/doctor
router.patch("/:id/status/cancel/doctor", clerkAuth, cancelByDoctor);

// ===============================
// 📌 Notes routes (shared)
// ===============================

// Add note (doctor or patient)
// PATCH /api/appointments/:id/notes
router.patch("/:id/notes", clerkAuth, addNote);

// Update note (doctor or patient)
// PATCH /api/appointments/:appointmentId/notes/:noteId
router.patch("/:appointmentId/notes/:noteId", clerkAuth, updateNote);

// Delete note (doctor or patient)
// DELETE /api/appointments/:appointmentId/notes/:noteId
router.delete("/:appointmentId/notes/:noteId", clerkAuth, deleteNote);

module.exports = router;

console.log("✅ appointmentRoutes loaded");
