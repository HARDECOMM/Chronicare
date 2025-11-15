import React from 'react';
import { Outlet } from 'react-router-dom';
import { DoctorSidebar } from './DoctorSidebar';

export function DoctorPanelShell() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />
      <main className="flex-1 ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
}
