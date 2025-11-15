// src/api/doctorsAPI.js
import { createAuthClient } from './lib/authClient';

export const doctorsAPI = {
  getAll: async (token) => {
    const client = createAuthClient(token);
    const res = await client.get('/api/doctors');
    return res.data;
  },

  getById: async (doctorId, token) => {
    if (token) {
      const client = createAuthClient(token);
      const res = await client.get(`/api/doctors/${doctorId}`);
      return res.data;
    } else {
      // public fetch without auth, keep baseURL consistent with createAuthClient
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${baseURL}/api/doctors/${doctorId}`);
      return res.data;
    }
  },

  getMyProfile: async (token) => {
    const client = createAuthClient(token);
    const res = await client.get('/api/doctors/me');
    return res.data;
  },

  updateMyProfile: async (updates, token) => {
    const client = createAuthClient(token);
    const res = await client.patch('/api/doctors/me', updates);
    return res.data;
  },

  create: async (payload, token) => {
    const client = createAuthClient(token);
    const res = await client.post('/api/doctors', payload);
    return res.data;
  },
};