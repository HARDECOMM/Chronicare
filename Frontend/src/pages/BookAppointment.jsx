// src/pages/BookAppointment.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchDoctorById, createAppointment } from '../Apis/createAppointmnet';

export function BookAppointment() {
  const { doctorId } = useParams(); // Get doctorId from the route URL
  const navigate = useNavigate(); // For redirecting after booking

  // Local state for form inputs and feedback
  const [doctor, setDoctor] = useState(null); // Doctor data
  const [date, setDate] = useState(''); // Appointment date/time
  const [type, setType] = useState('virtual'); // Appointment type
  const [notes, setNotes] = useState(''); // Optional notes
  const [error, setError] = useState(''); // Error message

  // Load doctor details when component mounts or doctorId changes
  useEffect(() => {
    async function loadDoctor() {
      try {
        const doctorData = await fetchDoctorById(doctorId);
        setDoctor(doctorData); // Set doctor info
      } catch {
        setError('Doctor not found'); // Show error if fetch fails
      }
    }
    loadDoctor();
  }, [doctorId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      await createAppointment({
        doctorId,
        date,
        type,
        notes,
        userId: 'demo-user-id', // 🔐 Replace with Clerk user ID when auth is added
      });
      navigate('/appointments'); // Redirect to appointments page after success
    } catch {
      setError('Failed to book appointment'); // Show error if booking fails
    }
  };

  // Show loading state while doctor data is being fetched
  if (!doctor) return <p className="text-center mt-10">Loading doctor info...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 px-6 py-8 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Book Appointment with {doctor.name}
      </h2>

      {/* Show error message if any */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Appointment form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Date & Time</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="virtual">Virtual</option>
            <option value="in-person">In-Person</option>
          </select>
        </div>

        <div>
          <label>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Confirm Appointment
        </button>
      </form>
    </div>
  );
}
