import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { UsersAPI } from '../api/usersAPI';
import { toast } from 'react-hot-toast';

export function SelectRole() {
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selectedRole) return toast.error('Please select a role');

    try {
      await UsersAPI.setRole(user.id, selectedRole);
      toast.success(`Role set to ${selectedRole}`);
      navigate('/'); // Redirect to trigger role-based routing
    } catch (err) {
      console.error('Role update failed:', err);
      toast.error('Failed to set role');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <h2 className="text-2xl font-bold mb-6">Choose Your Role</h2>
      <div className="space-y-4">
        {['patient', 'doctor', 'admin'].map((role) => (
          <label key={role} className="block">
            <input
              type="radio"
              name="role"
              value={role}
              checked={selectedRole === role}
              onChange={() => setSelectedRole(role)}
              className="mr-2"
            />
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </label>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Confirm Role
      </button>
    </div>
  );
}
