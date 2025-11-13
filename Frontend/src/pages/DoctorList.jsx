import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { DoctorsAPI } from '../api/DoctorsAPI';
import { DoctorGrid } from '../components/DoctorGrid';

export function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const { getToken } = useAuth(); // ✅ Get Clerk token hook

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const token = await getToken(); // ✅ Retrieve token
        const data = await DoctorsAPI.list(token); // ✅ Pass token to API
        console.log('📡 Doctors fetched:', data);
        setDoctors(data);
      } catch (err) {
        console.error('❌ Error fetching doctors:', err);
      }
    }

    fetchDoctors();
  }, [getToken]);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Available Doctors</h1>
      <DoctorGrid doctors={doctors} />
    </div>
  );
}
