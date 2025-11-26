import { httpClient } from "./httpClient";

export const appointmentsAPI = {
  // ===============================
  // 📌 Patient routes
  // ===============================

  // Patient books appointment
  // POST /api/appointments
  book: (body, token) =>
    httpClient.post("/api/appointments", body, token),

  // Patient lists own appointments
  // GET /api/appointments/patient
  listForPatient: (token) =>
    httpClient.get("/api/appointments/patient", token),

  // Patient cancels appointment
  // PATCH /api/appointments/:id/status/cancel/patient
  cancelByPatient: (id, token) =>
    httpClient.patch(`/api/appointments/${id}/status/cancel/patient`, {}, token),

  // ===============================
  // 📌 Doctor routes
  // ===============================

  // Doctor lists own appointments
  // GET /api/appointments/doctor
  listForDoctor: (token) =>
    httpClient.get("/api/appointments/doctor", token),

  // Doctor confirms appointment
  // PATCH /api/appointments/:id/status/confirm
  confirm: (id, token) =>
    httpClient.patch(`/api/appointments/${id}/status/confirm`, {}, token),

  // Doctor cancels appointment
  // PATCH /api/appointments/:id/status/cancel/doctor
  cancelByDoctor: (id, token) =>
    httpClient.patch(`/api/appointments/${id}/status/cancel/doctor`, {}, token),

  // ===============================
  // 📌 Notes routes (shared)
  // ===============================

  // Add note (doctor or patient)
  // PATCH /api/appointments/:id/notes
  // body = { message: "text of note", authorType: "patient" | "doctor" }
  addNote: (id, body, token) =>
    httpClient.patch(`/api/appointments/${id}/notes`, body, token),

  // Update note (doctor or patient)
  // PATCH /api/appointments/:appointmentId/notes/:noteId
  // body = { message: "updated text" }
  updateNote: (appointmentId, noteId, body, token) =>
    httpClient.patch(`/api/appointments/${appointmentId}/notes/${noteId}`, body, token),

  // Delete note (doctor or patient)
  // DELETE /api/appointments/:appointmentId/notes/:noteId
  deleteNote: (appointmentId, noteId, token) =>
    httpClient.delete(`/api/appointments/${appointmentId}/notes/${noteId}`, token),
};
