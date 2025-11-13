// 📦 React & Router imports
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth, SignedIn, SignedOut, SignIn, UserButton, useUser, } from '@clerk/clerk-react';

// 🧩 Page components
import { Home } from './pages/Home';
import { DoctorList } from './pages/DoctorList';
import { BookAppointment } from './pages/BookAppointment';
import { Appointments } from './pages/Appointments';
import { SelectRole } from './pages/SelectRole';
import { AdminPanel } from './pages/AdminPanel';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { PatientAppointments } from './pages/PatientAppointments';

// 🔧 API utility
import { UsersAPI } from './api/UsersAPI';

export function App() {
  // 🧠 Clerk user context
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  // 🚦 Navigation and location hooks
  const navigate = useNavigate();
  const location = useLocation();

  // 🧭 Role state (admin, doctor, patient)
  const [role, setRole] = useState(null);

  // 🔄 Sync Clerk user to DB and fetch their role
  useEffect(() => {
    async function syncAndFetchRole() {
      try {
        const token = await getToken();
        await UsersAPI.sync(user, token);
        const fetchedRole = await UsersAPI.getRole(user.id, token);
        setRole(fetchedRole);

        if (!fetchedRole && location.pathname === '/') {
          navigate('/select-role');
        }
      } catch (err) {
        console.error('❌ Failed to sync/fetch role:', err);
      }
    }

    if (isLoaded && user && role === null) {
      syncAndFetchRole();
    }
  }, [isLoaded, user, role, navigate, location.pathname, getToken]);

  // 🧭 Redirect users to their dashboard based on role
  useEffect(() => {
    if (isLoaded && user && role && location.pathname === '/') {
      if (role === 'patient') {
        navigate('/doctors');
      } else if (role === 'doctor') {
        navigate('/dashboard');
      } else if (role === 'admin') {
        navigate('/admin');
      }
    }
  }, [isLoaded, user, role, location.pathname, navigate]);

  return (
    <div>
      {/* 👤 Show user avatar when signed in */}
      <SignedIn>
        <div className="flex justify-end p-4">
          <UserButton />
        </div>
      </SignedIn>

      {/* 🗺️ Define application routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/appointments/:doctorId" element={<BookAppointment />} />
        <Route
          path="/appointments"
          element={
            <>
              <SignedIn>
                <Appointments />
              </SignedIn>
              <SignedOut>
                <div className="max-w-md mx-auto mt-20">
                  <SignIn redirectUrl="/appointments" />
                </div>
              </SignedOut>
            </>
          }
        />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/dashboard" element={<DoctorDashboard role={role} />} />
        <Route path="/admin" element={<AdminPanel role={role} />} />
        <Route
          path="/admin/patient/:id/appointments"
          element={<PatientAppointments />}
        />
      </Routes>
    </div>
  );
}
