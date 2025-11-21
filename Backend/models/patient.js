// models/patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // link to User
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  contactInfo: {
    phone: { type: String },
    address: { type: String },
  },
  medicalHistory: [{ type: String }], // e.g. ["diabetes", "hypertension"]
  allergies: [{ type: String }],
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relation: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = { Patient };
