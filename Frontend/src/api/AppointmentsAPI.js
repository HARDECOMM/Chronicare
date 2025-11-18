// src/api/appointmentsAPI.js
import { httpClient } from "./httpClient";

export const appointmentsAPI = {
  // Doctor side
  getDoctorAppointments: (token) => httpClient.get("/doctors/appointments", token),
  updateStatus: (id, status, token) =>
    httpClient.patch(`/doctors/appointments/${id}/status`, { status }, token),

  // Patient side
  createAppointment: (payload, token) => httpClient.post("/appointments", payload, token),
  getMyAppointments: (token) => httpClient.get("/appointments/mine", token),
  cancelAppointment: (id, token) => httpClient.del(`/appointments/${id}`, token),
};
