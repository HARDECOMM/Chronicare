import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { doctorsAPI } from "@/api/doctorAPI";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export function DoctorProfileEditor() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();
        const res = await doctorsAPI.getMyProfile(token);
        if (mounted && res?.profile) {
          setProfile(res.profile);
        }
      } catch (err) {
        console.error("❌ Failed to load doctor profile:", err);
        toast.error("Could not load profile for editing");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [getToken]);

  const handleSave = async () => {
    try {
      const token = await getToken();
      await doctorsAPI.updateMyProfile(token, profile);
      toast.success("Profile updated successfully");
      navigate("/doctor/view"); // ✅ redirect to profile view after save
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      toast.error("Could not update profile");
    }
  };

  if (loading) return <p className="text-purple-600">Loading editor…</p>;
  if (!profile) return <p className="text-gray-600">No profile found.</p>;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-purple-700">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={profile.name || ""}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Name"
        />
        <Input
          value={profile.specialty || ""}
          onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
          placeholder="Specialty"
        />
        <Input
          value={profile.location || ""}
          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
          placeholder="Location"
        />
        <Input
          value={profile.yearsOfExperience || ""}
          onChange={(e) =>
            setProfile({ ...profile, yearsOfExperience: e.target.value })
          }
          placeholder="Years of Experience"
        />
        <Input
          value={profile.languagesSpoken?.join(", ") || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              languagesSpoken: e.target.value.split(",").map((lang) => lang.trim()),
            })
          }
          placeholder="Languages (comma separated)"
        />

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            className="bg-purple-600 text-white"
            onClick={handleSave}
          >
            Save Changes
          </Button>
          <Button
            className="bg-gray-500 text-white"
            onClick={() => navigate("/doctor")}
          >
            Back to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
