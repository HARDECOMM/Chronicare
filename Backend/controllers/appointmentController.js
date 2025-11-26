// ==========================================
//          Appointment Controller
// ==========================================

// Imports
const mongoose = require("mongoose");
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");

// ==========================================
// 📌 Patient books appointment
// POST /api/appointments
// ==========================================
exports.create = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth(); // Clerk patient ID

    const {
      doctorId,
      date,
      time,
      reason,
      patientName,
      patientId,
      isRecurring,
      recurrencePattern,
      recurrenceCount,
    } = req.body;

    if (!doctorId || !date || !time) {
      return res
        .status(400)
        .json({ error: "doctorId, date, and time are required" });
    }

    const startDate = new Date(`${date}T${time}`);
    let appointments = [];

    // Create first appointment
    const firstAppt = await Appointment.create({
      doctorId,
      patientId: patientId || null,
      patientClerkId: clerkId,
      patientName: patientName || "",
      reason: reason || "Not specified",
      date: startDate,
      status: "pending",
      isRecurring: !!isRecurring,
      recurrencePattern: recurrencePattern || "none",
      recurrenceCount: recurrenceCount || 1,
    });

    appointments.push(firstAppt);

    // Recurring appointments
    if (
      isRecurring &&
      recurrencePattern !== "none" &&
      recurrenceCount > 1
    ) {
      let currentDate = new Date(startDate);

      for (let i = 1; i < recurrenceCount; i++) {
        if (recurrencePattern === "daily")
          currentDate.setDate(currentDate.getDate() + 1);

        if (recurrencePattern === "weekly")
          currentDate.setDate(currentDate.getDate() + 7);

        if (recurrencePattern === "monthly")
          currentDate.setMonth(currentDate.getMonth() + 1);

        const appt = await Appointment.create({
          doctorId,
          patientId: patientId || null,
          patientClerkId: clerkId,
          patientName,
          reason,
          date: new Date(currentDate),
          status: "pending",
          isRecurring: true,
          recurrencePattern,
          recurrenceCount,
        });

        appointments.push(appt);
      }
    }

    res.status(201).json(appointments);
  } catch (err) {
    console.error("❌ Error creating appointment:", err);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

// ==========================================
// 📌 Patient lists own appointments
// GET /api/appointments/patient
// ==========================================
exports.listForPatient = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();

    const appts = await Appointment.find({
      patientClerkId: clerkId,
      status: { $ne: "canceled" },
    })
      .populate("doctorId", "name specialty")
      .sort({ date: 1 });

    res.json({ appointments: appts });
  } catch (err) {
    console.error("❌ Error listing patient appointments:", err);
    res.status(500).json({ error: "Failed to load appointments" });
  }
};

// ==========================================
// 📌 Doctor lists own appointments
// GET /api/appointments/doctor
// ==========================================
exports.listForDoctor = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();

    const doctor = await Doctor.findOne({ clerkId });
    if (!doctor)
      return res.status(404).json({ error: "Doctor profile not found" });

    const appts = await Appointment.find({
      doctorId: doctor._id,
      status: { $ne: "canceled" },
    })
      .populate("patientId", "name")
      .sort({ date: 1 });

    res.json({ appointments: appts });
  } catch (err) {
    console.error("❌ Error listing doctor appointments:", err);
    res.status(500).json({ error: "Failed to load appointments" });
  }
};

// ==========================================
// 📌 Doctor confirms appointment
// PATCH /api/appointments/:id/status/confirm
// ==========================================
exports.confirm = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();

    const doctor = await Doctor.findOne({ clerkId });
    if (!doctor)
      return res.status(404).json({ error: "Doctor profile not found" });

    const { id } = req.params;

    const appt = await Appointment.findOneAndUpdate(
      { _id: id, doctorId: doctor._id },
      { $set: { status: "confirmed" } },
      { new: true }
    );

    if (!appt)
      return res.status(404).json({ error: "Appointment not found" });

    res.json(appt);
  } catch (err) {
    console.error("❌ Error confirming appointment:", err);
    res.status(500).json({ error: "Failed to confirm appointment" });
  }
};

// ==========================================
// 📌 Doctor cancels appointment
// PATCH /api/appointments/:id/status/cancel/doctor
// ==========================================
exports.cancelByDoctor = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();

    const doctor = await Doctor.findOne({ clerkId });
    if (!doctor)
      return res.status(404).json({ error: "Doctor profile not found" });

    const { id } = req.params;

    const appt = await Appointment.findOneAndUpdate(
      { _id: id, doctorId: doctor._id },
      { $set: { status: "canceled" } },
      { new: true }
    );

    if (!appt)
      return res.status(404).json({ error: "Appointment not found" });

    res.json(appt);
  } catch (err) {
    console.error("❌ Error canceling appointment by doctor:", err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
};

// ==========================================
// 📌 Patient cancels appointment
// PATCH /api/appointments/:id/status/cancel/patient
// ==========================================
exports.cancelByPatient = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();

    const patient = await Patient.findOne({ clerkId });
    if (!patient)
      return res.status(404).json({ error: "Patient profile not found" });

    const { id } = req.params;

    const appt = await Appointment.findOneAndUpdate(
      { _id: id, patientClerkId: clerkId },
      { $set: { status: "canceled" } },
      { new: true }
    );

    if (!appt)
      return res.status(404).json({ error: "Appointment not found" });

    res.json(appt);
  } catch (err) {
    console.error("❌ Error canceling appointment by patient:", err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
};

// ==========================================
// 📌 Add note
// PATCH /api/appointments/:id/notes
// ==========================================
exports.addNote = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();

    const { id } = req.params;
    const { message, authorType } = req.body;

    if (!message || !authorType) {
      return res
        .status(400)
        .json({ error: "message and authorType are required" });
    }

    if (!["doctor", "patient"].includes(authorType)) {
      return res.status(400).json({ error: "Invalid authorType" });
    }

    const appt = await Appointment.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          notes: {
            authorType,
            authorId: clerkId,
            message,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!appt)
      return res.status(404).json({ error: "Appointment not found" });

    res.json(appt);
  } catch (err) {
    console.error("❌ Error adding note:", err);
    res.status(500).json({ error: "Failed to add note" });
  }
};

// ==========================================
// 📌 Update note
// PATCH /api/appointments/:appointmentId/notes/:noteId
// ==========================================
exports.updateNote = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();

    const { appointmentId, noteId } = req.params;
    const { message } = req.body;

    if (!message)
      return res.status(400).json({ error: "message is required" });

    const appt = await Appointment.findOneAndUpdate(
      { _id: appointmentId, "notes._id": noteId },
      {
        $set: {
          "notes.$.message": message,
          "notes.$.updatedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!appt)
      return res
        .status(404)
        .json({ error: "Appointment or note not found" });

    res.json(appt);
  } catch (err) {
    console.error("❌ Error updating note:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
};

// ==========================================
// 📌 Delete note
// DELETE /api/appointments/:appointmentId/notes/:noteId
// ==========================================
exports.deleteNote = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth(); // ✅ added missing auth

    const { appointmentId, noteId } = req.params;

    const appt = await Appointment.findOneAndUpdate(
      { _id: appointmentId },
      {
        $pull: {
          notes: { _id: new mongoose.Types.ObjectId(noteId) },
        },
      },
      { new: true }
    );

    if (!appt)
      return res
        .status(404)
        .json({ error: "Appointment or note not found" });

    res.json(appt);
  } catch (err) {
    console.error("❌ Error deleting note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
};
