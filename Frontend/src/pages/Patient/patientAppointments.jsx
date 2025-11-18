import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/shared/PageHeader";
import { AppointmentTable } from "@/components/ui/shared/AppointmentTable";
import { EmptyState } from "@/components/ui/shared/EmptyState";
import { LoadingSpinner } from "@/components/ui/shared/LoadingSpinner";

export function PatientAppointments() {
  const loading = false;
  const appointments = [];

  const columns = [
    { key: "date", label: "Date" },
    { key: "doctor", label: "Doctor" },
    { key: "status", label: "Status", type: "status" },
  ];

  return (
    <Card>
      <PageHeader
        title="My Appointments"
        actions={[{ label: "Book New", onClick: () => console.log("Book new appointment") }]}
      />
      <CardContent>
        {loading ? (
          <LoadingSpinner message="Fetching your appointments..." />
        ) : appointments.length > 0 ? (
          <AppointmentTable appointments={appointments} columns={columns} />
        ) : (
          <EmptyState
            title="No Appointments Found"
            description="You don’t have any upcoming appointments."
            action={{ label: "Book Appointment", onClick: () => console.log("Book appointment") }}
          />
        )}
      </CardContent>
    </Card>
  );
}
