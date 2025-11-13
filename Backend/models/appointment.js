const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  userId: { type: String, required: true }, // Clerk user ID or placeholder
  date: { type: Date, required: true },
  type: { type: String, enum: ['virtual', 'in-person', 'home visit'], required: true },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = {Appointment};