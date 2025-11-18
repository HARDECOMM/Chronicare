import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/shared/PageHeader";
import { AppointmentTable } from "@/components/ui/shared/AppointmentTable";
import { EmptyState } from "@/components/ui/shared/EmptyState";

export function AdminAppointments() {
  const appointments = [
    { date: "2025-11-20", patient: "John Doe", doctor: "Dr. Smith", status: "Confirmed" },
    { date: "2025-11-22", patient: "Jane Smith", doctor: "Dr. Adams", status: "Pending" },
  ];

  const columns = [
    { key: "date", label: "Date" },
    { key: "patient", label: "Patient" },
    { key: "doctor", label: "Doctor" },
    { key: "status", label: "Status", type: "status" },
  ];

  const actions = [
    { label: "View", onClick: (appt) => console.log("View", appt) },
    { label: "Edit", onClick: (appt) => console.log("Edit", appt) },
    { label: "Cancel", variant: "destructive", onClick: (appt) => console.log("Cancel", appt) },
  ];

  return (
    <Card>
      <PageHeader
        title="Manage Appointments"
        actions={[{ label: "Add Appointment", onClick: () => console.log("Add appointment") }]}
      />
      <CardContent>
        {appointments.length > 0 ? (
          <AppointmentTable appointments={appointments} columns={columns} actions={actions} />
        ) : (
          <EmptyState
            title="No Appointments Found"
            description="There are currently no appointments scheduled."
            action={{ label: "Add Appointment", onClick: () => console.log("Add appointment") }}
          />
        )}
      </CardContent>
    </Card>
  );
}
