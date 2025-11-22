// src/models/patient.js
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk user ID

  name: { type: String, required: true },
  age: { type: Number, required: true },
  dateOfBirth: { type: Date }, // optional if age is provided
  gender: { type: String, enum: ["male", "female", "other"], required: true },

  contactInfo: {
    phone: { type: String, required: true },
    address: { type: String },
  },

  medicalHistory: [{ type: String }], // array of chronic conditions
  allergies: [{ type: String }],      // array of allergies

  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relation: { type: String, required: true },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
