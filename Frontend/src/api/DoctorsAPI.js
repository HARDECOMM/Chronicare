// src/api/doctorsAPI.js
import { httpClient } from "./httpClient";

export const doctorsAPI = {
  getMyProfile: (token) => httpClient.get("/doctors/me", token),
  createMyProfile: (payload, token) => httpClient.post("/doctors", payload, token),
  updateMyProfile: (payload, token) => httpClient.patch("/doctors/me", payload, token),
  getMyAppointments: (token) => httpClient.get("/doctors/appointments", token),
};
