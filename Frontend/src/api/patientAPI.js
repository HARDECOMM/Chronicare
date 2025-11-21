// src/api/patientsAPI.js
import { httpClient } from "./httpClient";

export const patientsAPI = {
  // Create patient profile
  create: (body, token) =>
    httpClient.post("/api/patients", body, token),

  // Get logged-in patient profile
  getMe: (token) =>
    httpClient.get("/api/patients/me", token),

  // Update patient profile
  updateMe: (body, token) =>
    httpClient.patch("/api/patients/me", body, token),

  // Get appointments for logged-in patient
  getAppointments: (token) =>
    httpClient.get("/api/patients/me/appointments", token),

  // Admin: list all patients
  listAll: (token) =>
    httpClient.get("/api/patients/all", token),
};
