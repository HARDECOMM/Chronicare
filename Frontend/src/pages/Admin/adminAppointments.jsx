import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { adminAPI } from "../../api/adminAPI";
import { toast } from "react-hot-toast";

export function AdminAppointments() {
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await adminAPI.getAppointments(token);
        setAppointments(res.appointments || []);
      } catch {
        toast.error("Failed to load appointments");
      }
    })();
  }, [getToken]);

  return (
    <div>
      <h2 className="text-purple-700 text-xl mb-4">Appointments</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Doctor</th>
            <th className="p-2 border">Patient</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td className="p-2 border">{new Date(a.date).toLocaleString()}</td>
              <td className="p-2 border">{a.reason}</td>
              <td className="p-2 border">{a.doctor?.name}</td>
              <td className="p-2 border">{a.userId?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
