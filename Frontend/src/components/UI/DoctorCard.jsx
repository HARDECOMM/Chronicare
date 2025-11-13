import { useNavigate } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
      <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
      <p className="text-sm text-gray-600">{doctor.specialty}</p>
      <p className="text-sm text-gray-500">Rating: {doctor.rating || 'N/A'}</p>
      <p className="text-sm text-gray-500">Location: {doctor.location || '—'}</p>
      <p className="text-sm text-gray-500 mt-2">{doctor.bio || 'No bio available.'}</p>
      <button
        onClick={() => navigate(`/appointments/${doctor._id}`)}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Book Appointment
      </button>
    </div>
  );
}