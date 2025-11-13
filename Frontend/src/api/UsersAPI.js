import { createAuthClient } from './lib/authClient';

export const UsersAPI = {
  sync: async (user, token) => {
    const client = createAuthClient(token);
    return client.post('/users/sync-user', {
      clerkId: user.id,
      name: user.fullName,
      email: user.primaryEmailAddress?.emailAddress,
    });
  },

  getRole: async (clerkId, token) => {
    const client = createAuthClient(token);
    const res = await client.get(`/users/role/${clerkId}`);
    return res.data.role;
  },

  setRole: async (clerkId, role, token) => {
    const client = createAuthClient(token);
    const res = await client.patch('/users/role', { clerkId, role });
    return res.data;
  },

  listAll: async (token) => {
    const client = createAuthClient(token);
    const res = await client.get('/users');
    return res.data;
  },

  setRoleById: async (userId, role, token) => {
    const client = createAuthClient(token);
    const res = await client.patch('/users/role-by-id', { userId, role });
    return res.data;
  },
};
