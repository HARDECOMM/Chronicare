const Patient = require("../models/patient");
const User = require("../models/user");
const Appointment = require("../models/appointment"); // <-- ensure this model exists

/**
 * Clerk sync: ensures a Clerk user exists in our DB
 */
exports.syncUser = async (req, res) => {
  const { clerkId, name, email } = req.body;
  if (!clerkId || !email) {
    return res.status(400).json({ error: "Missing clerkId or email" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        name,
        email: normalizedEmail,
        role: "patient",
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      error: "Server error during user sync",
      details: err.message,
    });
  }
};

/**
 * Create patient profile (only if none exists yet)
 */
exports.createPatient = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized: missing clerk id" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existing = await Patient.findOne({ userId: user._id });
    if (existing) {
      return res.status(400).json({ error: "Patient profile already exists" });
    }

    const patient = new Patient({
      userId: user._id,
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      contactInfo: {
        phone: req.body.phone,
        address: req.body.address,
      },
      medicalHistory: req.body.medicalHistory || [],
      allergies: req.body.allergies || [],
      emergencyContact: {
        name: req.body.emergencyContactName,
        phone: req.body.emergencyContactPhone,
        relation: req.body.emergencyContactRelation,
      },
    });

    await patient.save();
    return res.status(201).json(patient.toObject());
  } catch (err) {
    return res.status(500).json({
      error: "Failed to create patient profile",
      details: err.message,
    });
  }
};

/**
 * Get logged-in patient profile
 */
exports.getPatientByClerkId = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized: missing clerk id" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const patient = await Patient.findOne({ userId: user._id });
    return res.status(200).json(patient ? patient.toObject() : null);
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch patient profile",
      details: err.message,
    });
  }
};

/**
 * Update or create patient profile (upsert)
 */
exports.updatePatientProfile = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized: missing clerk id" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const patient = await Patient.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          name: req.body.name,
          age: req.body.age,
          gender: req.body.gender,
          contactInfo: {
            phone: req.body.phone,
            address: req.body.address,
          },
          medicalHistory: req.body.medicalHistory || [],
          allergies: req.body.allergies || [],
          emergencyContact: {
            name: req.body.emergencyContactName,
            phone: req.body.emergencyContactPhone,
            relation: req.body.emergencyContactRelation,
          },
          userId: user._id,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json(patient.toObject());
  } catch (err) {
    return res.status(500).json({
      error: "Failed to update patient profile",
      details: err.message,
    });
  }
};

/**
 * Get appointments for logged-in patient
 */
exports.getAppointmentsForUser = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized: missing clerk id" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const patient = await Patient.findOne({ userId: user._id });
    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found" });
    }

    const appointments = await Appointment.find({ patientId: patient._id })
      .populate("doctorId", "name specialty")
      .sort({ date: 1 });

    return res.status(200).json({ appointments });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch appointments",
      details: err.message,
    });
  }
};