// src/api/appointmentsAPI.js
import { httpClient } from "./httpClient";

export const appointmentsAPI = {
  // Patient
  book: (body, token) => httpClient.post("/api/appointments", body, token),
  listForPatient: (token) => httpClient.get("/api/appointments/patient", token),

  // Doctor
  listForDoctor: (token) => httpClient.get("/api/appointments/doctor", token),
  confirm: (id, token) => httpClient.patch(`/api/appointments/${id}/status/confirm`, {}, token),
  cancel: (id, token) => httpClient.patch(`/api/appointments/${id}/status/cancel`, {}, token),

  // Notes
  addNote: (id, body, token) => httpClient.patch(`/api/appointments/${id}/notes`, body, token),
};
