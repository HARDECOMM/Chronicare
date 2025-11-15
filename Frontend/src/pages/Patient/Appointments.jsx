import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { appointmentsAPI } from '../../api/appointmentsAPI';
import { AppointmentCard } from '../../components/UI/AppointmentCard';
import AppointmentFilters from '../../components/UI/AppointmentFilters';
import PaginationControls from '../../components/UI/PaginationControls';

export function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 2;

  const printRef = useRef();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const data = await appointmentsAPI.listMine(token);
      const safeData = Array.isArray(data) ? data : data?.data || [];
      setAppointments(safeData);
    } catch (err) {
      console.error('Load error:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id, status) {
    setUpdatingId(id);
    try {
      const token = await getToken();
      await appointmentsAPI.updateStatus(id, status, token);
      toast.success(`Appointment ${status} successfully`);
      await loadAppointments();
    } catch (err) {
      console.error('Status update error:', err);
      toast.error('Failed to update appointment');
      setError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const token = await getToken();
      await appointmentsAPI.remove(id, token);
      toast.success('Appointment deleted');
      await loadAppointments();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete appointment');
    }
  }

  function handlePrint() {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const win = window.open('', '', 'width=800,height=600');
      win.document.write(`<html><head><title>Appointments</title></head><body>${printContents}</body></html>`);
      win.document.close();
      win.print();
    }
  }

  const now = new Date();
  const filteredAppointments = appointments.filter((appt) => {
    const matchStatus = filterStatus
      ? appt.status?.toLowerCase() === filterStatus.toLowerCase()
      : true;

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

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading) return <p className="text-center mt-10">Loading appointments...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (filteredAppointments.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600 mb-4">
          No appointments match your current filters.
        </p>
        <button
          onClick={() => navigate('/doctors')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Book Your First Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>

      <AppointmentFilters
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onPrint={handlePrint}
      />

      <div ref={printRef}>
        <ul className="space-y-4">
          {paginatedAppointments.map((appt) => (
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

      <PaginationControls
        page={page}
        setPage={setPage}
        totalItems={filteredAppointments.length}
        pageSize={pageSize}
      />
    </div>
  );
}
