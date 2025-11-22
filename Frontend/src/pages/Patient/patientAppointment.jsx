// PatientAppointments.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { appointmentsAPI } from "@/api/appointmentAPI";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PatientAppointments() {
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await appointmentsAPI.listForPatient(token);
        console.log("Appointments API response:", res);
        setAppointments(Array.isArray(res.appointments) ? res.appointments : []);
      } catch (err) {
        toast.error("Could not load appointments");
      } finally {
        setLoading(false);
      }
    })();
  }, [getToken]);

  if (loading) return <p className="text-purple-600">Loading your appointments…</p>;

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <p className="text-gray-600">You have no appointments yet.</p>
      ) : (
        appointments.map((appt) => (
          <Card key={appt._id}>
            <CardHeader>
              <CardTitle>
                Appointment with Dr. {appt.doctorId?.name || "Unknown"} —{" "}
                {new Date(appt.date).toLocaleDateString()}{" "}
                {new Date(appt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Reason:</strong> {appt.reason || "Not specified"}</p>
              <p><strong>Status:</strong> {appt.status}</p>
              <div className="mt-2">
                <strong>Notes:</strong>
                {appt.notes?.length ? (
                  <ul className="list-disc ml-5 space-y-1">
                    {appt.notes.map((note, idx) => (
                      <li key={idx}>
                        <span className="font-medium text-purple-700">
                          {note.authorType === "doctor" ? "Doctor" : "Patient"}:
                        </span>{" "}
                        {note.message}{" "}
                        <span className="text-gray-500 text-xs">
                          ({new Date(note.createdAt).toLocaleString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No notes yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
