import { useEffect, useState } from 'react';
import { AppointmentCard } from '../components/UI/AppointmentCard';
import { toast } from 'react-hot-toast';

export function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setLoading(true);
    try {
      const data = await AppointmentsAPI.listForDoctor();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load doctor appointments:', err);
      toast.error('Error loading appointments');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id, status) {
    setUpdatingId(id);
    try {
      await AppointmentsAPI.updateStatus(id, status);
      toast.success(`Appointment ${status}`);
      await loadAppointments();
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await AppointmentsAPI.remove(id);
      toast.success('Appointment deleted');
      await loadAppointments();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete appointment');
    }
  }

  if (loading) return <p className="text-center mt-10">Loading appointments...</p>;
  if (appointments.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600 mb-4">No appointments assigned to you yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-6">
      <h2 className="text-2xl font-bold mb-6">Doctor Dashboard</h2>
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
    </div>
  );
}
