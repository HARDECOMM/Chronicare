import { useEffect, useState } from 'react';
import axios from 'axios';

export function Appointments() {
  // 🔧 State variables
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null); // Track which appointment is being updated
  const [filterStatus, setFilterStatus] = useState(''); // 🎛️ Track selected status filter

  // 📦 Load appointments on mount
  useEffect(() => {
    loadAppointments();
  }, []);

  // 🔄 Fetch appointments from backend
  async function loadAppointments() {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments', {
        params: { userId: 'demo-user-123' }, // 🔐 Replace with real user ID later
      });
      setAppointments(response.data);
    } catch {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }

  // 🔧 Update appointment status and refresh list
  async function handleStatusUpdate(id, status) {
    setUpdatingId(id); // Show loading state for this appointment
    try {
      await axios.patch(`http://localhost:5000/api/appointments/${id}/status`, { status });
      await loadAppointments(); // Refresh list
    } catch {
      setError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  // 🧠 Filter appointments based on selected status
  const filteredAppointments = filterStatus
    ? appointments.filter((appt) => appt.status === filterStatus)
    : appointments;

  // ⏳ Loading state
  if (loading) return <p className="text-center mt-10">Loading appointments...</p>;

  // ❌ Error state
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  // 📭 Empty state
  if (filteredAppointments.length === 0) return <p className="text-center mt-10">No appointments found.</p>;

  // ✅ Render appointment list
  return (
    <div className="max-w-2xl mx-auto mt-10 px-6">
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>

      {/* 🎛️ Filter dropdown */}
      <div className="mb-6">
        <label className="mr-2 font-medium">Filter by status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* 📋 Appointment cards */}
      <ul className="space-y-4">
        {filteredAppointments.map((appt) => (
          <li key={appt._id} className="border rounded p-4 shadow-sm">
            {/* 👨‍⚕️ Doctor info */}
            <h3 className="font-semibold text-lg">{appt.doctorId?.name}</h3>
            <p className="text-sm text-gray-600">{appt.doctorId?.specialty}</p>

            {/* 📅 Appointment details */}
            <p className="mt-2">
              <strong>Date:</strong> {new Date(appt.date).toLocaleString()}
            </p>
            <p>
              <strong>Type:</strong> {appt.type}
            </p>

            {/* 🎨 Status with color */}
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`capitalize font-semibold ${
                  appt.status === 'confirmed'
                    ? 'text-green-600'
                    : appt.status === 'cancelled'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {appt.status}
              </span>
            </p>

            {/* 📝 Optional notes */}
            {appt.notes && <p className="mt-1 text-sm text-gray-700">📝 {appt.notes}</p>}

            {/* ✅ Action buttons for pending appointments */}
            {appt.status === 'pending' && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(appt._id, 'confirmed')}
                  disabled={updatingId === appt._id}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
                  disabled={updatingId === appt._id}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
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
