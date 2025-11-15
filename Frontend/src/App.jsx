// App.jsx
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  useAuth,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from '@clerk/clerk-react';

// 🏠 Public pages
import { Home } from './pages/Home';
import { SelectRole } from './pages/SelectRole';

// 👨‍⚕️ Doctor pages
import { DoctorDashboard } from './pages/Doctor/DoctorDashboard';
import { DoctorProfileEditor } from './pages/Doctor/DoctorProfileEditor';
import { DoctorLanding } from './pages/Doctor/DoctorLanding';
import { DoctorPanelShell } from './components/UI/Doctor/DoctorPanelShell';
import { CreateDoctorForm } from './pages/Doctor/CreateDoctorForm';
import { DoctorProfileView } from './pages/Doctor/DoctorProfileView';

// 🧑‍🎓 Patient pages
import { DoctorList } from './pages/Patient/DoctorList';
import { BookAppointment } from './pages/Patient/BookAppointment';
import { Appointments } from './pages/Patient/Appointments';

// 🧑‍💼 Admin pages
import { AdminPanel } from './pages/Admin/AdminPanel';
import { PatientAppointments } from './pages/Admin/PatientAppointments';

// ✅ Backend role API (fixed import to match exported usersAPI)
import { usersAPI } from './api/usersAPI';

// ─────────────────────────────────────────────────────────────────────────────
// Guard: render-only protection (no redirects, no loops)
// - Shows a purple "Access denied" card when not allowed
// - Use allow={role?.toLowerCase() === 'someRole'} to gate routes
// ─────────────────────────────────────────────────────────────────────────────
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
          <h2 className="text-purple-700 text-xl font-semibold mb-2">Access denied</h2>
          <p className="text-gray-700">You don’t have permission to view this page.</p>
        </div>
      </div>
    );
  }
  return children;
}

// ─────────────────────────────────────────────────────────────────────────────
// Landing: decides what to render at "/"
// - Signed-out → Home
// - No role → SelectRole
// - Patient → DoctorList (patient landing)
// - Doctor → DoctorLanding (you can swap to DoctorDashboard if you prefer)
// - Admin → AdminPanel
// No Navigate here — pure render prevents loops
// ─────────────────────────────────────────────────────────────────────────────
function Landing({ isLoaded, user, role }) {
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-purple-600 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!user) return <Home />;
  if (!role) return <SelectRole />;

  const r = role.toLowerCase();

  if (r === 'patient') return <DoctorList />;
  if (r === 'doctor') return <DoctorLanding />;
  if (r === 'admin') return <AdminPanel role={role} />;

  return <SelectRole />;
}

export function App() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [role, setRole] = useState(null);

  // 🔄 Fetch role once when authenticated and role not yet known (no redirects here)
  useEffect(() => {
    if (!isLoaded || !user || role !== null) return;

    (async () => {
      try {
        const token = await getToken();
        console.log('[App] token present?', !!token, 'API base:', import.meta.env.VITE_API_URL);

        // 1) Try backend role
        let fetchedRole = null;
        if (typeof usersAPI !== 'undefined' && usersAPI?.getRole) {
          fetchedRole = await usersAPI.getRole(user.id, token);
        }

        // 2) Fallback to Clerk metadata if backend returns nothing
        if (!fetchedRole) {
          fetchedRole = user.publicMetadata?.role || null;
        }

        console.log('Fetched role from backend:', fetchedRole);
        setRole(fetchedRole || null);

        // Optional sync (safe, no navigation)
        if (typeof usersAPI !== 'undefined' && usersAPI?.sync) {
          try {
            await usersAPI.sync(user, token);
          } catch (syncErr) {
            console.warn('Sync failed, continuing:', syncErr);
          }
        }
      } catch (err) {
        console.error('❌ Failed to fetch role:', err);
        setRole(user.publicMetadata?.role || null);
      }
    })();
  }, [isLoaded, user, role, getToken]);

  return (
    <div className="bg-white min-h-screen">
      {/* 🔐 Header for signed-in users (purple accent) */}
      <SignedIn>
        <div className="flex justify-end p-4">
          <UserButton
            appearance={{
              elements: { avatarBox: 'ring-2 ring-purple-600' },
            }}
          />
        </div>
      </SignedIn>

      {/* 🔐 Sign-in page (purple + white) */}
      <SignedOut>
        <div className="flex justify-center items-center h-screen bg-white">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <SignIn
              redirectUrl="/"
              appearance={{
                elements: {
                  card: 'bg-white shadow-none',
                  headerTitle: 'text-purple-600 text-2xl font-bold',
                  formFieldInput: 'border border-purple-300 rounded px-3 py-2',
                  footerActionText: 'text-gray-700',
                  socialButtonsBlockButton: 'bg-purple-600 text-white hover:bg-purple-700',
                  formButtonPrimary: 'bg-purple-600 text-white hover:bg-purple-700',
                },
              }}
            />
          </div>
        </div>
      </SignedOut>

      {/* 📌 Routes (render-only, no Navigate in effects) */}
      <Routes>
        <Route path="/" element={<Landing isLoaded={isLoaded} user={user} role={role} />} />
        <Route path="/select-role" element={<SelectRole />} />

        {/* 👨‍⚕️ Doctor routes */}
        <Route
          path="/doctor/*"
          element={
            <Guard allow={role ? role.toLowerCase() === 'doctor' : undefined}>
              <DoctorPanelShell />
            </Guard>
          }
        >
          <Route index element={<DoctorLanding />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="create" element={<CreateDoctorForm />} />
          <Route path="profile" element={<DoctorProfileEditor />} />
          <Route path="view/:id" element={<DoctorProfileView />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <Guard allow={role ? role.toLowerCase() === 'doctor' : undefined}>
              <DoctorDashboard />
            </Guard>
          }
        />

        <Route
          path="/doctor/profile"
          element={
            <Guard allow={role ? role.toLowerCase() === 'doctor' : undefined}>
              <DoctorProfileEditor />
            </Guard>
          }
        />

        {/* 🧑‍🎓 Patient routes */}
        <Route
          path="/doctors"
          element={
            <Guard allow={role ? role.toLowerCase() === 'patient' : undefined}>
              <DoctorList />
            </Guard>
          }
        />
        <Route
          path="/appointments/:doctorId"
          element={
            <Guard allow={role ? role.toLowerCase() === 'patient' : undefined}>
              <BookAppointment />
            </Guard>
          }
        />
        <Route
          path="/appointments"
          element={
            <Guard allow={role ? role.toLowerCase() === 'patient' : undefined}>
              <Appointments />
            </Guard>
          }
        />

        {/* 🧑‍💼 Admin routes */}
        <Route
          path="/admin"
          element={
            <Guard allow={role ? role.toLowerCase() === 'admin' : undefined}>
              <AdminPanel role={role} />
            </Guard>
          }
        />
        <Route
          path="/admin/patient/:id/appointments"
          element={
            <Guard allow={role ? role.toLowerCase() === 'admin' : undefined}>
              <PatientAppointments />
            </Guard>
          }
        />
      </Routes>
    </div>
  );
}