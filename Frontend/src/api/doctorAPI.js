// src/api/doctorsAPI.js
import { httpClient } from "./httpClient";

export const doctorsAPI = {
  // Doctor profile
  getMyProfile: (token) => httpClient.get("/api/doctors/me", token),
  createDoctorProfile: (body, token) => httpClient.post("/api/doctors", body, token),
  updateMyProfile: (body, token) => httpClient.patch("/api/doctors/me", body, token),
  deleteMyProfile: (token) => httpClient.delete("/api/doctors/me", token),

  // Dashboard
  getProfileWithStats: (token) => httpClient.get("/api/doctors", token),

  // Doctor listing (for patients to choose when booking)
  listAll: (token) => httpClient.get("/api/doctors/all", token),
};
