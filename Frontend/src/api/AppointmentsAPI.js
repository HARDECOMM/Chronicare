import { createAuthClient } from './lib/authClient';

export const AppointmentsAPI = {
  create: async (data, token) => {
    const client = createAuthClient(token);
    const res = await client.post('/appointments', data);
    return res.data;
  },

  listMine: async (token) => {
    const client = createAuthClient(token);
    const res = await client.get('/appointments/mine');
    return res.data;
  },

  getDoctor: async (id, token) => {
    const client = createAuthClient(token);
    const res = await client.get(`/doctors/${id}`);
    return res.data;
  },

  updateStatus: async (id, status, token) => {
    const client = createAuthClient(token);
    const res = await client.patch(`/appointments/${id}/status`, { status });
    return res.data;
  },

  remove: async (id, token) => {
    const client = createAuthClient(token);
    const res = await client.delete(`/appointments/${id}`);
    return res.data;
  },

  listByPatient: async (id, token) => {
    const client = createAuthClient(token);
    const res = await client.get(`/appointments/patient/${id}`);
    return res.data;
  },
};
