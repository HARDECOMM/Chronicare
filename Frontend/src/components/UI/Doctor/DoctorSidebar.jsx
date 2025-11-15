import React from 'react';
import { NavLink } from 'react-router-dom';

export function DoctorSidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-6 fixed left-0 top-0">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">Doctor Panel</h2>
      <nav className="space-y-4">
        <NavLink
          to="/doctor/dashboard"
          className={({ isActive }) => (isActive ? 'text-purple-700 font-semibold' : 'text-gray-700')}
          end
        >
          🗓 Appointments
        </NavLink>

        <NavLink
          to="/doctor/profile"
          className={({ isActive }) => (isActive ? 'text-purple-700 font-semibold' : 'text-gray-700')}
        >
          👤 Edit Profile
        </NavLink>

        <NavLink
          to="/doctor/create"
          className={({ isActive }) => (isActive ? 'text-purple-700 font-semibold' : 'text-gray-700')}
        >
          ➕ Create Profile
        </NavLink>
      </nav>
    </aside>
  );
}
