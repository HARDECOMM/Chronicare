import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { doctorsAPI } from "../../api/doctorsAPI";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DoctorProfileEditor() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    specialty: "",
    licenseNumber: "",
    location: "",
    yearsOfExperience: 0,
    languagesSpoken: "",
    bio: "",
    contactInfo: {
      phone: "",
      email: "",
      address: "",
    },
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing profile
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();
        const res = await doctorsAPI.getMyProfile(token);
        if (mounted && res?.profile) {
          const doc = res.profile;
          setForm({
            name: doc.name || "",
            specialty: doc.specialty || "",
            licenseNumber: doc.licenseNumber || "",
            location: doc.location || "",
            yearsOfExperience: doc.yearsOfExperience || 0,
            languagesSpoken: doc.languagesSpoken?.join(", ") || "",
            bio: doc.bio || "",
            contactInfo: {
              phone: doc.contactInfo?.phone || "",
              email: doc.contactInfo?.email || "",
              address: doc.contactInfo?.address || "",
            },
            profileImage: doc.profileImage || "",
          });
        }
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
        toast.error("Could not load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["phone", "email", "address"].includes(name)) {
      setForm({ ...form, contactInfo: { ...form.contactInfo, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      const payload = {
        ...form,
        languagesSpoken: form.languagesSpoken
          ? form.languagesSpoken.split(",").map((lang) => lang.trim())
          : [],
      };
      await doctorsAPI.updateMyProfile(payload, token);
      toast.success("Profile updated successfully!");

      // ✅ Redirect to view profile after save
      navigate("/doctor/view");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-purple-600">Loading profile…</p>;
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
        <Input name="specialty" value={form.specialty} onChange={handleChange} placeholder="Specialty" />
        <Input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="License Number" />
        <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
        <Input
          type="number"
          name="yearsOfExperience"
          value={form.yearsOfExperience}
          onChange={handleChange}
          placeholder="Years of Experience"
        />
        <Input
          name="languagesSpoken"
          value={form.languagesSpoken}
          onChange={handleChange}
          placeholder="Languages (comma separated)"
        />
        <Input name="bio" value={form.bio} onChange={handleChange} placeholder="Short Bio" />
        <Input name="phone" value={form.contactInfo.phone} onChange={handleChange} placeholder="Phone" />
        <Input name="email" value={form.contactInfo.email} onChange={handleChange} placeholder="Email" />
        <Input name="address" value={form.contactInfo.address} onChange={handleChange} placeholder="Address" />
        <Input name="profileImage" value={form.profileImage} onChange={handleChange} placeholder="Profile Image URL" />

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
