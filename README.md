# 🏥 Chronicare - Healthcare Management Platform

**Capstone Project for PLP ACADEMY**

A full-stack MERN application for managing doctor-patient appointments with role-based authentication, profile management, and real-time appointment handling.

---
live in vercel::::**https://chronicare.vercel.app/**
---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Environment Configuration](#environment-configuration)
6. [Database Models](#database-models)
7. [Authentication & Role Management](#authentication--role-management)
8. [API Documentation](#api-documentation)
9. [Doctor Panel Documentation](#doctor-panel-documentation)
10. [User Flows & Diagrams](#user-flows--diagrams)
11. [How to Run](#how-to-run)
12. [Key Features](#key-features)
13. [Troubleshooting](#troubleshooting)

---

## <u>Project Overview</u>

Chronicare is a comprehensive healthcare appointment management system that enables:
- **Doctors** to manage profiles, view appointments, communicate with patients, and track appointment statuses
- **Patients** to browse doctors, book appointments, and manage their bookings
- **Role-based access control** with Clerk authentication
- **Real-time appointment status updates** and communication
- **Secure token-based authentication** with session management

---

## <u>Tech Stack</u>

| Component | Technology |
|-----------|-----------|
| **Frontend** | React (Vite), Tailwind CSS, Shadcn UI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | Clerk |
| **API** | RESTful architecture |
| **Package Manager** | npm |

---

## <u>Project Structure</u>

```
chronicare/
├── Backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── appointmentController.js # Appointment logic
│   │   ├── doctorController.js      # Doctor operations
│   │   ├── patientController.js     # Patient operations
│   │   └── userController.js        # User role management
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   ├── models/
│   │   ├── user.js                  # User schema
│   │   ├── doctor.js                # Doctor schema
│   │   ├── patient.js               # Patient schema
│   │   └── appointment.js           # Appointment schema
│   ├── routes/
│   │   ├── appointmentRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── patientRoutes.js
│   │   └── userRoutes.js
│   ├── seed.js                      # Data seeding
│   ├── seedDoctor.js                # Doctor data seeding
│   ├── package.json
│   ├── .env
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DoctorPanelShell.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── DoctorAppointments.jsx
│   │   │   ├── DoctorProfileEditor.jsx
│   │   │   ├── DoctorProfileView.jsx
│   │   │   ├── DoctorCreate.jsx
│   │   │   └── ...other components
│   │   ├── api/
│   │   │   ├── doctorsAPI.js
│   │   │   ├── patientAPI.js
│   │   │   ├── appointmentAPI.js
│   │   │   └── usersAPI.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── .env
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## <u>Installation & Setup</u>

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Clerk account for authentication

### Step 1: Clone and Navigate
```bash
cd c:\Users\ademo\web-dev-project
```

### Step 2: Backend Setup
```bash
cd Backend
npm install
```

### Step 3: Frontend Setup
```bash
cd ../Frontend
npm install
```

---

## <u>Environment Configuration</u>

### Backend `.env`
```env
# filepath: Backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chronicare
PORT=5000
CLERK_WEBHOOK_SECRET=your_webhook_secret
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env`
```env
# filepath: Frontend/.env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

---

## <u>Database Models</u>

### User Model
```javascript
{
  clerkId: String (unique),
  email: String (unique),
  role: String (enum: ["doctor", "patient"]),
  hasDoctorProfile: Boolean,
  hasPatientProfile: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor Model
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  specialty: String,
  licenseNumber: String,
  yearsOfExperience: Number,
  location: String,
  languages: [String],
  bio: String,
  phone: String,
  email: String,
  address: String,
  profileImage: String (URL),
  isAvailable: Boolean,
  consultationFee: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Patient Model
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  age: Number,
  gender: String (enum: ["male", "female", "other"]),
  phone: String,
  email: String,
  medicalHistory: String,
  address: String,
  allergies: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  doctorId: ObjectId (ref: Doctor),
  patientId: ObjectId (ref: Patient),
  appointmentDate: Date,
  appointmentTime: String,
  reason: String,
  symptoms: String,
  status: String (enum: ["pending", "confirmed", "completed", "cancelled"]),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## <u>Authentication & Role Management</u>

### Overview
- **Authentication Provider**: Clerk (handles SignIn, SignUp, and session management)
- **User Session**: Managed via Clerk's UserButton component
- **Role Detection**: Uses `usersAPI.getRole()` to determine user type
- **Profile Management**: Tracks `hasDoctorProfile` and `hasPatientProfile` flags

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   USER AUTHENTICATION FLOW                   │
└─────────────────────────────────────────────────────────────┘

1. USER SIGNIN/SIGNUP (Clerk)
   ↓
2. CLERK RETURNS TOKEN & USER DATA
   ↓
3. FRONTEND STORES TOKEN (Clerk Session)
   ↓
4. CHECK USER ROLE (GET /api/users/role)
   ├─→ No Role → Redirect to /select-role
   └─→ Has Role → Continue
   ↓
5. CHECK PROFILE EXISTS
   ├─→ Doctor with Profile → /doctor
   ├─→ Doctor without Profile → /doctor/create
   ├─→ Patient with Profile → /patient
   └─→ Patient without Profile → /patient/create
   ↓
6. AUTHENTICATED & AUTHORIZED
```

### Redirect Logic (in `App.jsx`)
- **No Role**: Redirects to `/select-role`
- **Doctor + Profile**: Redirects to `/doctor`
- **Doctor + No Profile**: Redirects to `/doctor/create`
- **Patient + Profile**: Redirects to `/patient`
- **Patient + No Profile**: Redirects to `/patient/create`

---

## <u>API Documentation</u>

### Base URL
```
http://localhost:5000/api
```

### Authentication Header
All authenticated endpoints require:
```
Authorization: Bearer {clerkToken}
```

---

### **USER ENDPOINTS**

#### Get User Role
```
GET /users/role
Headers: Authorization: Bearer {token}
Response: { role: "doctor" | "patient" }
```

#### Set User Role
```
POST /users/role
Headers: Authorization: Bearer {token}
Body: { role: "doctor" | "patient" }
Response: { message: "Role set successfully" }
```

---

### **DOCTOR ENDPOINTS**

#### Get My Profile
```
GET /doctors/my-profile
Headers: Authorization: Bearer {token}
Response: { 
  _id, name, specialty, licenseNumber, yearsOfExperience, 
  location, languages, bio, phone, email, address, profileImage 
}
```

#### Create Doctor Profile
```
POST /doctors/create
Headers: Authorization: Bearer {token}
Body: {
  name: String,
  specialty: String,
  licenseNumber: String,
  yearsOfExperience: Number,
  location: String,
  languages: [String],
  bio: String,
  phone: String,
  email: String,
  address: String,
  profileImage: String
}
Response: { _id, ...profileData }
```

#### Update Doctor Profile
```
PUT /doctors/update
Headers: Authorization: Bearer {token}
Body: { ...updatedFields }
Response: { message: "Profile updated", data: {...} }
```

#### Get All Doctors
```
GET /doctors
Response: [{ _id, name, specialty, location, consultationFee, ... }]
```

#### Get Doctor by ID
```
GET /doctors/:id
Response: { _id, name, specialty, ... }
```

---

### **PATIENT ENDPOINTS**

#### Get My Profile
```
GET /patients/my-profile
Headers: Authorization: Bearer {token}
Response: { _id, name, age, gender, phone, email, medicalHistory, ... }
```

#### Create Patient Profile
```
POST /patients/create
Headers: Authorization: Bearer {token}
Body: {
  name: String,
  age: Number,
  gender: String,
  phone: String,
  email: String,
  medicalHistory: String,
  address: String,
  allergies: [String]
}
Response: { _id, ...profileData }
```

#### Update Patient Profile
```
PUT /patients/update
Headers: Authorization: Bearer {token}
Body: { ...updatedFields }
Response: { message: "Profile updated", data: {...} }
```

---

### **APPOINTMENT ENDPOINTS**

#### Get Doctor's Appointments
```
GET /appointments/doctor
Headers: Authorization: Bearer {token}
Response: [{ _id, patientId, appointmentDate, status, ... }]
```

#### Get Patient's Appointments
```
GET /appointments/patient
Headers: Authorization: Bearer {token}
Response: [{ _id, doctorId, appointmentDate, status, ... }]
```

#### Book Appointment
```
POST /appointments/book
Headers: Authorization: Bearer {token}
Body: {
  doctorId: String,
  appointmentDate: Date,
  appointmentTime: String,
  reason: String,
  symptoms: String
}
Response: { _id, status: "pending", ... }
```

#### Update Appointment Status
```
PUT /appointments/:id/status
Headers: Authorization: Bearer {token}
Body: { status: "confirmed" | "completed" | "cancelled" }
Response: { message: "Status updated", data: {...} }
```

#### Add Appointment Notes
```
PUT /appointments/:id/notes
Headers: Authorization: Bearer {token}
Body: { notes: String }
Response: { message: "Notes added", data: {...} }
```

#### Cancel Appointment
```
DELETE /appointments/:id
Headers: Authorization: Bearer {token}
Response: { message: "Appointment cancelled" }
```

---

## <u>Doctor Panel Documentation</u>

### Overview
This section covers the Doctor side functionalities in the Chronicare application, including authentication, profile management, navigation, and appointment handling.

---

### 1. Doctor Panel Shell (`DoctorPanelShell.jsx`)

Provides the main page layout and navigation for doctor-specific routes:

| Navigation Item | Route | Component |
|-----------------|-------|-----------|
| Dashboard | `/doctor` | DoctorDashboard |
| Appointments | `/doctor/appointments` | DoctorAppointments |
| Edit Profile | `/doctor/edit` | DoctorProfileEditor |
| View Profile | `/doctor/view` | DoctorProfileView |
| Logout | `/` | Redirects to landing page |

**Key Features:**
- Sidebar/navbar navigation
- Logout functionality calls Clerk's `signOut()` and redirects to landing page
- No internal redirect logic to avoid UI flickering

---

### 2. Doctor Routes (defined in `App.jsx`)

| Route | Description | Component |
|-------|-------------|-----------|
| `/doctor` | Main dashboard | DoctorDashboard |
| `/doctor/appointments` | View and manage appointments | DoctorAppointments |
| `/doctor/edit` | Update profile information | DoctorProfileEditor |
| `/doctor/view` | View profile details | DoctorProfileView |
| `/doctor/create` | Create initial profile (if none exists) | DoctorCreate |

---

### 3. Doctor Profile Management

#### DoctorCreate.jsx
- Used for **initial profile creation** by doctors without an existing profile
- After saving:
  - Sets `hasDoctorProfile = true` in user document
  - Redirects to dashboard (`/doctor`)
- API call: `doctorsAPI.createProfile(payload, token)`

#### DoctorProfileEditor.jsx
- **Loads existing profile** via `doctorsAPI.getMyProfile(token)`
- **Editable fields**:
  - Name, specialty, license number, location
  - Years of experience
  - Languages spoken
  - Bio
  - Contact info (phone, email, address)
  - Profile image
- **Save functionality**: `doctorsAPI.updateMyProfile(payload, token)`
- **User feedback**: Shows success toast notification
- **Navigation**: Redirects to `/doctor/view` after successful update

#### DoctorProfileView.jsx
- Displays doctor's profile details in **read-only mode**
- Used for profile verification before editing
- Shows all profile information including:
  - Professional details
  - Contact information
  - Specialization and experience
  - Profile image

---

### 4. Doctor Dashboard (`DoctorDashboard.jsx`)

**Purpose**: Provides an overview and quick stats for doctor

**Displays**:
- Total number of appointments
- Total number of patients
- Quick links to:
  - View/manage appointments
  - Edit profile
  - View profile

**Use Case**: Doctor logs in → first page shows dashboard with key metrics

---

### 5. Doctor Appointments (`DoctorAppointments.jsx`)

**Purpose**: Manage all patient-booked appointments

**Features**:
- **View Appointments**: List of all patient bookings with:
  - Patient name
  - Appointment date/time
  - Reason for visit
  - Symptoms
  - Current status (pending, confirmed, completed)

- **Accept/Reject Appointments**:
  - Accept: Changes status to `confirmed`
  - Reject: Cancels the appointment
  - API: `appointmentAPI.updateAppointmentStatus(id, status, token)`

- **Add Notes**:
  - Add consultation notes for patient
  - API: `appointmentAPI.addAppointmentNotes(id, notes, token)`
  - Visible to patient on their appointment details

- **Mark as Completed**:
  - Change status to `completed` after consultation
  - Prevents further modifications
  - Creates appointment history record

---

### 6. Doctor API Layer (`doctorsAPI.js`)

Handles backend calls with token-based authentication:

```javascript
// Get doctor's profile
getMyProfile(token)

// Create new doctor profile
createProfile(payload, token)

// Update doctor's profile
updateMyProfile(payload, token)

// Get all appointments for doctor
getAppointments(token)

// Update appointment status (accept/reject/complete)
updateAppointmentStatus(id, status, token)

// Add notes to appointment
addAppointmentNotes(id, notes, token)
```

---

### 7. Doctor User Experience Flow

```
1. Doctor signs in (Clerk) 
   ↓
2. Role is checked → must be "doctor"
   ↓
3. If no profile → Redirected to /doctor/create
   └─→ Fill out profile information
   └─→ Save profile
   └─→ Redirect to /doctor
   
4. If profile exists → Redirected to /doctor
   ↓
5. Doctor navigates using sidebar:
   
   a) Dashboard (/doctor)
      └─→ View appointment and patient stats
      
   b) Appointments (/doctor/appointments)
      └─→ View all booked appointments
      └─→ Accept/reject pending appointments
      └─→ Add consultation notes
      └─→ Mark as completed
      
   c) Edit Profile (/doctor/edit)
      └─→ Update professional information
      └─→ Change contact details
      └─→ Update profile image
      
   d) View Profile (/doctor/view)
      └─→ Verify profile information
      
   e) Logout
      └─→ Clerk signOut() called
      └─→ Redirect to landing page (/)
```

---

## <u>User Flows & Diagrams</u>

### **DOCTOR FLOW**

```
┌──────────────────────────────────────────────────────────────┐
│                    DOCTOR USER JOURNEY                        │
└──────────────────────────────────────────────────────────────┘

SIGNUP/LOGIN (Clerk)
    ↓
Select Role: "Doctor"
    ↓
Create Profile (/doctor/create)
    ├─→ Fill: Name, Specialty, License, Experience, etc.
    └─→ Save to DB
    ↓
DOCTOR DASHBOARD (/doctor)
    ├─→ View Stats: Total Appointments, Total Patients
    ├─→ Quick Links
    └─→ Recent Appointments
    ↓
APPOINTMENTS (/doctor/appointments)
    ├─→ View All Appointments
    ├─→ Filter by Status (Pending, Confirmed, Completed)
    ├─→ Accept/Reject Appointments
    ├─→ Add Notes for Patients
    └─→ Mark as Completed
    ↓
PROFILE MANAGEMENT
    ├─→ View Profile (/doctor/view)
    ├─→ Edit Profile (/doctor/edit)
    └─→ Update Information
    ↓
LOGOUT
    └─→ Redirect to Landing Page
```

### **PATIENT FLOW**

```
┌──────────────────────────────────────────────────────────────┐
│                   PATIENT USER JOURNEY                        │
└──────────────────────────────────────────────────────────────┘

SIGNUP/LOGIN (Clerk)
    ↓
Select Role: "Patient"
    ↓
Create Profile (/patient/create)
    ├─→ Fill: Name, Age, Gender, Medical History, etc.
    └─→ Save to DB
    ↓
BROWSE DOCTORS (/patient/doctors)
    ├─→ Search & Filter by Specialty
    ├─→ View Doctor Details
    └─→ Check Availability
    ↓
BOOK APPOINTMENT (/patient/book/:doctorId)
    ├─→ Select Date & Time
    ├─→ Enter Reason & Symptoms
    └─→ Confirm Booking
    ↓
MY APPOINTMENTS (/patient/appointments)
    ├─→ View Booked Appointments
    ├─→ Check Status (Pending, Confirmed, Completed)
    ├─→ View Doctor Notes
    └─→ Cancel if Needed
    ↓
PROFILE MANAGEMENT
    ├─→ View Profile
    ├─→ Edit Profile
    └─→ Update Information
    ↓
LOGOUT
```

### **APPOINTMENT STATUS FLOW**

```
┌───────────────────────────────────────────────────────────────┐
│              APPOINTMENT STATUS LIFECYCLE                      │
└───────────────────────────────────────────────────────────────┘

Patient Books Appointment
    ↓
Status: PENDING
    ├─→ Doctor can Accept/Reject
    ├─→ Patient can Cancel
    └─→ (60 minute timeout)
    ↓
[DOCTOR ACCEPTS]
    ↓
Status: CONFIRMED
    ├─→ Cannot be Cancelled by Patient
    ├─→ Doctor can add Notes
    └─→ Awaiting Appointment Date
    ↓
[APPOINTMENT DATE ARRIVES]
    ↓
Status: COMPLETED
    ├─→ After appointment concludes
    ├─→ Doctor adds final Notes
    └─→ Cannot be Modified
    ↓
OR [REJECTED/CANCELLED]
    ↓
Status: CANCELLED
    └─→ Appointment Removed from Active List
```

### **COMPONENT HIERARCHY**

```
App.jsx
├── Landing Page
├── Auth Pages
│   ├── SignIn
│   └── SignUp
├── Role Selection
│   └── SelectRole.jsx
├── Doctor Routes
│   └── DoctorPanelShell.jsx
│       ├── DoctorDashboard.jsx
│       ├── DoctorAppointments.jsx
│       │   └── AppointmentCard.jsx
│       ├── DoctorProfileEditor.jsx
│       ├── DoctorProfileView.jsx
│       └── DoctorCreate.jsx
└── Patient Routes
    └── PatientPanelShell.jsx
        ├── PatientDashboard.jsx
        ├── PatientAppointments.jsx
        ├── BrowseDoctors.jsx
        ├── BookAppointment.jsx
        ├── PatientProfileEditor.jsx
        └── PatientProfileView.jsx
```

---

## <u>How to Run</u>

### **Step 1: Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update .env with connection string)
```

### **Step 2: Start Backend Server**
```bash
cd Backend
npm install
npm start
# Server runs on http://localhost:5000
```

### **Step 3: Start Frontend Development Server**
```bash
cd Frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### **Step 4: Access the Application**
- Open browser: `http://localhost:5173`
- Sign in with Clerk credentials
- Select role (Doctor or Patient)
- Complete profile setup

---

### **Seed Data (Optional)**

```bash
# Seed test users
cd Backend
node seed.js

# Seed test doctors
node seedDoctor.js
```

---

## <u>Key Features</u>

### ✅ Doctor Features
- **Profile Management**: Create, view, and update medical profile
- **Appointment Management**: Accept/reject patient bookings
- **Patient Communication**: Add notes and consultation details
- **Dashboard Analytics**: View appointment and patient stats
- **Status Updates**: Mark appointments as completed
- **Real-time Notifications**: Updates on new appointments

### ✅ Patient Features
- **Doctor Discovery**: Browse and filter doctors by specialty
- **Appointment Booking**: Select dates and times
- **Appointment Tracking**: View booking status and details
- **Profile Management**: Maintain medical history and preferences
- **Appointment History**: View past and upcoming appointments
- **Doctor Notes**: View consultation notes from appointments

### ✅ System Features
- **Role-Based Access Control**: Doctor vs Patient authorization
- **Clerk Authentication**: Secure user authentication with sessions
- **RESTful API**: Clean and documented API architecture
- **MongoDB**: Persistent data storage with relationships
- **Error Handling**: Comprehensive error responses and validation
- **Responsive Design**: Works on desktop and mobile devices
- **Toast Notifications**: User feedback on actions

---

## <u>Troubleshooting</u>

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Verify MONGODB_URI in .env and MongoDB is running |
| Clerk token issues | Check CLERK_PUBLISHABLE_KEY and webhook secret |
| CORS errors | Ensure CORS_ORIGIN in backend .env matches frontend |
| API 404 errors | Verify backend is running on correct port (5000) |
| Component not rendering | Clear browser cache and restart dev server |
| Profile not loading | Check token is valid and user role is set |
| Appointment not updating | Verify token has necessary permissions |

---

## <u>Running Tests</u>

```bash
# Backend tests (if configured)
cd Backend
npm test

# Frontend tests (if configured)
cd Frontend
npm test
```

---

## <u>Deployment</u>

### Backend (Render)
```bash
cd Backend
# Push to Git repository
git push heroku main
```

### Frontend (Vercel)
```bash
cd Frontend
npm run build
# Deploy dist/ folder
```

---

## <u>Contributing</u>

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

---

## <u>License</u>

This project is for educational purposes as a PLP ACADEMY capstone project.

---

## <u>Support & Contact</u>

For questions or issues, please contact the development team or create an issue in the repository.

---

*Last Updated: November 25, 2025*
*Built with MERN Stack • Developed for PLP ACADEMY*
