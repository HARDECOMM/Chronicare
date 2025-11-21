// Backend/src/routes/appointmentRoutes.js
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

// All routes mounted under /api/appointments

// Patient booking and management
router.post("/", clerkAuth, create);                 // POST /api/appointments
router.get("/patient", clerkAuth, listForPatient);   // GET /api/appointments/patient

// Doctor management
router.get("/doctor", clerkAuth, listForDoctor);     // GET /api/appointments/doctor
router.post("/:id/confirm", clerkAuth, confirm);     // POST /api/appointments/:id/confirm
router.post("/:id/cancel", clerkAuth, cancel);       // POST /api/appointments/:id/cancel
router.post("/:id/notes", clerkAuth, addNote);       // POST /api/appointments/:id/notes

// Health check
router.get("/ping", (req, res) => res.send("Appointment routes alive")); // GET /api/appointments/ping

module.exports = router;
console.log("✅ appointmentRoutes loaded");