// src/api/appointmentsAPI.js
import { httpClient } from "./httpClient";

export const appointmentsAPI = {
  book: (body, token) => httpClient.post("/api/appointments", body, token),
  listForPatient: (token) => httpClient.get("/api/appointments/patient", token),
  listForDoctor: (token) => httpClient.get("/api/appointments/doctor", token),
  confirm: (id, token) => httpClient.post(`/api/appointments/${id}/confirm`, {}, token),
  cancel: (id, token) => httpClient.post(`/api/appointments/${id}/cancel`, {}, token),
  addNote: (id, body, token) => httpClient.post(`/api/appointments/${id}/notes`, body, token),
};
