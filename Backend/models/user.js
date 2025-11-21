const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },
  email: String,
  firstName: String,
  lastName: String,
  role: { type: String, enum: ["doctor", "patient", "admin"], default: "patient" },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);