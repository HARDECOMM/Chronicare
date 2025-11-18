import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useAuth,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

// 🏠 Pages
import { SelectRole } from "./components/roleBase/SelectRole";
import { Landing } from "./components/roleBase/Landing";

// 👨‍⚕️ Doctor pages
import { DoctorPanelShell } from "./components/doctor/DoctorPanelShell";
import { DoctorDashboard } from "./pages/doctor/DoctorDashboard";
import { DoctorProfileEditor } from "./pages/doctor/DoctorProfileEditor";
import { DoctorAppointments } from "./pages/doctor/DoctorAppointments";
import { DoctorProfileView } from "./pages/doctor/DoctorProfileView";

// 👩‍⚕️ Patient pages
import { PatientPanelShell } from "./components/patient/PatientPanelShell";
import { PatientDashboard } from "./pages/patient/PatientDashboard";
import { PatientProfileEditor } from "./pages/patient/PatientProfileEditor";
import { PatientAppointments } from "./pages/patient/PatientAppointments";

// 🛠 Admin pages
import { AdminPanelShell } from "./components/admin/adminPanel";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminDoctors } from "./pages/admin/AdminDoctors";
import { AdminAppointments } from "./pages/admin/AdminAppointment";

// ✅ Backend API
import { usersAPI } from "./api/usersAPI";

// 🎯 Redirect logic
import { getRedirectUrlForRole } from "./components/roleBase/getRedirectUrl";

// 🔒 Guard
function Guard({ allow, children }) {
  if (allow === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-purple-600 text-lg font-semibold">Loading...</p>
      </div>
    );
  }
  if (!allow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full bg-white p-6 rounded border border-purple-300">
          <h2 className="text-purple-700 text-xl font-semibold mb-2">
            Access denied
          </h2>
          <p className="text-gray-700">
            You don’t have permission to view this page.
          </p>
        </div>
      </div>
    );
  }
  return children;
}

// 🔒 RequireRole wrapper — now uses backend role state
function RequireRole({ requiredRole, currentRole, children }) {
  if (currentRole === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-purple-600 text-lg font-semibold">Loading...</p>
      </div>
    );
  }
  return <Guard allow={currentRole?.toLowerCase() === requiredRole.toLowerCase()}>{children}</Guard>;
}

export function App() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user || role !== null) return;

    (async () => {
      try {
        const token = await getToken();

        // Sync user into backend
        await usersAPI.sync(user, token);

        // Fetch role from backend
        let fetchedRole = null;
        try {
          const res = await usersAPI.getRole(user.id, token);
          fetchedRole = res?.role;
        } catch (err) {
          console.warn("Role fetch failed, falling back:", err);
        }

        setRole(fetchedRole || null);
      } catch (err) {
        console.error("❌ Failed to fetch role:", err);
        setRole(null);
      }
    })();
  }, [isLoaded, user, role, getToken]);

  return (
    <div className="bg-white min-h-screen">
      <SignedIn>
        <div className="flex justify-end p-4">
          <UserButton
            appearance={{
              elements: { avatarBox: "ring-2 ring-purple-600" },
            }}
          />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex justify-center items-center h-screen bg-white">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <SignIn
              forceRedirectUrl={getRedirectUrlForRole(role)}
              appearance={{
                elements: {
                  card: "bg-white shadow-none",
                  headerTitle: "text-purple-600 text-2xl font-bold",
                  formFieldInput:
                    "border border-purple-300 rounded px-3 py-2",
                  footerActionText: "text-gray-700",
                  socialButtonsBlockButton:
                    "bg-purple-600 text-white hover:bg-purple-700",
                  formButtonPrimary:
                    "bg-purple-600 text-white hover:bg-purple-700",
                },
              }}
            />
          </div>
        </div>
      </SignedOut>

      <Routes>
        <Route path="/" element={<Landing isLoaded={isLoaded} user={user} role={role} />} />
        <Route path="/select-role" element={<SelectRole setRole={setRole} />} />

        {/* Patient routes */}
        <Route
          path="/patient/*"
          element={
            <RequireRole requiredRole="patient" currentRole={role}>
              <PatientPanelShell />
            </RequireRole>
          }
        >
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="profile" element={<PatientProfileEditor />} />
          <Route path="appointments" element={<PatientAppointments />} />
        </Route>

        {/* Doctor routes */}
        <Route
          path="/doctor/*"
          element={
            <RequireRole requiredRole="doctor" currentRole={role}>
              <DoctorPanelShell />
            </RequireRole>
          }
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="edit" element={<DoctorProfileEditor />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="view/:id" element={<DoctorProfileView />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <RequireRole requiredRole="admin" currentRole={role}>
              <AdminPanelShell />
            </RequireRole>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="appointments" element={<AdminAppointments />} />
        </Route>
      </Routes>
    </div>
  );
}
