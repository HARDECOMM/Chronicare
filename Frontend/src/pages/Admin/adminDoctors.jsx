import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/shared/PageHeader";
import { UserTable } from "@/components/ui/shared/userTable";
import { EmptyState } from "@/components/ui/shared/EmptyState";

export function AdminDoctors() {
  const doctors = [
    { name: "Dr. Sarah Johnson", specialty: "Cardiology", email: "sarah@example.com", status: "Active" },
    { name: "Dr. Michael Brown", specialty: "Dermatology", email: "michael@example.com", status: "Inactive" },
  ];

  const columns = [
    { key: "name", label: "Name" },
    { key: "specialty", label: "Specialty" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status", type: "status" },
  ];

  const actions = [
    { label: "View", onClick: (doctor) => console.log("View", doctor) },
    { label: "Edit", onClick: (doctor) => console.log("Edit", doctor) },
    { label: "Deactivate", variant: "destructive", onClick: (doctor) => console.log("Deactivate", doctor) },
  ];

  return (
    <Card>
      <PageHeader
        title="Manage Doctors"
        actions={[{ label: "Add Doctor", onClick: () => console.log("Add doctor") }]}
      />
      <CardContent>
        {doctors.length > 0 ? (
          <UserTable users={doctors} columns={columns} actions={actions} />
        ) : (
          <EmptyState
            title="No Doctors Found"
            description="There are currently no doctors in the system."
            action={{ label: "Add Doctor", onClick: () => console.log("Add doctor") }}
          />
        )}
      </CardContent>
    </Card>
  );
}
