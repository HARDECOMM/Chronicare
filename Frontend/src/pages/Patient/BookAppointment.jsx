
// src/pages/Patient/BookAppointment.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { appointmentsAPI } from '../../api/appointmentsAPI';
import { AppointmentCard } from '../../components/UI/AppointmentCard';
import { toast } from 'react-hot-toast';

/**
 * BookAppointment page
 * - Loads doctor profile for the given doctorId
 * - Lets the signed-in patient create an appointment
 * - Shows the patient's existing appointments
 * - After a successful booking, dispatches a global event so doctor panels listening
 *   for "appointment:created" can refetch immediately (non-invasive, additive).
 */
export function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  // doctor profile loaded from API (if available)
  const [doctor, setDoctor] = useState(null);

  // form fields
  const [date, setDate] = useState(''); // ISO-like string from <input type="datetime-local">
  const [type, setType] = useState('virtual'); // default avoids empty required value
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // patient's appointment list UI state
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch doctor profile when page mounts or doctorId changes
  useEffect(() => {
    let mounted = true;
    async function fetchDoctor() {
      try {
        const token = await getToken();
        console.log('Requesting doctor id:', doctorId);
        const d = await appointmentsAPI.getDoctor(doctorId, token); // expected to return doctor object
        console.log('fetched doctor', d);
        if (mounted) setDoctor(d);
      } catch (err) {
        console.error('❌ Failed to load doctor:', err, 'requested id:', doctorId);
        const status = err?.response?.status;
        if (status === 404) {
          toast.error('Doctor not found. It may have been removed.');
          // optional navigation: navigate('/doctors');
        } else {
          toast.error('Failed to load doctor profile');
        }
      }
    }
    if (doctorId) fetchDoctor();
    return () => { mounted = false; };
  }, [doctorId, getToken]);

  // Load the patient's own appointments (for this user)
  async function loadAppointments() {
    setLoadingAppointments(true);
    try {
      const token = await getToken();
      const data = await appointmentsAPI.listMine(token);
      // Support multiple shapes: array or { data: [...] }
      setAppointments(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error('❌ Failed to load appointments:', err);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  }

  // Load appointments once on mount
  useEffect(() => {
    loadAppointments();
    // no cleanup; simple one-time load on mount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Submit handler: create appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called', { doctorId, date, type, notes, doctor });
    setLoading(true);

    try {
      // Basic client-side validation
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
        // prefer the fetched doctor's DB _id if available; fall back to route param
        doctorId: doctor?._id || doctorId,
        // use `date` as submitted; backend may expect `time` or `date` — match your API
        date,
        type,
        notes,
      };
      console.log('sending payload', payload);

      // Create appointment on server
      const response = await appointmentsAPI.create(payload, token);
      console.log('booking response', response);

      // Expect created appointment object with _id
      if (response && response._id) {
        toast.success('Appointment booked successfully');

        // 1) Refresh this patient's appointments list immediately
        await loadAppointments();

        // 2) Notify any doctor-side components (or other tabs) to refetch immediately
        //    This is an additive global event that doctor panels listen for.
        //    It avoids tight coupling and requires no prop drilling.
        try {
          window.dispatchEvent(new Event('appointment:created'));
        } catch (e) {
          // fail silently if dispatch is not supported in some envs
          console.warn('Could not dispatch appointment:created event', e);
        }

        // 3) Navigate to patient's appointments page after a short delay so toast is visible
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

  // Update appointment status (used for patient's local actions)
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

  // Delete appointment with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const token = await getToken();
      await appointmentsAPI.remove(id, token);
      toast.success('Appointment deleted');
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (err) {
      console.error('❌ Delete failed:', err);
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
