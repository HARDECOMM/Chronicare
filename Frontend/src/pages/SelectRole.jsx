// pages/SelectRole.jsx
import { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { usersAPI } from '../api/usersAPI';
import { toast } from 'react-hot-toast';
import { Button } from '../components/UI/Button';

export function SelectRole() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');

  const handleSubmit = async () => {
    if (!selectedRole) return toast.error('Please select a role');
    try {
      const token = await getToken();
      await usersAPI.setRole(user.id, selectedRole.toLowerCase(), token); // ✅ save lowercase
      await new Promise((resolve) => setTimeout(resolve, 300));
      toast.success(`Role set to ${selectedRole}`);
      // Render-only approach: no navigate needed; landing at "/" shows correct page
      window.location.assign('/'); // optional: hard reload to refresh Clerk metadata
    } catch (err) {
      console.error('❌ Role update failed:', err);
      toast.error('Failed to set role');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 text-center bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Choose Your Role</h2>
      <div className="space-y-4">
        {['patient', 'doctor', 'admin'].map((role) => (
          <label
            key={role}
            className="block text-left cursor-pointer hover:text-purple-600 transition"
          >
            <input
              type="radio"
              name="role"
              value={role}
              checked={selectedRole === role}
              onChange={() => setSelectedRole(role)}
              className="mr-2 accent-purple-600"
            />
            <span className="capitalize">{role}</span>
          </label>
        ))}
      </div>
      <Button
        className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        onClick={handleSubmit}
      >
        Confirm Role
      </Button>
    </div>
  );
}
