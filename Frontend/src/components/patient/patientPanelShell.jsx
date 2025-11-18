import { Outlet } from "react-router-dom";
import { LayoutShell } from "@/components/ui/shared/LayoutShell";
import { SidebarNav } from "@/components/ui/shared/SidebarNav";

export function PatientPanelShell() {
  const links = [
    { to: "/patient/dashboard", label: "Dashboard" },
    { to: "/patient/profile", label: "Profile" },
    { to: "/patient/appointments", label: "Appointments" },
  ];

  const actions = [
    { label: "Logout", onClick: () => console.log("Patient logout") },
  ];

  return (
    <LayoutShell
      sidebar={<SidebarNav title="Patient Panel" links={links} actions={actions} />}
    >
      <Outlet />
    </LayoutShell>
  );
}
