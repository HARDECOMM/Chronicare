const { Patient } = require('../models/patient');
const { User } = require('../models/user');
const { Appointment } = require('../models/appointment');

// Clerk sync: ensure logged-in Clerk user exists in DB
exports.syncUser = async (req, res) => {
  const { clerkId, name, email } = req.body;
  if (!clerkId || !email) {
    return res.status(400).json({ error: 'Missing clerkId or email' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        name,
        email: normalizedEmail,
        role: 'patient', // default role
      });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error during user sync', details: err.message });
  }
};

// Create patient profile (explicitly called once)
exports.createPatient = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth(); // ✅ updated
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized: missing clerk id' });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existing = await Patient.findOne({ userId: user._id });
    if (existing) return res.status(400).json({ error: 'Patient profile already exists' });

    const patient = new Patient({
      userId: user._id,
      ...req.body,
    });

    await patient.save();
    return res.status(201).json(patient.toObject());
  } catch (err) {
    res.status(500).json({ error: 'Failed to create patient profile', details: err.message });
  }
};

// Get logged-in patient profile
exports.getPatientByClerkId = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized: missing clerk id' });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const patient = await Patient.findOne({ userId: user._id });
    if (!patient) {
      return res.status(200).json(null); // return null instead of 404
    }

    return res.status(200).json(patient.toObject());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patient profile', details: err.message });
  }
};

// Update or create patient profile
// Update or create patient profile
exports.updatePatientProfile = async (req, res) => {
  console.log("➡️ updatePatientProfile hit with body:", req.body);
  try {
    const { userId: clerkId } = req.auth();
    if (!clerkId) return res.status(401).json({ error: "Unauthorized: missing clerk id" });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const patient = await Patient.findOneAndUpdate(
      { userId: user._id },
      { $set: { ...req.body, userId: user._id } }, // ✅ use $set to preserve other fields
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json(patient.toObject());
  } catch (err) {
    res.status(500).json({ error: "Failed to update patient profile", details: err.message });
  }
};

// Admin: list all patients
exports.listAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('userId').lean();
    return res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get appointments for logged-in patient
exports.getAppointmentsForUser = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth(); // ✅ updated
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const appointments = await Appointment.find({ userId: user._id }).populate('doctorId');
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments', details: err.message });
  }
};
