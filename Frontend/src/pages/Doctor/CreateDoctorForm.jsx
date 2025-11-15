// src/pages/Doctor/CreateDoctorForm.jsx
import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { doctorsAPI } from '../../api/doctorsAPI'; // change to: import { doctorsAPI } from '../../api/doctorsAPI' if you use named export
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function CreateDoctorForm({ onCreated }) {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !specialty) {
      toast.error('Please provide name and specialty');
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      console.log('[CreateDoctorForm] token present?', !!token);

      const payload = { name, specialty, location, bio };

      // call API (assumes doctorsAPI.create exists)
      const doctor = await doctorsAPI.create(payload, token);

      console.log('[CreateDoctorForm] create response', doctor);

      if (!doctor) {
        toast.error('Server returned no data');
        return;
      }

      toast.success('Doctor profile created');
      onCreated && onCreated(doctor);

      // navigate only when we have an id
      const id = doctor._id ?? doctor.id;
      if (id) {
        navigate(`/doctor/view/${id}`);
      } else {
        console.warn('[CreateDoctorForm] created doctor missing id, staying on page');
      }
    } catch (err) {
      console.error('Create doctor failed', err, err?.response?.status, err?.response?.data);
      toast.error(err?.response?.data?.error || err?.message || 'Failed to create doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4">
      <h2 className="text-xl font-bold mb-4">Create Doctor Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          required
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="Specialty"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Short bio"
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          {loading ? 'Saving...' : 'Create profile'}
        </button>
      </form>
    </div>
  );
}
