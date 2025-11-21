// src/controllers/appointments.controller.js
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");

// Patient creates appointment
exports.create = async (req, res) => {
  const { clerkId } = req; // patient
  const { doctorClerkId, date, reason, patientName } = req.body;
  if (!doctorClerkId || !date) return res.status(400).json({ error: "doctorClerkId and date are required" });

  const doctorExists = await Doctor.findOne({ clerkId: doctorClerkId });
  if (!doctorExists) return res.status(404).json({ error: "Doctor not found" });

  const appt = await Appointment.create({
    doctorClerkId,
    patientClerkId: clerkId,
    patientName: patientName || "",
    reason: reason || "",
    date: new Date(date),
    status: "pending",
  });

  res.status(201).json({ appointment: appt });
};

// Patient lists own appointments
exports.listForPatient = async (req, res) => {
  const { clerkId } = req;
  const appts = await Appointment.find({ patientClerkId: clerkId }).sort({ date: 1 });
  res.json({ appointments: appts });
};

// Doctor lists own appointments (duplicated for ease)
exports.listForDoctor = async (req, res) => {
  const { clerkId } = req;
  const appts = await Appointment.find({ doctorClerkId: clerkId }).sort({ date: 1 });
  res.json({ appointments: appts });
};

// Doctor confirms
exports.confirm = async (req, res) => {
  const { clerkId } = req;
  const { id } = req.params;
  const appt = await Appointment.findOneAndUpdate(
    { _id: id, doctorClerkId: clerkId },
    { $set: { status: "confirmed" } },
    { new: true }
  );
  if (!appt) return res.status(404).json({ error: "Appointment not found" });
  res.json({ appointment: appt });
};

// Doctor cancels
exports.cancel = async (req, res) => {
  const { clerkId } = req;
  const { id } = req.params;
  const appt = await Appointment.findOneAndUpdate(
    { _id: id, doctorClerkId: clerkId },
    { $set: { status: "canceled" } },
    { new: true }
  );
  if (!appt) return res.status(404).json({ error: "Appointment not found" });
  res.json({ appointment: appt });
};

// Add note (both doctor and patient can add notes)
exports.addNote = async (req, res) => {
  const { clerkId } = req;
  const { id } = req.params;
  const { message, authorType } = req.body;
  if (!message || !authorType) return res.status(400).json({ error: "message and authorType are required" });
  if (!["doctor", "patient"].includes(authorType)) return res.status(400).json({ error: "Invalid authorType" });

  const appt = await Appointment.findOneAndUpdate(
    { _id: id },
    { $push: { notes: { authorType, authorId: clerkId, message, createdAt: new Date() } } },
    { new: true }
  );
  if (!appt) return res.status(404).json({ error: "Appointment not found" });
  res.json({ appointment: appt });
};
