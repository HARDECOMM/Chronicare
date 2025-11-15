import { NavLink } from 'react-router-dom';

export function DoctorSidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-6 fixed left-0 top-0">
      <h2 className="text-xl font-bold mb-6">Doctor Panel</h2>
      <nav className="space-y-4">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-green-700 font-semibold' : 'text-gray-700'}>
          🗓 Appointments
        </NavLink>
        <NavLink to="/doctor/profile" className={({ isActive }) => isActive ? 'text-green-700 font-semibold' : 'text-gray-700'}>
          👤 Edit Profile
        </NavLink>
      </nav>
    </aside>
  );
}
