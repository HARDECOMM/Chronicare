import { useEffect, useState } from 'react';
import { usersAPI } from '../../api/patientsAPI';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function AdminPanel() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await UsersAPI.listAll();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error('Error loading users');
    }
  }

  async function updateRole(userId, newRole) {
    try {
      await usersAPI.setRole(userId, newRole);
      toast.success(`Role updated to ${newRole}`);
      await loadUsers();
    } catch (err) {
      console.error('Role update failed:', err);
      toast.error('Failed to update role');
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role || 'Unassigned'}</td>
              <td className="p-2 flex gap-2 flex-wrap">
                {['patient', 'doctor', 'admin'].map((r) => (
                  <button
                    key={r}
                    onClick={() => updateRole(u._id, r)}
                    className={`px-2 py-1 rounded ${
                      u.role === r ? 'bg-gray-300' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
                {u.role === 'patient' && (
                  <button
                    onClick={() => navigate(`/admin/patient/${u._id}/appointments`)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    View Appointments
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
