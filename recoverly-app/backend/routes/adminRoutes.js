const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

router.post('/register', async (req, res) => {
  const { 
    admin_name, 
    admin_email,  
    admin_phone, 
    admin_password, 
    organization_name, 
    organization_address, 
    organization_securecode 
  } = req.body;

  try {
    let admin = await Admin.findOne({ admin_email });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    admin = new Admin({
      admin_name,
      admin_email, 
      admin_phone,
      admin_password,
      organization_name,
      organization_address,
      organization_securecode
    });

    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ admin_email: email }); 
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = password.trim() === admin.admin_password.trim();

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Admin logged in successfully', admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;