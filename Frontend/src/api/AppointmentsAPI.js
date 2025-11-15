// src/api/appointmentsAPI.js
import { createAuthClient } from './lib/authClient';

export const appointmentsAPI = {
  getDoctorAppointments: async (token) => {
    const client = createAuthClient(token);
    const res = await client.get('/api/appointments/doctor'); // explicit /api
    return res.data;
  },
  getForUser: async (token) => {
    const client = createAuthClient(token);
    const res = await client.get('/api/appointments/mine');
    return res.data;
  },
  create: async (data, token) => {
    const client = createAuthClient(token);
    const res = await client.post('/api/appointments', data);
    return res.data;
  },
  updateStatus: async (id, status, token) => {
    const client = createAuthClient(token);
    const res = await client.patch(`/api/appointments/${id}/status`, { status });
    return res.data;
  },
  remove: async (id, token) => {
    const client = createAuthClient(token);
    const res = await client.delete(`/api/appointments/${id}`);
    return res.data;
  },
  getDoctor: async (doctorId, token) => {
    const client = createAuthClient(token);
    const res = await client.get(`/api/doctors/${doctorId}`);
    return res.data;
  },
  listMine: async (token) => impl.getForUser(token),
  listForDoctor: async (token) => impl.getDoctorAppointments(token),
};