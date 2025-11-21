// src/models/Doctor.js
const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    specialty: { type: String },
    licenseNumber: { type: String },
    location: { type: String },
    yearsOfExperience: { type: Number, default: 0 },
    languagesSpoken: { type: [String], default: [] },
    bio: { type: String },
    contactInfo: {
      phone: String,
      email: String,
      address: String,
    },
    profileImage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DoctorSchema);
