const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  authorType: { type: String, enum: ["doctor", "patient"], required: true },
  authorId: { type: String, required: true }, // Clerk userId
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }, // ✅ track edits
});

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },

  // ✅ Hybrid patient reference
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" }, // full profile
  patientClerkId: { type: String, required: true }, // Clerk ID for auth
  patientName: { type: String }, // snapshot for quick display

  reason: { type: String, default: "Not specified" },

  date: { type: Date, required: true },
  status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },

  // Recurrence
  isRecurring: { type: Boolean, default: false },
  recurrencePattern: { type: String, enum: ["none", "daily", "weekly", "monthly"], default: "none" },
  recurrenceCount: { type: Number, default: 1 },

  notes: [noteSchema], // ✅ embedded notes array

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
