import { StatsCard } from "@/components/ui/statsCard";
import { ProfileCard } from "@/components/ui/profileCard";

export function DoctorDashboard() {
  const stats = { todayAppointments: 5, totalPatients: 200 };

  const profile = {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    email: "sarah.johnson@example.com",
    experience: "10 years",
    clinic: "City Hospital",
  };

  const fields = [
    { key: "name", label: "Name" },
    { key: "specialty", label: "Specialty" },
    { key: "email", label: "Email" },
    { key: "experience", label: "Experience" },
    { key: "clinic", label: "Clinic" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatsCard title="Today's Appointments" value={stats.todayAppointments} />
        <StatsCard title="Total Patients" value={stats.totalPatients} />
      </div>
      <ProfileCard title="Profile Summary" profile={profile} fields={fields} />
    </div>
  );
}
