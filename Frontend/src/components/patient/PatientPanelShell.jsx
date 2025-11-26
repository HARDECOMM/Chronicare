import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export function PatientPanelShell() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const linkBase = "px-4 py-2 rounded text-sm font-medium transition-colors";
  const active = "bg-purple-600 text-white";
  const idle = "text-purple-700 hover:bg-purple-50";

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-purple-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-700">Patient Portal</h1>
          <nav className="flex gap-4 items-center">
            <NavLink
              to="/patient"
              end
              className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/patient/profile"
              className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
            >
              Profile
            </NavLink>

            <NavLink
              to="/patient/appointments"
              className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
            >
              Appointments
            </NavLink>

            {/* Book Appointment button — now green */}
            <NavLink
              to="/patient/appointments/book"
              className="px-4 py-2 rounded text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition"
            >
              Book Appointment
            </NavLink>

            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded bg-red-500 text-white text-sm font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
