import { Outlet } from "react-router-dom";
import { LayoutShell } from "@/components/ui/shared/LayoutShell";
import { SidebarNav } from "@/components/ui/shared/SidebarNav";

export function AdminPanelShell() {
  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/doctors", label: "Doctors" },
    { to: "/admin/appointments", label: "Appointments" },
  ];

  const actions = [
    { label: "Logout", onClick: () => console.log("Admin logout") },
  ];

  return (
    <LayoutShell
      sidebar={<SidebarNav title="Admin Panel" links={links} actions={actions} />}
    >
      <Outlet />
    </LayoutShell>
  );
}
