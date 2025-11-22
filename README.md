# Chronicare - Doctor Side Documentation (End-to-End)

**Capstone Project for PLP ACADEMY**

This document covers the Doctor side functionalities in the Chronicare application, built with the MERN stack. It outlines the core components, user flows, and API integrations to support doctor authentication, profile management, navigation, and appointment handling. Further updates will expand other roles and features.

---

## 1. Authentication & Role Management

- **Authentication** is handled by Clerk, supporting SignIn, SignUp, and user session management via UserButton.
- After login, the app uses `usersAPI.getRole` to determine if the user is a doctor or patient.
- **Redirect logic** (in `App.jsx`) governs navigation based on role and profile existence:
  - No role → redirects to `/select-role`
  - Doctor with profile → `/doctor`
  - Doctor without profile → `/doctor/create`

---

## 2. Doctor Panel Shell (`DoctorPanelShell.jsx`)

- Provides page layout and navigation for doctor-specific routes:
  - Dashboard
  - Appointments
  - Edit Profile
  - View Profile
  - Logout
- Logout calls Clerk’s `signOut()` and redirects to the landing (`/`) page.
- No internal redirect logic in the shell itself to avoid UI flickering.

---

## 3. Doctor Routes (defined in `App.jsx`)

| Route                | Description                   |
|----------------------|-------------------------------|
| `/doctor`            | DoctorDashboard               |
| `/doctor/appointments`| DoctorAppointments            |
| `/doctor/edit`       | DoctorProfileEditor           |
| `/doctor/view`       | DoctorProfileView             |
| `/doctor/create`     | DoctorCreate (if no profile)  |

---

## 4. Doctor Profile Management

### DoctorProfileEditor.jsx
- Loads existing profile via `doctorsAPI.getMyProfile()`.
- Editable fields include:
  - Name, specialty, license number, location
  - Years of experience
  - Languages spoken
  - Bio
  - Contact info (phone, email, address)
  - Profile image
- Save updates via `doctorsAPI.updateMyProfile(payload)`.
- Shows success toast and redirects to `/doctor/view`.

### DoctorProfileView.jsx
- Displays doctor’s profile details in read-only mode for verification.

### DoctorCreate.jsx
- Used for initial profile creation by doctors without an existing profile.
- After saving, sets `hasDoctorProfile = true` and redirects to the dashboard.

---

## 5. Doctor Dashboard (`DoctorDashboard.jsx`)

- Provides an overview including quick stats:
  - Number of appointments
  - Number of patients
  - Links to profile and appointments

---

## 6. Doctor Appointments (`DoctorAppointments.jsx`)

- Shows a list of patient-booked appointments, each with:
  - Patient name
  - Date/time
  - Reason/symptoms
  - Status (pending, confirmed, completed)
- Allows doctor to:
  - Accept or reject appointments
  - Add notes for patient communication
  - Mark appointments as completed

---

## 7. Doctor API Layer (`doctorsAPI.js`)

Handles backend calls with token-based authentication:
- `getMyProfile(token)`
- `updateMyProfile(payload, token)`
- `getAppointments(token)`
- `updateAppointmentStatus(id, status, token)`
- `addAppointmentNotes(id, notes, token)`

---

## 8. User Experience Flow (Doctor Side)

1. Doctor signs in → role checked → redirects to `/doctor`.
2. If no profile, redirected to `/doctor/create`.
3. Doctor fills profile → saved → redirected to dashboard.
4. Doctor navigates:
   - Dashboard: overview of stats
   - Appointments: manage bookings
   - Edit Profile: update info
   - View Profile: confirm details
5. Doctor logs out → redirected to landing page.

---

This documentation captures the full flow and structure for the Doctor side of Chronicare as it currently stands. Further updates will address additional features and other user roles.

---

*Developed as a capstone project for PLP ACADEMY using MERN stack technologies.*
