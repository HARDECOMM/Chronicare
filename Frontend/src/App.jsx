import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  useAuth,
  SignedIn,
  SignIn,
  SignUp,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import { SelectRole } from "./components/roleBase/SelectRole";
import { Landing } from "./components/roleBase/Landing";

import { DoctorPanelShell } from "./components/doctor/DoctorPanelShell";
import { DoctorDashboard } from "./pages/doctor/DoctorDashboard";
import { DoctorProfileEditor } from "./pages/doctor/DoctorProfileEditor";
import { DoctorAppointments } from "./pages/doctor/DoctorAppointments";
import { DoctorProfileView } from "./pages/doctor/DoctorProfileView";
import { DoctorCreate } from "./pages/doctor/DoctorCreate";

import { PatientPanelShell } from "./components/patient/PatientPanelShell";
import { PatientDashboard } from "./pages/Patient/PatientDashboard";
import { PatientProfileEditor } from "./pages/Patient/PatientProfileEditor";
import { PatientProfileView } from "./pages/Patient/PatientProfileView"; 
import { PatientAppointments } from "./pages/Patient/PatientAppointment";
import { BookAppointment } from "./pages/Patient/BookAppointment";
import { PatientCreate } from "./pages/Patient/PatientCreate";

import { usersAPI } from "./api/usersAPI";
import { doctorsAPI } from "./api/doctorAPI";
import { patientsAPI } from "./api/patientAPI";

function RequireRole({ requiredRole, currentRole, children }) {
  if (currentRole === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-600"></div>
        <p className="ml-4 text-purple-600 text-lg font-semibold">Loading role...</p>
      </div>
    );
  }
  if (currentRole === null) return null;
  if (currentRole?.toLowerCase() !== requiredRole.toLowerCase()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full bg-white p-6 rounded border border-purple-300">
          <h2 className="text-purple-700 text-xl font-semibold mb-2">Access denied</h2>
          <p className="text-gray-700">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }
  return children;
}

export function App() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [role, setRole] = useState(undefined);
  const [hasDoctorProfile, setHasDoctorProfile] = useState(undefined);
  const [hasPatientProfile, setHasPatientProfile] = useState(undefined);

  const initOnceRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialization: sync user, fetch role/profile
  useEffect(() => {
    if (!isLoaded || !user || initOnceRef.current) return;
    initOnceRef.current = true;

    (async () => {
      try {
        const token = await getToken();
        await usersAPI.sync(user, token);

        const roleRes = await usersAPI.getRole(user.id, token).catch(() => ({ role: null }));
        const fetchedRole = roleRes?.role ?? null;
        setRole(fetchedRole);

        if (fetchedRole === "doctor") {
          const docRes = await doctorsAPI.getMyProfile(token).catch(() => ({ profile: null }));
          setHasDoctorProfile(!!docRes?.profile);
        }

        if (fetchedRole === "patient") {
          const patRes = await patientsAPI.getMyProfile(token).catch(() => ({ profile: null }));
          setHasPatientProfile(!!patRes?.profile);
        }
      } catch (err) {
        console.error("Failed to initialize user role/profile:", err);
        setRole(null);
        setHasDoctorProfile(false);
        setHasPatientProfile(false);
      }
    })();
  }, [isLoaded, user, getToken]);

  // Redirect effect (centralized here)
  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      if (location.pathname.startsWith("/doctor") || location.pathname.startsWith("/patient")) {
        navigate("/", { replace: true });
      }
      return;
    }

    if (role === undefined) return;

    if (role === null) {
      if (!location.pathname.startsWith("/select-role")) {
        navigate("/select-role", { replace: true });
      }
      return;
    }

    if (role === "doctor") {
      if (hasDoctorProfile === undefined) return;
      const target = hasDoctorProfile ? "/doctor" : "/doctor/create";
      if (!location.pathname.startsWith("/doctor")) {
        navigate(target, { replace: true });
      }
      return;
    }

    if (role === "patient") {
      if (hasPatientProfile === undefined) return;
      const target = hasPatientProfile ? "/patient" : "/patient/create";
      if (!location.pathname.startsWith("/patient")) {
        navigate(target, { replace: true });
      }
      return;
    }
  }, [isLoaded, user, role, hasDoctorProfile, hasPatientProfile, navigate, location.pathname]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-600"></div>
        <p className="ml-4 text-purple-600 text-lg font-semibold">Loading account...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <SignedIn>
        <div className="flex justify-end p-4">
          <UserButton appearance={{ elements: { avatarBox: "ring-2 ring-purple-600" } }} />
        </div>
      </SignedIn>

      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing isLoaded={isLoaded} user={user} role={role} />} />

        {/* Role selection */}
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
          <Route index element={<PatientDashboard />} />
          <Route path="profile" element={<PatientProfileView />} />   {/* ✅ view */}
          <Route path="edit" element={<PatientProfileEditor />} />    {/* ✅ editor */}
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="appointments/book" element={<BookAppointment />} />
        </Route>

        {/* Patient profile creation */}
        <Route
          path="/patient/create"
          element={
            <RequireRole requiredRole="patient" currentRole={role}>
              {!hasPatientProfile ? (
                <PatientCreate setHasPatientProfile={setHasPatientProfile} />
              ) : (
                <PatientDashboard />
              )}
            </RequireRole>
          }
        />

        {/* Doctor routes */}
        <Route
          path="/doctor/*"
          element={
            <RequireRole requiredRole="doctor" currentRole={role}>
              <DoctorPanelShell />
            </RequireRole>
          }
        >
          <Route index element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="edit" element={<DoctorProfileEditor />} />
          <Route path="view" element={<DoctorProfileView />} />
        </Route>

        {/* Doctor profile creation */}
        <Route
          path="/doctor/create"
          element={
            <RequireRole requiredRole="doctor" currentRole={role}>
              {!hasDoctorProfile ? (
                <DoctorCreate setHasDoctorProfile={setHasDoctorProfile} />
              ) : (
                <DoctorDashboard />
              )}
            </RequireRole>
          }
        />

        {/* Clerk auth routes */}
        <Route
          path="/sign-in"
          element={
            <div className="flex items-center justify-center min-h-screen bg-white">
              <SignIn />
            </div>
          }
        />
        <Route
          path="/sign-up"
          element={
            <div className="flex items-center justify-center min-h-screen bg-white">
              <SignUp />
            </div>
          }
        />
      </Routes>
    </div>
  );
}