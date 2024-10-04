const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.post('/register', async (req, res) => {
    const { 
      user_name, 
      user_email, 
      user_phone, 
      user_password, 
      org_name, 
      org_address, 
      city, 
      state, 
      pincode,
      secure_code 
    } = req.body;

  try {
    let user = await User.findOne({ user_email }); 
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
        user_name, 
        user_email,
        user_phone,
        user_password,
        org_name,
        org_address,
        city,
        state,
        pincode,
        secure_code, 
      });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
