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
const chronicConditions = ["Diabetes", "Hypertension", "Asthma", "Heart Disease", "None"];
const allergyOptions = ["Penicillin", "Peanuts", "Shellfish", "Dust", "None"];
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
    medicalHistory: [],
    allergies: [],
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiSelect = (name, value) => {
    setForm((prev) => {
      const alreadySelected = prev[name].includes(value);
      return {
        ...prev,
        [name]: alreadySelected
          ? prev[name].filter((v) => v !== value)
          : [...prev[name], value],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();

      const payload = {
        name: form.name,
        age: form.age,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : null,
        gender: form.gender,
        contactInfo: { phone: form.phone, address: form.address },
        medicalHistory: form.medicalHistory,
        allergies: form.allergies,
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
            {/* Name */}
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />

            {/* Age */}
            <Input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              required
            />

            {/* Date of Birth */}
            <Input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              placeholder="Date of Birth"
            />

            {/* Gender Dropdown */}
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
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />

            {/* Address */}
            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Home Address"
            />

            {/* Chronic Conditions Multi-Select Chips */}
            <div>
              <label className="block font-medium mb-1">Primary Chronic Condition(s)</label>
              <div className="flex flex-wrap gap-2">
                {chronicConditions.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => handleMultiSelect("medicalHistory", c)}
                    className={`px-3 py-1 rounded-full border ${
                      form.medicalHistory.includes(c)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergies Multi-Select Chips */}
            <div>
              <label className="block font-medium mb-1">Allergies</label>
              <div className="flex flex-wrap gap-2">
                {allergyOptions.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => handleMultiSelect("allergies", a)}
                    className={`px-3 py-1 rounded-full border ${
                      form.allergies.includes(a)
                        ? "bg-red-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
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

            {/* Relation Dropdown */}
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
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? "Creating profile..." : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
