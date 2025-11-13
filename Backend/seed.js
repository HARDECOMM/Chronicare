// seedAppointments.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Appointment } = require('./models/appointment');
const { Doctor } = require('./models/doctor');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

// ✅ Use your actual Clerk user ID
const clerkUserId = 'user_35I3IEccjoTAAHX75MCRWCdIsHP';

async function seedAppointments() {
  try {
    const doctors = await Doctor.find().limit(3);

    if (doctors.length === 0) {
      console.error('❌ No doctors found. Seed doctors first.');
      return mongoose.disconnect();
    }

    const sampleAppointments = [
      {
        userId: clerkUserId,
        doctorId: doctors[0]._id,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        type: 'virtual',
        notes: 'Follow-up on blood pressure',
        status: 'pending',
      },
      {
        userId: clerkUserId,
        doctorId: doctors[1]._id,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        type: 'in-person',
        notes: 'Skin rash consultation',
        status: 'confirmed',
      },
      {
        userId: clerkUserId,
        doctorId: doctors[2]._id,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        type: 'virtual',
        notes: 'Child wellness check',
        status: 'cancelled',
      },
    ];

    await Appointment.insertMany(sampleAppointments);
    console.log('✅ Clerk appointments seeded');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedAppointments();
