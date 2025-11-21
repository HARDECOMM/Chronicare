// src/controllers/doctors.controller.js
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");

// src/controllers/doctors.controller.js
exports.createDoctor = async (req, res) => {
  const { clerkId } = req;
  const exists = await Doctor.findOne({ clerkId });
  if (exists) return res.status(400).json({ error: "Doctor profile already exists" });

  try {
    // Ensure name is provided
    if (!req.body.name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const doc = await Doctor.create({
      clerkId,
      name: req.body.name,
      specialty: req.body.specialty,
      licenseNumber: req.body.licenseNumber,
      location: req.body.location,
      yearsOfExperience: req.body.yearsOfExperience,
      languagesSpoken: req.body.languagesSpoken,
      bio: req.body.bio,
      contactInfo: req.body.contactInfo,
      profileImage: req.body.profileImage,
    });

    res.status(201).json({ profile: doc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  const { clerkId } = req;
  const doc = await Doctor.findOne({ clerkId });
  if (!doc) return res.status(404).json({ error: "Doctor not found" });
  res.json({ profile: doc });
};

exports.updateMyProfile = async (req, res) => {
  const { clerkId } = req;
  const doc = await Doctor.findOneAndUpdate({ clerkId }, { $set: req.body }, { new: true });
  if (!doc) return res.status(404).json({ error: "Doctor not found" });
  res.json({ profile: doc });
};

exports.deleteMyProfile = async (req, res) => {
  const { clerkId } = req;
  const del = await Doctor.findOneAndDelete({ clerkId });
  if (!del) return res.status(404).json({ error: "Doctor not found" });
  res.json({ ok: true });
};

exports.getProfileWithStats = async (req, res) => {
  const { clerkId } = req;
  const doc = await Doctor.findOne({ clerkId });
  if (!doc) return res.status(404).json({ error: "Doctor not found" });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const totalAppointments = await Appointment.countDocuments({ doctorClerkId: clerkId });
  const appointmentsToday = await Appointment.countDocuments({
    doctorClerkId: clerkId,
    date: { $gte: todayStart, $lte: todayEnd },
  });
  const patientsServed = await Appointment.distinct("patientClerkId", {
    doctorClerkId: clerkId,
    status: "confirmed",
  }).then((arr) => arr.length);

  res.json({
    doctor: doc,
    stats: { totalAppointments, appointmentsToday, patientsServed },
  });
};

exports.getAppointments = async (req, res) => {
  const { clerkId } = req;
  const appts = await Appointment.find({ doctorClerkId: clerkId }).sort({ date: 1 });
  res.json({ appointments: appts });
};

exports.listAll = async (req, res) => {
  const docs = await Doctor.find().sort({ createdAt: -1 });
  res.json({ doctors: docs });
};
