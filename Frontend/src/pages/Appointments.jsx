import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'; // 🔔 Toast notifications

export function Appointments() {
  // 🔧 State variables
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null); // Track which appointment is being updated
  const [filterStatus, setFilterStatus] = useState(''); // 🎛️ Track selected status filter
  const [dateFilter, setDateFilter] = useState('all'); // 🗓️ Track selected date filter
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 Track doctor name search
  const [page, setPage] = useState(1); // 📄 Current page
  const pageSize = 2; // 🔢 Appointments per page

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
    setUpdatingId(id); // ⏳ Show loading state for this appointment
    try {
      await axios.patch(`http://localhost:5000/api/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status} successfully`); // ✅ Show success toast
      await loadAppointments(); // 🔄 Refresh list
    } catch {
      toast.error('Failed to update appointment'); // ❌ Show error toast
      setError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  // 🧠 Filter appointments based on status, date, and doctor name
  const now = new Date();
  const filteredAppointments = appointments.filter((appt) => {
    const matchStatus = filterStatus ? appt.status === filterStatus : true;
    const matchDate =
      dateFilter === 'upcoming'
        ? new Date(appt.date) >= now
        : dateFilter === 'past'
        ? new Date(appt.date) < now
        : true;
    const matchSearch = searchTerm
      ? appt.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchStatus && matchDate && matchSearch;
  });

  // 🧮 Slice appointments for current page
  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // ⏳ Loading state
  if (loading) return <p className="text-center mt-10">Loading appointments...</p>;

  // ❌ Error state
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  // 📭 Empty state
  if (filteredAppointments.length === 0) return <p className="text-center mt-10">No appointments found.</p>;

  // ✅ Render appointment list
  return (
    <div className="max-w-2xl mx-auto mt-10 px-6">
      <Toaster position="top-right" /> {/* 🔔 Toast container */}
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>

      {/* 🔍 Search input */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Search by doctor:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // 🔄 Reset to first page when search changes
          }}
          placeholder="Enter doctor name"
          className="border px-3 py-1 rounded w-full max-w-sm"
        />
      </div>

      {/* 🎛️ Filter controls */}
      <div className="mb-6 flex gap-6 items-center">
        {/* Status Filter */}
        <div>
          <label className="mr-2 font-medium">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1); // 🔄 Reset to first page when filter changes
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="mr-2 font-medium">Filter by date:</label>
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1); // 🔄 Reset to first page when filter changes
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* 📋 Appointment cards */}
      <ul className="space-y-4">
        {paginatedAppointments.map((appt) => (
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

      {/* 📄 Pagination controls */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm font-medium">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * pageSize >= filteredAppointments.length}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
