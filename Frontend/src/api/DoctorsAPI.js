import { createAuthClient } from './lib/authClient';

export const DoctorsAPI = {
  list: async (token) => {
    const client = createAuthClient(token);
    const res = await client.get('/doctors');
    return res.data;
  },

  getById: async (doctorId, token) => {
    const client = createAuthClient(token);
    const res = await client.get(`/doctors/${doctorId}`);
    return res.data;
  },
};
