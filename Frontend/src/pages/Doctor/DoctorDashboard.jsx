import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { doctorsAPI } from "../../api/doctorsAPI";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DoctorDashboard() {
  const { getToken } = useAuth();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();

        // Load profile + stats
        const res = await doctorsAPI.getProfileWithStats(token);
        if (mounted && res?.doctor) {
          setProfile(res.doctor);
          setStats(res.stats);
        }

        // Load appointments
        const apptRes = await doctorsAPI.getAppointments(token);
        if (mounted && apptRes?.appointments) {
          setAppointments(apptRes.appointments);
        }
      } catch (err) {
        console.error("❌ Failed to load dashboard:", err);
        toast.error("Could not load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [getToken]);

  if (loading) {
    return <p className="text-purple-600">Loading dashboard…</p>;
  }

  if (!profile) {
    return <p className="text-gray-600">No profile found.</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Welcome! Dr. {profile.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {profile.profileImage && (
            <img
              src={profile.profileImage}
              alt={`${profile.name}'s profile`}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <p><strong>Specialty:</strong> {profile.specialty || "N/A"}</p>
          <p><strong>Location:</strong> {profile.location || "N/A"}</p>
          <p><strong>Years of Experience:</strong> {profile.yearsOfExperience}</p>
          <p><strong>Languages:</strong> {profile.languagesSpoken?.join(", ") || "N/A"}</p>
        </CardContent>
      </Card>

      {/* Stats Card */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-700">Your Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-700">{stats.totalAppointments}</p>
              <p className="text-gray-600">Total Appointments</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700">{stats.appointmentsToday}</p>
              <p className="text-gray-600">Today</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700">{stats.patientsServed}</p>
              <p className="text-gray-600">Patients Served</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-gray-600">No upcoming appointments.</p>
          ) : (
            <ul className="divide-y divide-purple-100">
              {appointments.map((appt) => (
                <li key={appt._id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-purple-800">{appt.patientName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(appt.date).toLocaleDateString()} at {appt.time}
                    </p>
                  </div>
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
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
