import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { adminAPI } from "../../api/adminAPI";
import { toast } from "react-hot-toast";

export function AdminUsers() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await adminAPI.getUsers(token);
        setUsers(res.users || []);
      } catch {
        toast.error("Failed to load users");
      }
    })();
  }, [getToken]);

  return (
    <div>
      <h2 className="text-purple-700 text-xl mb-4">Users</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
