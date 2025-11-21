import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { doctorsAPI } from "../../api/doctorsAPI";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function DoctorCreate({ setHasDoctorProfile }) {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // ✅ Initialize all fields to avoid uncontrolled → controlled warnings
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    licenseNumber: "",
    location: "",
    yearsOfExperience: 0,
    languagesSpoken: "", // handled as comma-separated string in form
    bio: "",
    contactInfo: {
      phone: "",
      email: "",
      address: "",
    },
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested contactInfo separately
    if (["phone", "email", "address"].includes(name)) {
      setForm({
        ...form,
        contactInfo: { ...form.contactInfo, [name]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();

      // Convert languagesSpoken string → array
      const payload = {
        ...form,
        languagesSpoken: form.languagesSpoken
          ? form.languagesSpoken.split(",").map((lang) => lang.trim())
          : [],
      };

      await doctorsAPI.createDoctorProfile(payload, token);

      if (setHasDoctorProfile) setHasDoctorProfile(true);

      toast.success("Doctor profile created successfully!");

      setTimeout(() => {
        navigate("/doctor/dashboard", { replace: true });
      }, 500);
    } catch (err) {
      console.error("❌ Failed to create doctor profile:", err);

      if (err.message.includes("already exists")) {
        toast.error("Profile already exists. Redirecting to dashboard.");
        if (setHasDoctorProfile) setHasDoctorProfile(true);
        navigate("/doctor/dashboard", { replace: true });
      } else {
        toast.error("Failed to create profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-purple-700">Create Your Doctor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
            <Input name="specialty" value={form.specialty} onChange={handleChange} placeholder="Specialty" required />
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

            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? "Creating profile..." : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
