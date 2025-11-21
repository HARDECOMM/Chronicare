import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { adminAPI } from "../../api/adminAPI";
import { toast } from "react-hot-toast";

export function AdminDoctors() {
  const { getToken } = useAuth();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await adminAPI.getDoctors(token);
        setDoctors(res.doctors || []);
      } catch {
        toast.error("Failed to load doctors");
      }
    })();
  }, [getToken]);

  return (
    <div>
      <h2 className="text-purple-700 text-xl mb-4">Doctors</h2>
      <ul>
        {doctors.map((d) => (
          <li key={d._id}>
            {d.name} — {d.specialty} ({d.location})
          </li>
        ))}
      </ul>
    </div>
  );
}
