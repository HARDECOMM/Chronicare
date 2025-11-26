// src/pages/doctor/DoctorCreate.jsx
import { CreateDoctorForm } from "../../doctor/doctorProfileForm";

export function DoctorCreate() {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <CreateDoctorForm
        existingProfile={null}
        onSuccess={() => {
          window.location.href = "/doctor/dashboard";
        }}
      />
    </div>
  );
}
