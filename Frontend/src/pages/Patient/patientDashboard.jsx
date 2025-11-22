import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { patientsAPI } from "@/api/patientAPI";
import { appointmentsAPI } from "@/api/appointmentAPI";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export function PatientDashboard() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ totalAppointments: 0, appointmentsToday: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();

        // Load patient profile
        const res = await patientsAPI.getMyProfile(token);
        if (mounted && res) {
          setProfile(res);
        }

        // Load upcoming appointments
        const apptRes = await appointmentsAPI.listForPatient(token);
        if (mounted && apptRes?.appointments) {
          setAppointments(apptRes.appointments);

          // Calculate simple stats
          const today = new Date().toDateString();
          const totalAppointments = apptRes.appointments.length;
          const appointmentsToday = apptRes.appointments.filter(
            (a) => new Date(a.date).toDateString() === today
          ).length;

          setStats({ totalAppointments, appointmentsToday });
        }
      } catch (err) {
        console.error("❌ Failed to load patient dashboard:", err);
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {profile?.profileImage && (
            <img
              src={profile.profileImage}
              alt={`${profile.name}'s profile`}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <p><strong>Name:</strong> {profile?.name}</p>
          <p><strong>Age:</strong> {profile?.age}</p>
          <p><strong>Gender:</strong> {profile?.gender}</p>
          <p><strong>Medical History:</strong> {profile?.medicalHistory || "N/A"}</p>
          <Button
            className="mt-4 bg-purple-600 text-white"
            onClick={() => navigate("/patient/edit")}
          >
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Your Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-700">{stats.totalAppointments}</p>
            <p className="text-gray-600">Total Appointments</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-700">{stats.appointmentsToday}</p>
            <p className="text-gray-600">Today</p>
          </div>
        </CardContent>
      </Card>

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
                    <p className="font-medium text-purple-800">
                      {appt.doctorId?.name || "Unknown Doctor"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(appt.date).toLocaleDateString()}{" "}
                      at {new Date(appt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      appt.status === "confirmed"
                        ? "success"
                        : appt.status === "canceled"
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link to="/patient/appointments">
            <Button className="bg-purple-600 text-white">View Appointments</Button>
          </Link>
          <Link to="/patient/appointments/book">
            <Button className="bg-green-600 text-white">Book Appointment</Button>
          </Link>
          <Link to="/patient/profile">
            <Button className="bg-blue-600 text-white">My Profile</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
