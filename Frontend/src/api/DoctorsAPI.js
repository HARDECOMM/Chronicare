// src/api/doctorsAPI.js
import { httpClient } from "./httpClient";

export const doctorsAPI = {
  getMyProfile: (token) => httpClient.get("/api/doctors/me", token),
  createDoctorProfile: (body, token) => httpClient.post("/api/doctors", body, token),
  updateMyProfile: (body, token) => httpClient.patch("/api/doctors/me", body, token),
  getProfileWithStats: (token) => httpClient.get("/api/doctors", token),
  getAppointments: (token) => httpClient.get("/api/doctors/appointments", token),
};
