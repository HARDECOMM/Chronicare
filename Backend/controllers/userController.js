// ...existing code...
const User = require("../models/user");

exports.sync = async (req, res) => {
  try {
    const clerkId = req.clerkId || req.auth?.userId || req.auth?.clerkId;
    if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

    const { email, firstName, lastName } = req.body || {};
    const updated = await User.findOneAndUpdate(
      { clerkId },
      {
        $set: { email, firstName, lastName },
        $setOnInsert: { role: null }, // ✅ ensure new users start with null role
      },
      { upsert: true, new: true }
    );
    return res.json({ user: updated });
  } catch (err) {
    return res.status(500).json({ error: "Sync failed", details: err.message });
  }
};

exports.getRole = async (req, res) => {
  try {
    const clerkId = req.params?.clerkId || req.clerkId;
    if (!clerkId) return res.status(400).json({ role: null });

    const user = await User.findOne({ clerkId });
    return res.json({ role: user?.role ?? null });
  } catch (err) {
    return res.status(500).json({ error: "Failed to get role", details: err.message });
  }
};

exports.setRole = async (req, res) => {
  try {
    const clerkId = req.clerkId || req.auth?.userId || req.auth?.clerkId;
    if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

    const { role } = req.body;
    if (!["doctor", "patient", "admin"].includes(role))
      return res.status(400).json({ error: "Invalid role" });

    const user = await User.findOneAndUpdate(
      { clerkId },
      { $set: { role } },
      { new: true, upsert: true }
    );
    return res.json({ role: user.role });
  } catch (err) {
    return res.status(500).json({ error: "Failed to set role", details: err.message });
  }
};