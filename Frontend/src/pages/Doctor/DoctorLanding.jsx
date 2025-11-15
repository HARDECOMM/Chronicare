import { DoctorSidebar } from '../../components/UI/DoctorSidebar';

export function DoctorLanding() {
  return (
    <div className="flex">
      <DoctorSidebar />
      <main className="ml-64 p-6 w-full min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Welcome, Doctor!</h1>
        <p className="text-gray-600 mb-6">
          Use the sidebar to manage your appointments and profile. Stay organized and keep your patients informed.
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>🗓 View and manage appointments</li>
          <li>👤 Edit your profile and availability</li>
        </ul>
      </main>
    </div>
  );
}
