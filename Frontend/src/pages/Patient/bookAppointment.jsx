import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { doctorsAPI } from "@/api/doctorAPI";   // ✅ doctor profiles
import { appointmentsAPI } from "@/api/appointmentAPI"; // ✅ unified appointments API
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export function BookAppointment() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    recurrencePattern: "none",
    recurrenceCount: 1,
  });
  const [loading, setLoading] = useState(false);

  // Load doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = await getToken();
        const res = await doctorsAPI.listAll(token);
        setDoctors(res.doctors || []);
      } catch (err) {
        toast.error("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, [getToken]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      await appointmentsAPI.book(
        {
          doctorId: form.doctorId,
          date: form.date,
          time: form.time,
          isRecurring: form.recurrencePattern !== "none",
          recurrencePattern: form.recurrencePattern,
          recurrenceCount: Number(form.recurrenceCount),
        },
        token
      );
      toast.success("Appointment booked successfully!");
      navigate("/patient/appointments", { replace: true });
      setForm({
        doctorId: "",
        date: "",
        time: "",
        recurrencePattern: "none",
        recurrenceCount: 1,
      });
    } catch (err) {
      toast.error("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find((doc) => doc._id === form.doctorId);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-purple-700">Book Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Doctor Dropdown */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Select Doctor</label>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                className="border rounded p-2"
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.name} — {doc.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Preview */}
            {selectedDoctor && (
              <div className="border rounded p-3 bg-gray-100 text-sm space-y-1">
                <p><strong>Dr. {selectedDoctor.name}</strong></p>
                <p>Specialty: {selectedDoctor.specialty}</p>
                {selectedDoctor.location && <p>Location: {selectedDoctor.location}</p>}
                {selectedDoctor.yearsOfExperience && (
                  <p>Experience: {selectedDoctor.yearsOfExperience} years</p>
                )}
                {selectedDoctor.languagesSpoken?.length > 0 && (
                  <p>Languages: {selectedDoctor.languagesSpoken.join(", ")}</p>
                )}
              </div>
            )}

            {/* Date */}
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            {/* Time */}
            <Input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />

            {/* Recurrence Pattern */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Repeat</label>
              <select
                name="recurrencePattern"
                value={form.recurrencePattern}
                onChange={handleChange}
                className="border rounded p-2"
              >
                <option value="none">No repetition</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Recurrence Count */}
            {form.recurrencePattern !== "none" && (
              <Input
                type="number"
                name="recurrenceCount"
                value={form.recurrenceCount}
                onChange={handleChange}
                min="1"
              />
            )}

            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
