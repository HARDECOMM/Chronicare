// src/models/doctor.js
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk user ID

  name: { type: String, required: true },
  specialty: { type: String, required: true },
  licenseNumber: { type: String }, // optional
  location: { type: String },      // optional

  yearsOfExperience: { type: Number, default: 0 },

  languagesSpoken: [{ type: String }], // array of strings

  bio: { type: String }, // optional short description

  contactInfo: {
    phone: { type: String },
    email: { type: String },
    address: { type: String },
  },

  profileImage: { type: String }, // URL string

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Doctor", doctorSchema);
