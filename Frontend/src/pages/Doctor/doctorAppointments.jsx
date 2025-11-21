import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { doctorsAPI } from "../../api/doctorsAPI";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/doctor/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function DoctorAppointments() {
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load appointments
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();
        const res = await doctorsAPI.getAppointments(token);
        if (mounted) setAppointments(res?.appointments ?? []);
      } catch (err) {
        console.error("❌ Failed to fetch appointments:", err);
        toast.error("Could not load appointments");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [getToken]);

  // Action handlers
  const handleConfirm = async (id) => {
    try {
      const token = await getToken();
      await doctorsAPI.updateAppointmentStatus(id, "confirmed", token);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "confirmed" } : a))
      );
      toast.success("Appointment confirmed");
    } catch (err) {
      toast.error("Failed to confirm appointment");
    }
  };

  const handleCancel = async (id) => {
    try {
      const token = await getToken();
      await doctorsAPI.updateAppointmentStatus(id, "cancelled", token);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
      );
      toast.success("Appointment cancelled");
    } catch (err) {
      toast.error("Failed to cancel appointment");
    }
  };

  const handleReschedule = async (id) => {
    // For now, just simulate reschedule
    toast("Reschedule flow not yet implemented");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-purple-600">Loading appointments…</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-600">No appointments scheduled.</p>
        ) : (
          <ul className="divide-y divide-purple-100">
            {appointments.map((appt) => (
              <li key={appt.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-purple-800">{appt.patientName}</p>
                  <p className="text-sm text-gray-600">
                    {appt.date} at {appt.time}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge
                    variant={
                      appt.status === "confirmed"
                        ? "success"
                        : appt.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {appt.status}
                  </Badge>
                  {appt.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => handleConfirm(appt.id)}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleCancel(appt.id)}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReschedule(appt.id)}>
                        Reschedule
                      </Button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
