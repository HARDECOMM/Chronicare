const { Appointment } = require('../models/appointment');

// Create Appointment (POST)
exports.createAppointment = async (req, res) => {
  let { doctorId, userId, date, type, notes, status } = req.body || {};

  // 🔐 TEMPORARY: Use demo user ID if none is provided
  // TODO: Replace this with Clerk user ID when authentication is added
  if (!userId) {
    userId = 'demo-user-123';
  }

  if (!doctorId || !userId || !date || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const appointment = new Appointment({ doctorId, userId, date, type, notes });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    console.error('Appointment creation error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Read Appointment (GET)
exports.getAppointments = async (req, res) => {
  let { userId } = req.query;

  // 🔐 TEMPORARY: Use demo user ID if none is provided
  // TODO: Replace this with Clerk user ID when authentication is added
  if (!userId) {
    userId = 'demo-user-123';
  }

  try {
    const appointments = await Appointment.find({ userId }).populate('doctorId');
    res.status(200).json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// update Appointment Status
// controllers/appointments.js
exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};