const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");

// Create doctor profile
exports.createDoctor = async (req, res) => {
  const { clerkId } = req;
  const exists = await Doctor.findOne({ clerkId });
  if (exists) return res.status(400).json({ error: "Doctor profile already exists" });

  try {
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

// Get logged-in doctor profile
exports.getMyProfile = async (req, res) => {
  const { clerkId } = req;
  const doc = await Doctor.findOne({ clerkId });
  if (!doc) return res.status(404).json({ error: "Doctor not found" });
  res.json({ profile: doc });
};

// Update logged-in doctor profile
exports.updateMyProfile = async (req, res) => {
  const { clerkId } = req;
  const doc = await Doctor.findOneAndUpdate({ clerkId }, { $set: req.body }, { new: true });
  if (!doc) return res.status(404).json({ error: "Doctor not found" });
  res.json({ profile: doc });
};

// Delete logged-in doctor profile
exports.deleteMyProfile = async (req, res) => {
  const { clerkId } = req;
  const del = await Doctor.findOneAndDelete({ clerkId });
  if (!del) return res.status(404).json({ error: "Doctor not found" });
  res.json({ ok: true });
};

// Get doctor profile with stats
exports.getProfileWithStats = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();
    const doctor = await Doctor.findOne({ clerkId });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const totalAppointments = await Appointment.countDocuments({ doctorId: doctor._id });

    const appointmentsToday = await Appointment.countDocuments({
      doctorId: doctor._id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "canceled" }
    });

    const patientsServed = (
      await Appointment.distinct("patientId", { doctorId: doctor._id, status: "confirmed" })
    ).length;

    res.json({
      doctor,
      stats: {
        totalAppointments,
        appointmentsToday,
        patientsServed,
      },
    });
  } catch (err) {
    console.error("❌ Error loading doctor stats:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
};

// Get appointments for logged-in doctor
exports.getAppointments = async (req, res) => {
  const { clerkId } = req;
  const appts = await Appointment.find({ doctorClerkId: clerkId }).sort({ date: 1 });
  res.json({ appointments: appts });
};

// ✅ List all doctors (for patient dropdown)
exports.listAll = async (req, res) => {
  try {
    const docs = await Doctor.find().sort({ createdAt: -1 });
    res.status(200).json({ doctors: docs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors", details: err.message });
  }
};