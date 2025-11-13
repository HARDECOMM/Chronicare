// src/lib/authClient.js
import axios from 'axios';

export function createAuthClient(token) {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}
