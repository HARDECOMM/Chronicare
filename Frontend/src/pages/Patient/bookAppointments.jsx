// src/pages/patient/BookAppointment.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { doctorsAPI } from "../../api/doctorsAPI";
import { appointmentsAPI } from "../../api/appointmentsAPI";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
export function BookAppointment() {
  const { getToken } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctorId: "", date: "", reason: "" });

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await doctorsAPI.getAllDoctors(token);
        setDoctors(res.doctors || []);
      } catch {
        toast.error("Failed to load doctors");
      }
    })();
  }, [getToken]);

  const handleSubmit = async () => {
    try {
      const token = await getToken();
      await appointmentsAPI.createAppointment(form, token);
      toast.success("Appointment booked");
    } catch {
      toast.error("Failed to book appointment");
    }
  };

  return (
    <div className="space-y-4">
      <Select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
        <option value="">Select doctor</option>
        {doctors.map((d) => (
          <option key={d._id} value={d._id}>{d.name} ({d.specialty})</option>
        ))}
      </Select>
      <Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason" />
      <Button onClick={handleSubmit}>Book</Button>
    </div>
  );
}
