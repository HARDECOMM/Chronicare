// pages/Patient/DoctorList.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { DoctorCard } from '../../components/UI/Doctor/DoctorCard'; // adjust path if needed
import { doctorsAPI } from '../../api/doctorsAPI';

export function DoctorList() {
  const { getToken } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors once on mount
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const token = await getToken();
        const data = await doctorsAPI.getAll(token);
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err?.message || 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-purple-600 text-lg font-semibold">Loading doctors...</p>
      </div>
    );
  }

  if (!doctors.length) {
    return (
      <div className="min-h-screen bg-white p-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-3">Find a doctor</h1>
        <p className="text-gray-700">No doctors available yet. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Purple heading */}
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Find a doctor</h1>

      {/* Grid of DoctorCard components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <DoctorCard key={doc._id ?? doc.id ?? doc.name} doctor={doc} />
        ))}
      </div>
    </div>
  );
}
