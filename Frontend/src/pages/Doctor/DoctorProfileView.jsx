import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { doctorsAPI } from "../../api/doctorAPI";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function DoctorProfileView() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();

        // ✅ Use getMyProfile for the profile view
        const res = await doctorsAPI.getMyProfile(token);
        if (mounted && res?.profile) {
          setProfile(res.profile);
        }

        // ✅ Fetch stats separately
        const statsRes = await doctorsAPI.getProfileWithStats(token);
        if (mounted && statsRes?.stats) {
          setStats(statsRes.stats);
        }
      } catch (err) {
        console.error("❌ Failed to load doctor profile:", err);
        toast.error("Could not load doctor profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [getToken]);

  if (loading) return <p className="text-purple-600">Loading profile…</p>;
  if (!profile) return <p className="text-gray-600">No profile found.</p>;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-purple-700">{profile.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.profileImage && (
          <img
            src={profile.profileImage}
            alt={`${profile.name}'s profile`}
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
        )}
        <div>
          <p><strong>Specialty:</strong> {profile.specialty || "N/A"}</p>
          <p><strong>License Number:</strong> {profile.licenseNumber || "N/A"}</p>
          <p><strong>Location:</strong> {profile.location || "N/A"}</p>
          <p><strong>Years of Experience:</strong> {profile.yearsOfExperience}</p>
          <p><strong>Languages Spoken:</strong> {profile.languagesSpoken?.join(", ") || "N/A"}</p>
          <p><strong>Bio:</strong> {profile.bio || "N/A"}</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-700">Contact Info</h3>
          <p><strong>Phone:</strong> {profile.contactInfo?.phone || "N/A"}</p>
          <p><strong>Email:</strong> {profile.contactInfo?.email || "N/A"}</p>
          <p><strong>Address:</strong> {profile.contactInfo?.address || "N/A"}</p>
        </div>
        {stats && (
          <div>
            <h3 className="font-semibold text-purple-700">Stats</h3>
            <p><strong>Total Appointments:</strong> {stats.totalAppointments}</p>
            <p><strong>Appointments Today:</strong> {stats.appointmentsToday}</p>
            <p><strong>Patients Served:</strong> {stats.patientsServed}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            className="bg-purple-600 text-white"
            onClick={() => navigate("/doctor/edit")}   // ✅ corrected path
          >
            Edit Profile
          </Button>
          <Button
            className="bg-blue-600 text-white"
            onClick={() => navigate("/doctor/appointments")}
          >
            Manage Appointments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
