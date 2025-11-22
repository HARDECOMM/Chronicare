// src/routes/patients.routes.js
const express = require("express");
const router = express.Router();
const { clerkAuth } = require("../middleware/auth");
const {
  createPatient,
  getPatientByClerkId,
  updatePatientProfile,
} = require("../controllers/patientController");

// Patient profile routes
router.post("/", clerkAuth, createPatient);          // POST /api/patients
router.get("/me", clerkAuth, getPatientByClerkId);   // GET /api/patients/me
router.patch("/me", clerkAuth, updatePatientProfile);// PATCH /api/patients/me

module.exports = router;
