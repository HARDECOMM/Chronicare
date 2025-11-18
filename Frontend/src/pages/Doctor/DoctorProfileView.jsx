// pages/doctor/DoctorProfileView.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";

export function DoctorProfileView() {
  const { id } = useParams(); // doctor id from route
  // Example static data — replace with API call using id
  const doctor = {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    email: "sarah.johnson@example.com",
    experience: "10 years",
    clinic: "City Hospital",
    status: "Active",
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-purple-700">Doctor Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Name:</strong> {doctor.name}</p>
        <p><strong>Specialty:</strong> {doctor.specialty}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Experience:</strong> {doctor.experience}</p>
        <p><strong>Clinic:</strong> {doctor.clinic}</p>
        <p>
          <strong>Status:</strong>{" "}
          <Badge variant="default" className="capitalize">
            {doctor.status}
          </Badge>
        </p>
      </CardContent>
    </Card>
  );
}
