// seedDoctors.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Doctor } = require('./admin.js/doctor');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleDoctors = [
  {
    userId: new mongoose.Types.ObjectId("691c07c1b86bf29748a37e34"),
    name: 'Dr. Ayo Balogun',
    specialty: 'Cardiology',
    rating: 4.8,
    location: 'Lagos',
    available: true,
    bio: 'Experienced cardiologist with 15 years in patient care.',
    contactInfo: { email: 'ayo.balogun@example.com', phone: '+2348012345678' },
    yearsOfExperience: 15,
  },
  {
    userId: new mongoose.Types.ObjectId("691c0859b86bf29748a37e3b"),
    name: 'Dr. Ngozi Okafor',
    specialty: 'Dermatology',
    rating: 4.5,
    location: 'Abuja',
    available: true,
    bio: 'Skin care expert with a passion for holistic treatment.',
    contactInfo: { email: 'ngozi.okafor@example.com', phone: '+2348098765432' },
    yearsOfExperience: 10,
  },
  {
    userId: new mongoose.Types.ObjectId("691c08aab86bf29748a37e42"),
    name: 'Dr. Musa Ibrahim',
    specialty: 'Pediatrics',
    rating: 4.7,
    location: 'Kano',
    available: true,
    bio: 'Dedicated pediatrician focused on child wellness and development.',
    contactInfo: { email: 'musa.ibrahim@example.com', phone: '+2348076543210' },
    yearsOfExperience: 12,
  },
];

Doctor.insertMany(sampleDoctors)
  .then(() => {
    console.log('✅ Doctors seeded successfully');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Seeding error:', err);
    mongoose.disconnect();
  });
