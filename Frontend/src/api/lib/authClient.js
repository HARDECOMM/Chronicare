// src/api/lib/authClient.js
import axios from 'axios';

export function createAuthClient(token) {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return axios.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}