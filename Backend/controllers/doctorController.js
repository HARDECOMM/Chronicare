const Doctor = require('../models/doctor');

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Server error' });
  }
};