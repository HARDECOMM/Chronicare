// src/middleware/auth.js
const { requireAuth } = require("@clerk/express");

// Wrap Clerk requireAuth to extract clerkId easily
function clerkAuth(req, res, next) {
  return requireAuth()(req, res, () => {
    const clerkId = req.auth.userId;
    if (!clerkId) return res.status(401).json({ error: "Unauthorized" });
    req.clerkId = clerkId;
    next();
  });
}

module.exports = { clerkAuth };
