import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { patientsAPI } from "../../api/patientAPI";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Predefined options
const genderOptions = ["male", "female", "other"];
const emergencyRelations = ["Parent", "Sibling", "Spouse", "Friend", "Guardian"];

export function PatientCreate({ setHasPatientProfile }) {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    medicalHistory: "",
    allergies: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();

      // ✅ Check if profile already exists
      const existingProfile = await patientsAPI.getMyProfile(token);
      if (existingProfile) {
        toast.error("Patient profile already exists");
        navigate("/patient/profile", { replace: true });
        return;
      }

      const payload = {
        name: form.name,
        age: form.age,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        contactInfo: {
          phone: form.phone,
          address: form.address,
        },
        medicalHistory: form.medicalHistory ? [form.medicalHistory] : [],
        allergies: form.allergies ? [form.allergies] : [],
        emergencyContact: {
          name: form.emergencyContactName,
          phone: form.emergencyContactPhone,
          relation: form.emergencyContactRelation,
        },
      };

      await patientsAPI.createProfile(payload, token);

      if (setHasPatientProfile) setHasPatientProfile(true);

      toast.success("Patient profile created successfully!");
      navigate("/patient", { replace: true });
    } catch (err) {
      console.error("❌ Failed to create patient profile:", err);
      toast.error("Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-purple-700">Create Your Patient Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <Input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              required
            />
            <Input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              placeholder="Date of Birth"
            />

            <div className="flex flex-col">
              <label className="font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="border rounded p-2"
                required
              >
                <option value="">Select Gender</option>
                {genderOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Home Address"
            />

            {/* ✅ Simplified Medical History */}
            <Input
              name="medicalHistory"
              value={form.medicalHistory}
              onChange={handleChange}
              placeholder="Medical History (e.g., None, Diabetes)"
            />

            {/* ✅ Simplified Allergies */}
            <Input
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              placeholder="Allergies (e.g., Dust, Peanuts)"
            />

            <Input
              name="emergencyContactName"
              value={form.emergencyContactName}
              onChange={handleChange}
              placeholder="Emergency Contact Name"
              required
            />
            <Input
              name="emergencyContactPhone"
              value={form.emergencyContactPhone}
              onChange={handleChange}
              placeholder="Emergency Contact Phone"
              required
            />

            <div className="flex flex-col">
              <label className="font-medium mb-1">Emergency Contact Relation</label>
              <select
                name="emergencyContactRelation"
                value={form.emergencyContactRelation}
                onChange={handleChange}
                className="border rounded p-2"
                required
              >
                <option value="">Select Relation</option>
                {emergencyRelations.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ Purple Create Profile Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? "Creating profile..." : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
