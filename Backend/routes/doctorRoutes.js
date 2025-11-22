// Backend/src/routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const { clerkAuth } = require("../middleware/auth");
const {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getProfileWithStats,
  getAppointments,
  createDoctor,
  listAll,
} = require("../controllers/doctorController");

// All routes mounted under /api/doctors

// Doctor self-service
router.get("/me", clerkAuth, getMyProfile);           // GET /api/doctors/me
router.patch("/me", clerkAuth, updateMyProfile);      // PATCH /api/doctors/me
router.delete("/me", clerkAuth, deleteMyProfile);     // DELETE /api/doctors/me

// Doctor dashboard and appointments
router.get("/", clerkAuth, getProfileWithStats);      // GET /api/doctors
router.get("/appointments", clerkAuth, getAppointments); // GET /api/doctors/appointments

// Doctor creation
router.post("/", clerkAuth, createDoctor);            // POST /api/doctors

// Doctor listing (used by patients to select a doctor when booking)
router.get("/all", clerkAuth, listAll);               // GET /api/doctors/all

module.exports = router;
