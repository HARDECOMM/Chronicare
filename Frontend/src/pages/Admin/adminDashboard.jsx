import { StatsCard } from "@/components/ui/statsCard";

export function AdminDashboard() {
  const stats = { users: 120, doctors: 25, patients: 95, appointments: 40 };

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatsCard title="Users" value={stats.users} />
      <StatsCard title="Doctors" value={stats.doctors} />
      <StatsCard title="Patients" value={stats.patients} />
      <StatsCard title="Appointments" value={stats.appointments} />
    </div>
  );
}
