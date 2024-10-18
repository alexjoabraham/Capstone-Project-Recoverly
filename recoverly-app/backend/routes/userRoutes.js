const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { user_name, user_email, user_phone, user_password } = req.body;

  try {
    let user = await User.findOne({ user_email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ user_name, user_email, user_phone, user_password });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    const user = await User.findOne({ user_email });
    if (!user || user_password !== user.user_password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'User logged in successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
