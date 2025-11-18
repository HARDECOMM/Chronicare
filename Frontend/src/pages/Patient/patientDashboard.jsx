import { StatsCard } from "@/components/ui/statsCard";
import { ProfileCard } from "@/components/ui/profileCard";

export function PatientDashboard() {
  const stats = {
    upcomingAppointments: 3,
    completedAppointments: 12,
  };

  const profile = {
    name: "John Doe",
    email: "john@example.com",
    dateOfBirth: "1990-05-15",
    gender: "Male",
  };

  const fields = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "dateOfBirth", label: "Date of Birth" },
    { key: "gender", label: "Gender", type: "badge" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatsCard title="Upcoming Appointments" value={stats.upcomingAppointments} />
        <StatsCard title="Completed Appointments" value={stats.completedAppointments} />
      </div>
      <ProfileCard title="Profile Summary" profile={profile} fields={fields} />
    </div>
  );
}
