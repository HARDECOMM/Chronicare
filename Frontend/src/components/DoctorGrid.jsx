// components/Patient/DoctorGrid.jsx
import { DoctorCard } from './UI/Doctor/DoctorCard';

export function DoctorGrid({ doctors }) {
  if (!Array.isArray(doctors) || doctors.length === 0) {
    return <p className="text-gray-700">No doctors found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doc) => (
        <DoctorCard key={doc._id ?? doc.id ?? doc.name} doctor={doc} />
      ))}
    </div>
  );
}
