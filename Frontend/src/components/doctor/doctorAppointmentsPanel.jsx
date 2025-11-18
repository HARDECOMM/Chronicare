import { useEffect, useState } from 'react';
import { appointmentsAPI } from '../../api/appointmentsAPI';
import { toast } from 'react-hot-toast';

export function DoctorAppointmentsPanel({ doctorId }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!doctorId) return;
    let mounted = true;

    (async () => {
      try {
        const data = await appointmentsAPI.getDoctorAppointments(doctorId);
        if (!mounted) return;
        setAppointments(data || []);
      } catch (err) {
        console.error('❌ Failed to load doctor appointments', err);
        toast.error('Failed to load appointments');
      }
    })();

    return () => {
      mounted = false;
    };
  }, [doctorId]);

  if (!appointments.length) {
    return (
      <div className="mt-4 text-gray-600">
        No appointments found for this doctor.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-purple-700 mb-3">
        Appointments
      </h2>
      <ul className="space-y-4">
        {appointments.map((appt) => (
          <li
            key={appt._id}
            className="border border-purple-200 rounded p-4 bg-white shadow-sm"
          >
            <p className="text-gray-800 font-medium">
              Patient: {appt.patientName}
            </p>
            <p className="text-gray-600">
              Date: {new Date(appt.date).toLocaleString()}
            </p>
            <p className="text-gray-600">Status: {appt.status}</p>
            {appt.notes && (
              <p className="text-gray-600 mt-2">Notes: {appt.notes}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
