// src/api/patientsAPI.js
import { httpClient } from "./httpClient";

export const patientsAPI = {
  getMyProfile: (token) => httpClient.get("/patients/me", token),
  createMyProfile: (payload, token) => httpClient.post("/patients", payload, token),
  updateMyProfile: (payload, token) => httpClient.patch("/patients/me", payload, token),
};
