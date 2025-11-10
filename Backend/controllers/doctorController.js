const { Doctor } = require('../models/doctor'); // ✅ Destructure the model

// READ ALL DOCTOR 
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ DOCTOR BY ID (accept appointment by ID)
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (err) {
    console.error('Error fetching doctor by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
