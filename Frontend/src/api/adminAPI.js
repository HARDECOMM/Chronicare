// src/api/adminAPI.js
import { httpClient } from "./httpClient";

export const adminAPI = {
  // Get all users
  getUsers: (token) =>
    httpClient.get("/api/admin/users", token),

  // Get all doctors
  getDoctors: (token) =>
    httpClient.get("/api/admin/doctors", token),

  // Get all appointments
  getAppointments: (token) =>
    httpClient.get("/api/admin/appointments", token),
};
