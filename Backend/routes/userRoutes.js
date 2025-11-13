const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Clerk-powered user sync and role management
router.post('/sync-user', userController.syncUser);
router.get('/role/:clerkId', userController.getUserRole);
router.patch('/role', userController.setUserRole);

// Admin-only routes
router.get('/', userController.listAllUsers);
router.patch('/role-by-id', userController.setUserRoleById);

module.exports = router;