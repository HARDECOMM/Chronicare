const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: null, // role will be set after login
  },
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
