import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { patientsAPI } from "../../api/patientAPI";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

// Predefined options
const genderOptions = ["male", "female", "other"];
const chronicConditions = ["Diabetes", "Hypertension", "Asthma", "Heart Disease", "None"];
const allergyOptions = ["Penicillin", "Peanuts", "Shellfish", "Dust", "None"];
const emergencyRelations = ["Parent", "Sibling", "Spouse", "Friend", "Guardian"];

export function PatientProfileEditor() {
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

  // Load existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const profile = await patientsAPI.getMyProfile(token);
        if (profile) {
          setForm({
            name: profile.name || "",
            age: profile.age || "",
            dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
            gender: profile.gender || "",
            phone: profile.contactInfo?.phone || "",
            address: profile.contactInfo?.address || "",
            medicalHistory: profile.medicalHistory || [],
            allergies: profile.allergies || [],
            emergencyContactName: profile.emergencyContact?.name || "",
            emergencyContactPhone: profile.emergencyContact?.phone || "",
            emergencyContactRelation: profile.emergencyContact?.relation || "",
          });
        }
      } catch (err) {
        console.error("❌ Failed to load patient profile:", err);
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, [getToken]);

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
      await patientsAPI.updateMyProfile(payload, token);
      toast.success("Profile updated successfully!");
      navigate("/patient/profile"); // ✅ redirect to patient profile view
    } catch (err) {
      console.error("❌ Failed to update patient profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-purple-700">Edit Your Patient Profile</CardTitle>
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
                placeholder="e.g. Haruna Adegoke Ademoye"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1">Age</label>
                <Input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="e.g. 32"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Date of Birth</label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              >
                <option value="">Select Gender</option>
                {genderOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block font-medium mb-1">Phone Number</label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 08074904427"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Home Address</label>
              <Input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. 13, Shipeolu Street, Onipanu, Shomolu"
              />
            </div>

            {/* Chronic Conditions Multi-Select */}
            <div>
              <label className="block font-medium mb-1">Primary Chronic Condition(s)</label>
              <div className="flex flex-wrap gap-2">
                {chronicConditions.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => handleMultiSelect("medicalHistory", c)}
                    className={`px-3 py-1 rounded-full border ${form.medicalHistory.includes(c) ? "bg-purple-600 text-white" : "bg-gray-100"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergies Multi-Select */}
            <div>
              <label className="block font-medium mb-1">Allergies</label>
              <div className="flex flex-wrap gap-2">
                {allergyOptions.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => handleMultiSelect("allergies", a)}
                    className={`px-3 py-1 rounded-full border ${form.allergies.includes(a) ? "bg-red-600 text-white" : "bg-gray-100"
                      }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block font-medium mb-1">Emergency Contact Name</label>
              <Input
                name="emergencyContactName"
                value={form.emergencyContactName}
                onChange={handleChange}
                placeholder="e.g. Olalekan Ademoye"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Emergency Contact Phone</label>
              <Input
                name="emergencyContactPhone"
                value={form.emergencyContactPhone}
                onChange={handleChange}
                placeholder="e.g. 08077779620"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Emergency Contact Relation</label>
              <select
                name="emergencyContactRelation"
                value={form.emergencyContactRelation}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              >
                <option value="">Select Relation</option>
                {emergencyRelations.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                {loading ? "Updating profile..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/patient")}
              >
                Back to Dashboard
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}