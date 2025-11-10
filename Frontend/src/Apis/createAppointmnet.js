// src/api/appointments.js
import axios from 'axios';

// ✅ Fetch doctor details by ID (used in BookAppointment page)
export async function fetchDoctorById(doctorId) {
  try {
    const response = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching doctor:', err.message);
    throw err;
  }
}

// ✅ Create a new appointment
export async function createAppointment({ doctorId, date, type, notes }) {
  try {
    // 🔐 TEMPORARY: Using demo user ID until Clerk is integrated
    const userId = 'demo-user-123'; // TODO: Replace with Clerk user ID when auth is added

    await axios.post('http://localhost:5000/api/appointments', {
      doctorId,
      date,
      type,
      notes,
      userId,
      status: 'pending',
    });
  } catch (err) {
    console.error('Error creating appointment:', err.message);
    throw err;
  }
}
