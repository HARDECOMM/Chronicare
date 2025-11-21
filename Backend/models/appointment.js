// src/models/Appointment.js
const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    authorType: { type: String, enum: ["doctor", "patient"], required: true },
    authorId: { type: String, required: true }, // clerkId
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AppointmentSchema = new mongoose.Schema(
  {
    doctorClerkId: { type: String, required: true },
    patientClerkId: { type: String, required: true },
    patientName: { type: String },
    reason: { type: String },
    date: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
    notes: { type: [NoteSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
