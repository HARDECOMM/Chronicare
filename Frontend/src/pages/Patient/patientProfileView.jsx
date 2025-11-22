import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { patientsAPI } from "../../api/patientAPI";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PatientProfileView() {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const data = await patientsAPI.getMyProfile(token);
        setProfile(data);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [getToken]);

  if (loading) return <p className="text-purple-600">Loading profile…</p>;

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Profile Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">You don’t have a profile yet.</p>
          <Link to="/patient/create">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white mt-4">
              Create Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Patient Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Age:</strong> {profile.age}</p>
        <p><strong>Date of Birth:</strong> {profile.dateOfBirth?.split("T")[0] || "Not provided"}</p>
        <p><strong>Gender:</strong> {profile.gender}</p>
        <p><strong>Phone:</strong> {profile.contactInfo?.phone || "Not provided"}</p>
        <p><strong>Address:</strong> {profile.contactInfo?.address || "Not provided"}</p>
        <p><strong>Medical History:</strong> {profile.medicalHistory?.join(", ") || "None"}</p>
        <p><strong>Allergies:</strong> {profile.allergies?.join(", ") || "None"}</p>
        <p>
          <strong>Emergency Contact:</strong>{" "}
          {profile.emergencyContact
            ? `${profile.emergencyContact.name} (${profile.emergencyContact.relation}) — ${profile.emergencyContact.phone}`
            : "Not provided"}
        </p>
        <Link to="/patient/edit">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white mt-4">
            Edit Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
