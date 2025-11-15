// controllers/appointmentController.js
const mongoose = require('mongoose');

// Support model import shapes: named export { Appointment } or default export
let Appointment;
let Doctor;
let User;
try {
  // try named exports first
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const apptMod = require('../models/appointment');
  Appointment = apptMod.Appointment || apptMod.default || apptMod;
} catch (e) {
  console.error('Failed to require Appointment model:', e);
  throw e;
}

try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const docMod = require('../models/doctor');
  Doctor = docMod.Doctor || docMod.default || docMod;
} catch (e) {
  console.error('Failed to require Doctor model:', e);
  throw e;
}

try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const userMod = require('../models/user');
  User = userMod.User || userMod.default || userMod;
} catch (e) {
  console.error('Failed to require User model:', e);
  throw e;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

// Resolve Clerk auth info to internal Mongo user._id
async function resolveClerkToMongoId(authInfo) {
  const clerkId = authInfo && (authInfo.userId || authInfo.clerkId || authInfo.id);
  if (!clerkId) return null;
  try {
    const user = await User.findOne({ clerkId }).select('_id').lean();
    return user ? String(user._id) : null;
  } catch (err) {
    // bubble up for controller to handle/log
    throw err;
  }
}

// Create Appointment (POST /api/appointments)
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, type, notes } = req.body;

    const authInfo = typeof req.auth === 'function' ? req.auth() : req.user || {};
    let userMongoId;
    try {
      userMongoId = await resolveClerkToMongoId(authInfo);
      console.log('Resolved userMongoId:', userMongoId);
    } catch (err) {
      console.error('Error resolving clerk id to mongo id:', err);
      return res.status(500).json({ error: 'Internal error resolving user', details: err.message });
    }

    console.log('📥 Incoming appointment:', { doctorId, date, type, notes });
    console.log('🔐 Auth info:', authInfo);

    if (!doctorId || !date || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!userMongoId) {
      return res.status(400).json({ error: 'Invalid or unregistered user (clerkId not linked)' });
    }

    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ error: 'Invalid doctorId format' });
    }

    if (!isValidObjectId(userMongoId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    // verify doctor exists
    const doctorExists = await Doctor.findById(doctorId).select('_id').lean();
    if (!doctorExists) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Build appointment
    const appointment = new Appointment({
      doctorId,
      userId: userMongoId,
      date,
      type,
      notes,
      status: 'pending',
    });

    // Log appointment payload to diagnose schema issues
    try {
      console.log('Saving appointment object:', appointment.toObject ? appointment.toObject() : appointment);
    } catch (e) {
      console.warn('Could not convert appointment to object for logging', e);
    }

    await appointment.save();
    return res.status(201).json(appointment);
  } catch (err) {
    // Detailed logging for debugging; remove details in production
    console.error('❌ Appointment creation error (full):', err);
    if (err && err.stack) console.error(err.stack);

    // If mongoose validation error, expose message
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((e) => e.message).join('; ');
      return res.status(400).json({ error: 'Validation failed', details: messages });
    }

    return res.status(500).json({ error: 'Failed to create appointment', details: err.message || String(err) });
  }
};

// Get Appointments for Current User (GET /api/appointments/mine)
exports.getAppointmentsForUser = async (req, res) => {
  try {
    const authInfo = typeof req.auth === 'function' ? req.auth() : req.user || {};
    const userMongoId = await resolveClerkToMongoId(authInfo);
    if (!userMongoId) return res.status(401).json({ error: 'Unauthorized: Missing userId' });

    if (!isValidObjectId(userMongoId)) return res.status(400).json({ error: 'Invalid userId' });

    const appointments = await Appointment.find({ userId: userMongoId }).populate('doctorId');
    console.log('📋 User appointments:', appointments.length);
    return res.status(200).json(appointments);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch appointments', details: err.message });
  }
};

// Get All Appointments for current user (alias GET /api/appointments)
exports.getAppointments = async (req, res) => {
  try {
    const authInfo = typeof req.auth === 'function' ? req.auth() : req.user || {};
    const userMongoId = await resolveClerkToMongoId(authInfo);
    if (!userMongoId) return res.status(401).json({ error: 'Unauthorized: Missing userId' });

    if (!isValidObjectId(userMongoId)) return res.status(400).json({ error: 'Invalid userId' });

    const appointments = await Appointment.find({ userId: userMongoId }).populate('doctorId');
    return res.status(200).json(appointments);
  } catch (err) {
    console.error('❌ Error fetching appointments:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Update Appointment Status (PATCH /api/appointments/:id/status)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid appointment id' });
    }

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Appointment not found' });

    console.log('🔄 Status updated:', { id, status });
    return res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Status update error:', err);
    return res.status(500).json({ error: 'Failed to update appointment status', details: err.message });
  }
};

// Delete Appointment (DELETE /api/appointments/:id)
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid appointment id' });
    }

    const deleted = await Appointment.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Appointment not found' });

    console.log('🗑️ Appointment deleted:', id);
    return res.status(200).json({ message: 'Appointment deleted' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    return res.status(500).json({ error: 'Failed to delete appointment', details: err.message });
  }
};

// Get Appointments for Logged-in Doctor (GET /api/appointments/doctor)
exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    const authInfo = typeof req.auth === 'function' ? req.auth() : req.user || {};
    const clerkId = authInfo.userId || authInfo.clerkId || authInfo.id;
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized: Missing clerkId' });

    const doctor = await Doctor.findOne({ clerkId }).select('_id');
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id }).populate('userId');
    return res.status(200).json(appointments);
  } catch (err) {
    console.error('Error fetching doctor appointments:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get Appointments by Patient ID (GET /api/appointments/patient/:id) - admin use
exports.getAppointmentsByPatient = async (req, res) => {
  try {
    const { id: patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ error: 'Missing patient ID' });
    }

    if (!isValidObjectId(patientId)) {
      return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    const appointments = await Appointment.find({ userId: patientId }).populate('doctorId');
    console.log('📋 Admin view of patient appointments:', appointments.length);
    return res.status(200).json(appointments);
  } catch (err) {
    console.error('❌ Error fetching appointments by patient:', err);
    return res.status(500).json({ error: 'Failed to fetch appointments', details: err.message });
  }
};
