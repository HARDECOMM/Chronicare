const { Appointment } = require('../models/appointment');

// ✅ Create Appointment (POST /api/appointments)
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, type, notes } = req.body;
    const { userId } = req.auth();

    console.log('📥 Incoming appointment:', { doctorId, date, type, notes });
    console.log('🔐 Authenticated user:', userId);

    if (!doctorId || !date || !type || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const appointment = new Appointment({
      doctorId,
      userId,
      date,
      type,
      notes,
      status: 'pending',
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    console.error('❌ Appointment creation error:', err.message);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

// ✅ Get Appointments for Current User (GET /api/appointments/mine)
exports.getAppointmentsForUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ error: 'Unauthorized: Missing userId' });

    const appointments = await Appointment.find({ userId }).populate('doctorId');
    console.log('📋 User appointments:', appointments.length);
    res.status(200).json(appointments);
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// ✅ Get All Appointments (GET /api/appointments)
exports.getAppointments = async (req, res) => {
  try {
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ error: 'Unauthorized: Missing userId' });

    const appointments = await Appointment.find({ userId }).populate('doctorId');
    res.status(200).json(appointments);
  } catch (err) {
    console.error('❌ Error fetching appointments:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Update Appointment Status (PATCH /api/appointments/:id/status)
exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    console.log('🔄 Status updated:', { id, status });
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Status update error:', err.message);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
};

// ✅ Delete Appointment (DELETE /api/appointments/:id)
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    await Appointment.findByIdAndDelete(id);
    console.log('🗑️ Appointment deleted:', id);
    res.status(200).json({ message: 'Appointment deleted' });
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};

// ✅ Get Appointments for Logged-in Doctor (GET /api/appointments/doctor)
exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized: Missing doctorId' });

    // 🔍 If you store doctors separately, map clerkId to doctorId first
    const appointments = await Appointment.find({ doctorId: clerkId }).populate('userId');
    console.log('📋 Doctor appointments:', appointments.length);
    res.status(200).json(appointments);
  } catch (err) {
    console.error('❌ Error fetching doctor appointments:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get Appointments by Patient ID (GET /api/appointments/patient/:id)
exports.getAppointmentsByPatient = async (req, res) => {
  const { id: patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ error: 'Missing patient ID' });
  }

  try {
    const appointments = await Appointment.find({ userId: patientId }).populate('doctorId');
    console.log('📋 Admin view of patient appointments:', appointments.length);
    res.status(200).json(appointments);
  } catch (err) {
    console.error('❌ Error fetching appointments by patient:', err.message);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};
