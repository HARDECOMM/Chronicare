import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doctorsAPI } from '../../api/doctorsAPI';
import { toast } from 'react-hot-toast';
import DoctorAppointmentsPanel from '../../components/DoctorAppointmentsPanel';

export function DoctorProfileView() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const d = await doctorsAPI.getById(id);
        if (!mounted) return;
        setDoctor(d);
      } catch (err) {
        console.error('Failed loading profile', err);
        toast.error('Failed to load profile');
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (!doctor) return <div className="p-6 text-gray-700">Loading profile...</div>;

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">{doctor.name}</h1>
      <p className="text-gray-700">{doctor.specialty} • {doctor.location}</p>
      <p className="mt-4 text-gray-700">{doctor.bio}</p>
      
      {/* Render the DoctorAppointmentsPanel here */}
      <DoctorAppointmentsPanel doctorId={id} />
    </div>
  );
}
