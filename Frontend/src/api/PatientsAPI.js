// src/api/patientsAPI.js
import { httpClient } from "./httpClient";

export const patientsAPI = {
  // Patient profile
  createProfile: (body, token) =>
    httpClient.post("/api/patients", body, token),

  getMyProfile: (token) =>
    httpClient.get("/api/patients/me", token),

  updateMyProfile: (body, token) =>
    httpClient.patch("/api/patients/me", body, token),
};
