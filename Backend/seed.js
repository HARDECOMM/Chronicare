// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const { Doctor } = require('./models/doctor');

// dotenv.config();
// mongoose.connect(process.env.MONGO_URI);

// const sampleDoctors = [
//   {
//     name: 'Dr. Ayo Balogun',
//     specialty: 'Cardiology',
//     rating: 4.8,
//     location: 'Lagos',
//     available: true,
//     bio: 'Experienced cardiologist with 15 years in patient care.',
//   },
//   {
//     name: 'Dr. Ngozi Okafor',
//     specialty: 'Dermatology',
//     rating: 4.5,
//     location: 'Abuja',
//     available: true,
//     bio: 'Skin care expert with a passion for holistic treatment.',
//   },
//   {
//     name: 'Dr. Musa Ibrahim',
//     specialty: 'Pediatrics',
//     rating: 4.7,
//     location: 'Kano',
//     available: true,
//     bio: 'Dedicated pediatrician focused on child wellness and development.',
//   },
// ];

// Doctor.insertMany(sampleDoctors)
//   .then(() => {
//     console.log('✅ Doctors seeded');
//     mongoose.disconnect();
//   })
//   .catch((err) => {
//     console.error('❌ Seeding error:', err);
//     mongoose.disconnect();
//   });
