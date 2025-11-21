// ...existing code...
const express = require("express");
const router = express.Router();
// use local clerkAuth middleware (replace Clerk's requireAuth)
const { clerkAuth } = require("../middleware/auth");
// require the correct controllers folder and filename
const {
  sync,
  getRole,
  setRole,
} = require("../controllers/userController");

// All routes mounted under /api/users

// Sync user data
router.post("/sync", clerkAuth, sync); // POST /api/users/sync

// Get user role
router.get("/role/:clerkId", getRole); // GET /api/users/:clerkId/role

// Set user role
router.post("/role", clerkAuth, setRole); // POST /api/users/role

module.exports = router;