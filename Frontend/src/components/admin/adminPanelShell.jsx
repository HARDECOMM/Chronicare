// src/components/admin/AdminPanelShell.jsx
import { Outlet, NavLink } from "react-router-dom";

export function AdminPanelShell() {
  const linkBase = "px-3 py-2 rounded text-sm font-medium border border-transparent";
  const active = "bg-purple-600 text-white hover:bg-purple-700";
  const idle = "text-purple-700 hover:bg-purple-50 border-purple-200";

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-purple-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-700">Admin Portal</h1>
          <nav className="flex gap-2">
            <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Dashboard</NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Users</NavLink>
            <NavLink to="/admin/doctors" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Doctors</NavLink>
            <NavLink to="/admin/appointments" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Appointments</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
