import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/shared/FormField";
import { Button } from "@/components/ui/button";

export function DoctorProfileEditor() {
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    email: "",
    experience: "",
    clinic: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-purple-700">Edit Doctor Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Name" name="name" value={form.name} onChange={handleChange} />
        <FormField label="Specialty" name="specialty" value={form.specialty} onChange={handleChange} />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <FormField label="Experience" name="experience" value={form.experience} onChange={handleChange} />
        <FormField label="Clinic" name="clinic" value={form.clinic} onChange={handleChange} />
        <Button className="bg-purple-600 text-white hover:bg-purple-700">Save Changes</Button>
      </CardContent>
    </Card>
  );
}
