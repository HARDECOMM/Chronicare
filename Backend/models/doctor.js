const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  rating: { type: Number, default: 0 },
  location: { type: String },
  available: { type: Boolean, default: true },
  bio: { type: String },
});

module.exports = mongoose.model('Doctor', doctorSchema);
