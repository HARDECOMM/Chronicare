// Backend/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("./models/user");
const { Doctor } = require("./models/doctor");
const { Patient } = require("./models/patient");
const { Appointment } = require("./models/appointment");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});

    // Create sample users
    const patientUser = await User.create({
      clerkId: "patient123",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "patient",
    });

    const doctorUser = await User.create({
      clerkId: "doctor123",
      name: "Dr. John Smith",
      email: "john@example.com",
      role: "doctor",
    });

    const adminUser = await User.create({
      clerkId: "admin123",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
    });

    // Create sample patient profile with new schema fields
    const patient = await Patient.create({
      userId: patientUser._id,
      dateOfBirth: new Date("1995-06-15"),
      gender: "female",
      contactInfo: {
        phone: "08012345678",
        address: "Lekki Phase 1, Lagos",
      },
      medicalHistory: ["Asthma", "Diabetes"],
      allergies: ["Peanuts", "Dust"],
      emergencyContact: {
        name: "Michael Doe",
        phone: "08098765432",
        relation: "Brother",
      },
    });

    // Create sample doctors
    const doctor1 = await Doctor.create({
      clerkId: "doctor123",
      name: "Dr. John Smith",
      specialty: "Cardiology",
      licenseNumber: "LIC123",
      location: "Lagos",
      bio: "Experienced cardiologist with 10 years in practice.",
      contactInfo: { phone: "08098765432", email: "john@example.com", address: "Victoria Island" },
      yearsOfExperience: 10,
      languagesSpoken: ["English", "Yoruba"],
    });

    const doctor2 = await Doctor.create({
      clerkId: "doctor456",
      name: "Dr. Mary Johnson",
      specialty: "Dermatology",
      licenseNumber: "LIC456",
      location: "Abuja",
      bio: "Dermatologist specializing in skin conditions.",
      contactInfo: { phone: "08123456789", email: "mary@example.com", address: "Wuse II" },
      yearsOfExperience: 8,
      languagesSpoken: ["English", "Hausa"],
    });

    // models/appointment.js
const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  reason: { type: String },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"], // ✅ added "confirmed"
    default: "pending",
  },
}, { timestamps: true });



    console.log("✅ Seed data created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
}

seed();
