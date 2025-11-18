import { Outlet } from "react-router-dom";
import { LayoutShell } from "@/components/ui/shared/LayoutShell";
import { SidebarNav } from "@/components/ui/shared/SidebarNav";

export function DoctorPanelShell() {
  const links = [
    { to: "/doctor/dashboard", label: "Dashboard" },
    { to: "/doctor/edit", label: "Edit Profile" },
    { to: "/doctor/appointments", label: "Appointments" },
  ];

  const actions = [
    { label: "Logout", onClick: () => console.log("Doctor logout") },
  ];

  return (
    <LayoutShell
      sidebar={<SidebarNav title="Doctor Panel" links={links} actions={actions} />}
    >
      <Outlet />
    </LayoutShell>
  );
}
