import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/shared/PageHeader";
import { AppointmentTable } from "@/components/ui/shared/AppointmentTable";

export function DoctorAppointments() {
  const appointments = [
    { date: "2025-11-20", patient: "John Doe", status: "Confirmed" },
    { date: "2025-11-22", patient: "Jane Smith", status: "Pending" },
  ];

  const columns = [
    { key: "date", label: "Date" },
    { key: "patient", label: "Patient" },
    { key: "status", label: "Status", type: "status" },
  ];

  return (
    <Card>
      <PageHeader title="My Appointments" />
      <CardContent>
        <AppointmentTable appointments={appointments} columns={columns} />
      </CardContent>
    </Card>
  );
}
