import { useNavigate } from 'react-router-dom';
import DoctorCard from './UI/DoctorCard';

export function DoctorGrid({ doctors }) {
  const navigate = useNavigate();

  if (!Array.isArray(doctors) || doctors.length === 0) {
    return <p className="text-gray-500">No doctors found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {doctors.map((doc) => (
        <div
          key={doc._id}
          onClick={() => navigate(`/appointments/${doc._id}`)}
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
          <DoctorCard doctor={doc} />
        </div>
      ))}
    </div>
  );
}
