// ...existing code...
const express = require("express");
const router = express.Router();
// replaced requireAuth with local clerkAuth middleware
const { clerkAuth } = require("../middleware/auth");
const {
  createPatient,
  getPatientByClerkId,
  updatePatientProfile,
  getAppointmentsForUser,
  listAllPatients,
} = require("../controllers/patientController");

// All routes mounted under /api/patients

// Patient profile
router.post("/", clerkAuth, createPatient);          // POST /api/patients
router.get("/me", clerkAuth, getPatientByClerkId);   // GET /api/patients/me
router.patch("/me", clerkAuth, updatePatientProfile);// PATCH /api/patients/me

// Patient appointments
router.get("/me/appointments", clerkAuth, getAppointmentsForUser); // GET /api/patients/me/appointments

// Admin
router.get("/all", clerkAuth, listAllPatients);      // GET /api/patients/all

module.exports = router;