import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { appointmentsAPI } from '../../api/appointmentsAPI';
import { AppointmentCard } from '../../components/UI/AppointmentCard';

// 🩺 Named export for use with { PatientAppointments }
export const PatientAppointments = () => {
  const { id } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await appointmentsAPI.listByPatient(id);
        setAppointments(res);
      } catch (err) {
        console.error('Failed to load patient appointments:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading appointments...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-6">
      <h2 className="text-2xl font-bold mb-6">Patient Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found for this patient.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <AppointmentCard key={appt._id} appt={appt} />
          ))}
        </ul>
      )}
    </div>
  );
};
