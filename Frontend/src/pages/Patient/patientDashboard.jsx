// src/pages/patient/PatientDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { patientsAPI } from "../../api/patientAPI";
import { toast } from "react-hot-toast";

export function PatientDashboard() {
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await patientsAPI.getMyAppointments(token);
        setAppointments(res || []);
      } catch (err) {
        toast.error(err.message || "Failed to load appointments");
      }
    })();
  }, [getToken]);

  return (
    <div>
      <h2 className="text-purple-700 text-xl mb-4">Upcoming Appointments</h2>
      {appointments.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <ul>
          {appointments.map((a) => (
            <li key={a._id}>
              {new Date(a.date).toLocaleString()} — {a.reason} with Dr. {a.doctorId?.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
