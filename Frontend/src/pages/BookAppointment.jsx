import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { AppointmentsAPI } from '../api/AppointmentsAPI';
import { AppointmentCard } from '../components/UI/AppointmentCard';
import { toast } from 'react-hot-toast';

export function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const token = await getToken();
        const doctor = await AppointmentsAPI.getDoctor(doctorId, token);
        setDoctor(doctor);
      } catch (err) {
        console.error('❌ Failed to load doctor:', err);
        toast.error('Doctor not found');
      }
    }
    fetchDoctor();
  }, [doctorId, getToken]);

  useEffect(() => {
    loadAppointments();
  }, [getToken]);

  async function loadAppointments() {
    try {
      const token = await getToken();
      const data = await AppointmentsAPI.listMine(token);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Failed to load appointments:', err);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const response = await AppointmentsAPI.create(
        { doctorId, date, type, notes },
        token
      );

      if (response && response._id) {
        toast.success('Appointment booked successfully');
        await loadAppointments();
        setTimeout(() => navigate('/appointments'), 1000);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('❌ Booking failed:', err.response?.data || err.message);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      const token = await getToken();
      const updated = await AppointmentsAPI.updateStatus(id, status, token);
      toast.success(`Appointment ${status}`);
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? updated : appt))
      );
    } catch (err) {
      console.error(`❌ Failed to ${status} appointment:`, err.message);
      toast.error(`Failed to ${status} appointment`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const token = await getToken();
      await AppointmentsAPI.remove(id, token);
      toast.success('Appointment deleted');
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (err) {
      console.error('❌ Delete failed:', err.message);
      toast.error('Failed to delete appointment');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-xl font-bold mb-4">
        Book Appointment with {doctor?.name || 'Doctor'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select appointment type</option>
          <option value="virtual">virtual</option>
          <option value="in-person">in person</option>
          <option value="home visit">home visit</option>
        </select>

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">Your Existing Appointments</h3>
      {loadingAppointments ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appt={appt}
              updatingId={updatingId}
              onConfirm={(id) => handleStatusUpdate(id, 'confirmed')}
              onCancel={(id) => handleStatusUpdate(id, 'cancelled')}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
