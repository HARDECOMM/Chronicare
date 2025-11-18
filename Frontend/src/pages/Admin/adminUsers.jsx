import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/shared/PageHeader";
import { UserTable } from "@/components/ui/shared/userTable";
import { ModalDialog } from "@/components/ui/shared/ModalDialog";
import { NotificationToast } from "@/components/ui/shared/NotificationToast";
import { EmptyState } from "@/components/ui/shared/EmptyState";

export function AdminUsers() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const users = [
    { name: "John Doe", role: "patient", email: "john@example.com", status: "Active" },
    { name: "Dr. Smith", role: "doctor", email: "smith@example.com", status: "Active" },
  ];

  const columns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role", type: "role" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status", type: "status" },
  ];

  const actions = [
    {
      label: "Delete",
      variant: "destructive",
      onClick: (user) => {
        setSelectedUser(user);
        setOpen(true);
      },
    },
  ];

  return (
    <Card>
      <PageHeader
        title="Manage Users"
        actions={[{ label: "Add User", onClick: () => console.log("Add user") }]}
      />
      <CardContent>
        {users.length > 0 ? (
          <UserTable users={users} columns={columns} actions={actions} />
        ) : (
          <EmptyState
            title="No Users Found"
            description="There are currently no users in the system."
            action={{ label: "Add User", onClick: () => console.log("Add user") }}
          />
        )}
      </CardContent>

      <ModalDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          console.log("Deleting user:", selectedUser);
          setOpen(false);
          setShowToast(true);
        }}
        onCancel={() => setOpen(false)}
      />

      {showToast && (
        <NotificationToast
          title="User Deleted"
          description="The selected user has been removed."
          variant="destructive"
        />
      )}
    </Card>
  );
}
