import { useNavigate } from 'react-router-dom';

export function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  const id = doctor?._id ?? doctor?.id;
  const name = doctor?.name || 'Doctor';
  const specialty = doctor?.specialty || 'General Practitioner';
  const rating = doctor?.rating ?? 'N/A';
  const location = doctor?.location || '—';
  const bio = doctor?.bio || 'Compassionate care and evidence-based practice.';

  return (
    <div className="border border-purple-300 rounded-lg p-4 shadow hover:shadow-md transition bg-purple-50">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
          {name[0]?.toUpperCase() || 'D'}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-purple-700">{name}</h2>
          <p className="text-gray-700">{specialty}</p>
        </div>
      </div>

      <div className="text-sm space-y-1">
        <p className="text-gray-700">Rating: {rating}</p>
        <p className="text-gray-700">Location: {location}</p>
      </div>

      <p className="text-gray-700 mt-2">{bio}</p>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => navigate(`/appointments/${id}`)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          disabled={!id}
          aria-label={`Book appointment with ${name}`}
        >
          Book appointment
        </button>
        <button
          onClick={() => navigate(`/doctor/view/${id}`)}
          className="border border-purple-600 text-purple-700 px-4 py-2 rounded hover:bg-purple-100 transition"
          disabled={!id}
          aria-label={`View profile of ${name}`}
        >
          View profile
        </button>
      </div>
    </div>
  );
}

export function Button({ children, ...props }) {
  return (
    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" {...props}>
      {children}
    </button>
  );
}
