import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { appointmentsAPI } from '../../api/appointmentsAPI';
import { AppointmentItem } from '../../components/UI/Doctor/AppointmentItem';

export function DoctorDashboard() {
  const { getToken } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch appointments once on mount. Depend only on getToken.
  useEffect(() => {
    let mounted = true;

    async function fetchAppointments() {
      try {
        const token = await getToken();
        console.log('[DoctorDashboard] token present?', !!token);

        // Diagnostic: log the API call about to be made
        console.log('[DoctorDashboard] calling getDoctorAppointments via appointmentsAPI');

        const data = await appointmentsAPI.getDoctorAppointments(token);

        console.log('[DoctorDashboard] fetched appointments raw:', data);

        if (!mounted) return;
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('[DoctorDashboard] failed to load appointments', err, err?.response?.status, err?.response?.data);
        toast.error(err?.message || 'Failed to load appointments');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAppointments();

    return () => {
      mounted = false;
    };
  }, [getToken]);

  // Manual refresh (safe, does not create a loop)
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await getToken();
      console.log('[DoctorDashboard] manual refresh token present?', !!token);
      const data = await appointmentsAPI.getDoctorAppointments(token);
      console.log('[DoctorDashboard] refreshed appointments raw:', data);
      setAppointments(Array.isArray(data) ? data : []);
      toast.success('Appointments refreshed');
    } catch (err) {
      console.error('[DoctorDashboard] refresh failed', err, err?.response?.status, err?.response?.data);
      toast.error(err?.message || 'Failed to refresh appointments');
    } finally {
      setRefreshing(false);
    }
  };

  const handleConfirm = async (appt) => {
    try {
      const token = await getToken();
      console.log('[DoctorDashboard] confirm', appt._id);
      await appointmentsAPI.updateStatus(appt._id, 'confirmed', token);
      toast.success('Appointment confirmed');
      handleRefresh();
    } catch (err) {
      console.error('[DoctorDashboard] confirm failed', err);
      toast.error('Failed to confirm');
    }
  };

  const handleCancel = async (appt) => {
    try {
      const token = await getToken();
      console.log('[DoctorDashboard] cancel', appt._id);
      await appointmentsAPI.updateStatus(appt._id, 'cancelled', token);
      toast.success('Appointment cancelled');
      handleRefresh();
    } catch (err) {
      console.error('[DoctorDashboard] cancel failed', err);
      toast.error('Failed to cancel');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-purple-600 text-lg font-semibold">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Doctor Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Empty state */}
      {appointments.length === 0 ? (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">No appointments yet</h2>
          <p className="text-gray-700">
            You don’t have any scheduled appointments. Share your profile link or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {appointments.map((appt) => (
            <AppointmentItem
              key={appt._id ?? appt.id}
              appt={appt}
              onView={() => {}}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
