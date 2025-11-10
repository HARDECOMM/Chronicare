// src/pages/DoctorList.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔁 Import navigation hook
import { getDoctors } from '../Apis/getDoctors';

export function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate(); // 🚀 Initialize navigation

  useEffect(() => {
    // 📦 Fetch doctor data from backend
    async function fetchDoctors() {
      const data = await getDoctors();
      setDoctors(data);
    }
    fetchDoctors();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Available Doctors</h1>

      {/* 🧾 Show message if no doctors are available */}
      {doctors.length === 0 ? (
        <p className="text-gray-500">No doctors available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 🧑‍⚕️ Render each doctor card */}
          {doctors.map((doc) => (
            <div key={doc._id} className="border rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold text-gray-800">{doc.name}</h2>
              <p className="text-sm text-gray-600">{doc.specialty}</p>
              <p className="text-sm text-gray-500">Rating: {doc.rating || 'N/A'}</p>
              <p className="text-sm text-gray-500">Location: {doc.location || '—'}</p>
              <p className="text-sm text-gray-500 mt-2">{doc.bio || 'No bio available.'}</p>

              {/* 🗓️ Navigate to booking page for selected doctor */}
              <button
                onClick={() => navigate(`/appointments/${doc._id}`)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
