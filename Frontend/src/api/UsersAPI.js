import { httpClient } from "./httpClient";

export const usersAPI = {
  sync: (user, token) => httpClient.post("/api/users/sync", { user }, token),
  setRole: (id, role, token) => httpClient.patch(`/api/users/${id}/role`, { role }, token),
  getRole: (id, token) => httpClient.get(`/api/users/${id}/role`, token),
};
