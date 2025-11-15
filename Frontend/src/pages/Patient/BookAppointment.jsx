// src/pages/Patient/BookAppointment.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { appointmentsAPI } from '../../api/appointmentsAPI';
import { AppointmentCard } from '../../components/UI/AppointmentCard';
import { toast } from 'react-hot-toast';

export function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [type, setType] = useState('virtual'); // default to avoid empty required
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchDoctor() {
      try {
        const token = await getToken();
        console.log('Requesting doctor id:', doctorId);
        const d = await appointmentsAPI.getDoctor(doctorId, token);
        console.log('fetched doctor', d);
        if (mounted) setDoctor(d);
      } catch (err) {
        console.error('❌ Failed to load doctor:', err, 'requested id:', doctorId);
        const status = err?.response?.status;
        if (status === 404) {
          toast.error('Doctor not found. It may have been removed.');
          // optional: navigate('/doctors');
        } else {
          toast.error('Failed to load doctor profile');
        }
      }
    }
    if (doctorId) fetchDoctor();
    return () => { mounted = false; };
  }, [doctorId, getToken]);



  async function loadAppointments() {
    setLoadingAppointments(true);
    try {
      const token = await getToken();
      const data = await appointmentsAPI.listMine(token);
      setAppointments(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error('❌ Failed to load appointments:', err);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called', { doctorId, date, type, notes, doctor });
    setLoading(true);

    try {
      // basic client validation
      if (!date) {
        toast.error('Please choose a date and time');
        setLoading(false);
        return;
      }
      if (!type) {
        toast.error('Please choose appointment type');
        setLoading(false);
        return;
      }

      const token = await getToken();
      const payload = {
        // prefer the fetched doctor's _id (Mongo id)
        doctorId: doctor?._id || doctorId,
        date,
        type,
        notes,
      };
      console.log('sending payload', payload);

      const response = await appointmentsAPI.create(payload, token);
      console.log('booking response', response);

      if (response && response._id) {
        toast.success('Appointment booked successfully');
        await loadAppointments();
        setTimeout(() => navigate('/appointments'), 800);
      } else {
        console.error('Unexpected create response', response);
        toast.error(response?.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('❌ Booking failed full error:', err);
      console.error('err.response', err.response);
      console.error('err.response.data', err.response?.data);
      const serverMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      toast.error(serverMessage || 'Failed to book — see console/network for details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      const token = await getToken();
      const updated = await appointmentsAPI.updateStatus(id, status, token);
      toast.success(`Appointment ${status}`);
      setAppointments((prev) => prev.map((appt) => (appt._id === id ? updated : appt)));
    } catch (err) {
      console.error(`❌ Failed to ${status} appointment:`, err);
      toast.error(`Failed to ${status} appointment`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const token = await getToken();
      await appointmentsAPI.remove(id, token);
      toast.success('Appointment deleted');
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (err) {
      console.error('❌ Delete failed:', err);
      // show backend message if available
      const serverMsg = err?.response?.data?.error || err?.message;
      toast.error(serverMsg || 'Failed to delete appointment');
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
          <option value="virtual">Virtual</option>
          <option value="in-person">In person</option>
          <option value="home-visit">Home visit</option>
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
          className={`px-4 py-2 rounded text-white ${!loading ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
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
