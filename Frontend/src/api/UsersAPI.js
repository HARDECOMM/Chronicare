// src/api/usersAPI.js
import { createAuthClient } from './lib/authClient';

export const usersAPI = {
  sync: async (user, token) => {
    const client = createAuthClient(token);
    const res = await client.post('/api/users/sync-user', {
      clerkId: user.id,
      name: user.fullName,
      email: user.primaryEmailAddress?.emailAddress,
    });
    return res.data;
  },

  getRole: async (clerkId, token) => {
    const client = createAuthClient(token);
    const res = await client.get(`/api/users/role/${clerkId}`);
    return res.data.role;
  },

  setRole: async (clerkId, role, token) => {
    const client = createAuthClient(token);
    const res = await client.patch('/api/users/role', { clerkId, role });
    return res.data;
  },

  listAll: async (token) => {
    const client = createAuthClient(token);
    const res = await client.get('/api/users');
    return res.data;
  },

  setRoleById: async (userId, role, token) => {
    const client = createAuthClient(token);
    const res = await client.patch('/api/users/role-by-id', { userId, role });
    return res.data;
  },
};