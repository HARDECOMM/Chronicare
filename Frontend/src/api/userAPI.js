import { httpClient } from "./httpClient";

export const usersAPI = {
  // Sync Clerk user basic info to backend
  sync: (user, token) =>
    httpClient.post("/api/users/sync", {
      clerkId: user.id, // ✅ include Clerk ID
      email: user.primaryEmailAddress?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
    }, token),

  // Get role by Clerk ID
  getRole: (clerkId, token) =>
    httpClient.get(`/api/users/role/${clerkId}`, token),

  // Set role (doctor, patient, admin)
  setRole: (role, token) =>
    httpClient.post("/api/users/role", { role }, token),
};
