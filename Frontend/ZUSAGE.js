import { usersAPI } from "./api/usersAPI";

// Sync user
await usersAPI.sync(clerkUser, token);

// Get role
const roleData = await usersAPI.getRole(clerkUser.id, token);

// Set role
await usersAPI.setRole(clerkUser.id, "doctor", token);
