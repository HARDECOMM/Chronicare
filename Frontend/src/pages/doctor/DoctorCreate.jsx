import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { doctorsAPI } from "@/api/doctorAPI";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function DoctorCreate({ setHasDoctorProfile }) {
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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

      const payload = {
        ...form,
        languagesSpoken: form.languagesSpoken
          ? form.languagesSpoken.split(",").map((lang) => lang.trim())
          : [],
      };

      await doctorsAPI.createDoctorProfile(payload, token);

      if (setHasDoctorProfile) setHasDoctorProfile(true);

      toast.success("Doctor profile created successfully!");
      navigate("/doctor", { replace: true });
    } catch (err) {
      console.error("❌ Failed to create doctor profile:", err);

      if (err.message.includes("already exists")) {
        toast.error("Profile already exists. Redirecting to dashboard.");
        if (setHasDoctorProfile) setHasDoctorProfile(true);
        navigate("/doctor", { replace: true });
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Dr. John Doe"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Specialty</label>
              <Input
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
                placeholder="e.g. Cardiology, Pediatrics"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">License Number</label>
              <Input
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="e.g. MDCN-12345"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Location</label>
              <Input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Lagos University Teaching Hospital"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Years of Experience</label>
              <Input
                type="number"
                name="yearsOfExperience"
                value={form.yearsOfExperience}
                onChange={handleChange}
                placeholder="e.g. 10"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Languages Spoken</label>
              <Input
                name="languagesSpoken"
                value={form.languagesSpoken}
                onChange={handleChange}
                placeholder="e.g. English, Yoruba, French"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Short Bio</label>
              <Input
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Brief introduction about yourself"
              />
            </div>

            {/* Contact Information */}
            <div>
              <label className="block font-medium mb-1">Phone Number</label>
              <Input
                name="phone"
                value={form.contactInfo.phone}
                onChange={handleChange}
                placeholder="e.g. 08012345678"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Email Address</label>
              <Input
                name="email"
                value={form.contactInfo.email}
                onChange={handleChange}
                placeholder="e.g. doctor@example.com"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Clinic Address</label>
              <Input
                name="address"
                value={form.contactInfo.address}
                onChange={handleChange}
                placeholder="e.g. 15, Broad Street, Lagos"
              />
            </div>

            {/* Profile Image */}
            <div>
              <label className="block font-medium mb-1">Profile Image URL</label>
              <Input
                name="profileImage"
                value={form.profileImage}
                onChange={handleChange}
                placeholder="Paste image link here"
              />
            </div>

            {/* Action Buttons */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? "Creating profile..." : "Save Profile"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => navigate("/doctor")}
            >
              Back to Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
