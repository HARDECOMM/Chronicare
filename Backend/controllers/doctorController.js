// controllers/doctorController.js
const mongoose = require('mongoose');

// Flexible model imports (support named or default exports)
let Doctor;
let Appointment;
try {
  const docMod = require('../models/doctor');
  Doctor = docMod.Doctor || docMod.default || docMod;
} catch (e) {
  console.error('Failed to require Doctor model:', e);
  throw e;
}

try {
  const apptMod = require('../models/appointment');
  Appointment = apptMod.Appointment || apptMod.default || apptMod;
} catch (e) {
  console.error('Failed to require Appointment model:', e);
  throw e;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

function getAuthInfo(req) {
  return typeof req.auth === 'function' ? req.auth() : req.user || {};
}

// READ ALL DOCTORS
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().lean();
    return res.status(200).json(doctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// READ DOCTOR BY ID
exports.getDoctorById = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'Missing doctor id' });
  if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid doctor id format' });

  try {
    const doctor = await Doctor.findById(id).lean();
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    return res.status(200).json(doctor);
  } catch (err) {
    console.error('Error fetching doctor by ID:', err);
    return res.status(500).json({ error: 'Failed to fetch doctor', details: err.message });
  }
};

// READ DOCTOR BY CLERK ID (auto-create if missing)
exports.getDoctorByClerkId = async (req, res) => {
  try {
    const authInfo = getAuthInfo(req);
    const clerkId = authInfo.userId || authInfo.clerkId || authInfo.id;

    if (!clerkId) return res.status(401).json({ error: 'Unauthorized: missing clerk id' });

    let doctor = await Doctor.findOne({ clerkId }).lean();

    if (!doctor) {
      const newDoc = new Doctor({
        clerkId,
        name: 'New Doctor',
        specialty: 'General',
        location: '',
        bio: '',
        available: false,
      });
      await newDoc.save();
      doctor = newDoc.toObject();
      console.log('🆕 Auto-created doctor profile:', doctor._id);
    }

    return res.status(200).json(doctor);
  } catch (err) {
    console.error('Error fetching doctor by Clerk ID:', err);
    return res.status(500).json({ error: 'Failed to fetch doctor profile', details: err.message });
  }
};

// CREATE DOCTOR PROFILE
exports.createDoctor = async (req, res) => {
  try {
    const authInfo = getAuthInfo(req);
    const clerkId = authInfo.userId || authInfo.clerkId || authInfo.id;
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized: missing clerk id' });

    const { name, specialty, location, bio } = req.body;
    if (!name || !specialty) return res.status(400).json({ error: 'Missing required fields: name or specialty' });

    const existing = await Doctor.findOne({ clerkId }).lean();
    if (existing) return res.status(400).json({ error: 'Doctor profile already exists' });

    const doctor = new Doctor({
      name,
      specialty,
      location: location || '',
      bio: bio || '',
      clerkId,
    });

    await doctor.save();
    return res.status(201).json(doctor);
  } catch (err) {
    console.error('Error creating doctor profile:', err);
    return res.status(500).json({ error: 'Failed to create doctor profile', details: err.message });
  }
};

// UPDATE DOCTOR PROFILE
exports.updateDoctorProfile = async (req, res) => {
  try {
    const authInfo = getAuthInfo(req);
    const clerkId = authInfo.userId || authInfo.clerkId || authInfo.id;
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized: missing clerk id' });

    const updates = req.body;
    const doctor = await Doctor.findOneAndUpdate({ clerkId }, updates, {
      new: true,
      runValidators: true,
    });

    if (!doctor) return res.status(404).json({ error: 'Doctor profile not found' });

    return res.status(200).json(doctor);
  } catch (err) {
    console.error('Error updating doctor profile:', err);
    return res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
};

// GET APPOINTMENTS FOR A DOCTOR (by logged-in doctor)
exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    const authInfo = getAuthInfo(req);
    const clerkId = authInfo.userId || authInfo.clerkId || authInfo.id;
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized: missing clerk id' });

    const doctor = await Doctor.findOne({ clerkId }).select('_id').lean();
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    // populate patient/user field depending on your Appointment schema (userId or patientId)
    const appointments = await Appointment.find({ doctorId: doctor._id }).populate('userId patientId');
    return res.status(200).json(appointments);
  } catch (err) {
    console.error('Error fetching doctor appointments:', err);
    return res.status(500).json({ error: 'Failed to fetch appointments', details: err.message });
  }
};

// UPDATE APPOINTMENT STATUS (doctor endpoint)
exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) return res.status(400).json({ error: 'Missing appointment id' });
  if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid appointment id format' });

  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    return res.status(200).json(appointment);
  } catch (err) {
    console.error('Error updating appointment status:', err);
    return res.status(500).json({ error: 'Failed to update status', details: err.message });
  }
};
