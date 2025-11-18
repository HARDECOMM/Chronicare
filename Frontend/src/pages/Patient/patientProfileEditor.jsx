import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/shared/FormField";
import { Button } from "@/components/ui/button";
import { NotificationToast } from "@/components/ui/shared/NotificationToast";

export function PatientProfileEditor() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    gender: "",
  });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    console.log("Saving profile:", form);
    setShowToast(true);
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-purple-700">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Name" name="name" value={form.name} onChange={handleChange} />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <FormField label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
        <FormField label="Gender" name="gender" type="select" value={form.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
        <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={handleSave}>
          Save Changes
        </Button>
      </CardContent>
      {showToast && (
        <NotificationToast
          title="Profile Updated"
          description="Your profile changes have been saved successfully."
          variant="success"
        />
      )}
    </Card>
  );
}
