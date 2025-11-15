// src/components/DoctorAppointmentsPanel.jsx
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { appointmentsAPI } from '../api/appointmentsAPI'; // adjust path if needed

export default function DoctorAppointmentsPanel() {
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(false);

  async function fetchAppointments() {
    try {
      setError(null);
      const token = await getToken();
      const data = await appointmentsAPI.getDoctorAppointments(token); // should return array
      setAppointments(data || []);
    } catch (err) {
      console.error('fetchAppointments error', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    mountedRef.current = true;
    // initial load
    fetchAppointments();

    // poll every 10 seconds
    const id = setInterval(() => {
      if (!mountedRef.current) return;
      fetchAppointments();
    }, 10000);

    // listen for global event so patient booking can trigger immediate refetch
    const onCreated = () => {
      fetchAppointments();
    };
    window.addEventListener('appointment:created', onCreated);

    return () => {
      mountedRef.current = false;
      clearInterval(id);
      window.removeEventListener('appointment:created', onCreated);
    };
  }, [getToken]);

  if (loading) return <div>Loading appointments…</div>;
  if (error) return <div>Error loading appointments</div>;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Appointments</h2>
        <button onClick={fetchAppointments} className="text-sm text-purple-600">Refresh</button>
      </div>

      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        appointments.map((a) => (
          <div key={a._id} className="p-3 border rounded mb-2">
            <div className="font-semibold">{a.patientName || a.patient?.name || 'Unknown patient'}</div>
            <div className="text-sm text-gray-600">{new Date(a.time).toLocaleString()}</div>
            <div className="text-sm">Status: {a.status}</div>
            {a.notes && <div className="text-sm mt-1">{a.notes}</div>}
          </div>
        ))
      )}
    </section>
  );
}
