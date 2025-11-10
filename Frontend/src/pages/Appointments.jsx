import { useEffect, useState } from 'react';
import axios from 'axios';

export function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔄 Fetch appointments from backend
  useEffect(() => {
    loadAppointments();
  }, []);

  // 📦 Load appointments for the current user
  async function loadAppointments() {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments', {
        params: { userId: 'demo-user-123' },
      });
      setAppointments(response.data);
    } catch {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }

  // 🔧 Update appointment status (confirm or cancel)
  async function updateStatus(id, status) {
    try {
      await axios.patch(`http://localhost:5000/api/appointments/${id}/status`, { status });
      await loadAppointments(); // Refresh list after update
    } catch {
      setError('Failed to update status');
    }
  }

  if (loading) return <p className="text-center mt-10">Loading appointments...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (appointments.length === 0) return <p className="text-center mt-10">No appointments yet.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-6">
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>

      {/* 📋 Render each appointment */}
      <ul className="space-y-4">
        {appointments.map((appt) => (
          <li key={appt._id} className="border rounded p-4 shadow-sm">
            <h3 className="font-semibold text-lg">{appt.doctorId?.name}</h3>
            <p className="text-sm text-gray-600">{appt.doctorId?.specialty}</p>
            <p className="mt-2">
              <strong>Date:</strong> {new Date(appt.date).toLocaleString()}
            </p>
            <p>
              <strong>Type:</strong> {appt.type}
            </p>
            <p>
              <strong>Status:</strong> <span className="capitalize">{appt.status}</span>
            </p>
            {appt.notes && <p className="mt-1 text-sm text-gray-700">📝 {appt.notes}</p>}

            {/* ✅ Show status update buttons if appointment is still pending */}
            {appt.status === 'pending' && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => updateStatus(appt._id, 'confirmed')}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateStatus(appt._id, 'cancelled')}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
