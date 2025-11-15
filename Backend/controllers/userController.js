// controllers/userController.js
const mongoose = require('mongoose');
const { User } = require('../models/user');

// ✅ Sync Clerk user to database
exports.syncUser = async (req, res) => {
  const { clerkId, name, email } = req.body;

  if (!clerkId || !email) {
    return res.status(400).json({ error: 'Missing clerkId or email' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({ clerkId });

    if (!user) {
      // First-time login: create user with no role yet
      user = await User.create({
        clerkId,
        name,
        email: normalizedEmail,
        role: null,
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('❌ User sync error:', err);
    res.status(500).json({ error: 'Server error during user sync' });
  }
};

// ✅ Get user role by Clerk ID
exports.getUserRole = async (req, res) => {
  const { clerkId } = req.params;

  if (!clerkId) {
    return res.status(400).json({ error: 'Missing clerkId parameter' });
  }

  try {
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ role: user.role });
  } catch (err) {
    console.error('❌ Role fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
};

// ✅ Set user role by Clerk ID (used in /select-role)
exports.setUserRole = async (req, res) => {
  const { clerkId, role } = req.body;

  if (!clerkId || !role) {
    return res.status(400).json({ error: 'Missing clerkId or role' });
  }

  try {
    const updated = await User.findOneAndUpdate({ clerkId }, { role }, { new: true });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ success: true, user: updated });
  } catch (err) {
    console.error('❌ Role update error:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

// ✅ Get all users (admin only)
exports.listAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Update user role by internal DB ID (used in admin panel)
// Validate userId is a valid ObjectId before calling findByIdAndUpdate
exports.setUserRoleById = async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ error: 'Missing userId or role' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  try {
    const updated = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ success: true, user: updated });
  } catch (err) {
    console.error('❌ Error updating role by ID:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
};
