// src/pages/patient/PatientProfileEditor.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { patientsAPI } from "../../api/patientAPI";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PatientProfileEditor() {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await patientsAPI.getMyProfile(token);
        if (res) setProfile(res);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [getToken]);

  const handleSave = async () => {
    try {
      const token = await getToken();
      const updated = await patientsAPI.updateMyProfile(profile, token);
      setProfile(updated);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <Input value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
      <Input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
}