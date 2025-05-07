const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// GET user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT to update email/username (requires password)
router.put('/', auth, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid current password' });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json({ msg: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT to change password
router.put('/password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
  
    try {
      const user = await User.findById(req.user.id);
      
      // Use the comparePassword method
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid current password' });
      }
  
      // Just update the password - the pre-save hook will hash it
      user.password = newPassword;
      await user.save();
  
      res.json({ msg: 'Password updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  });

module.exports = router;
