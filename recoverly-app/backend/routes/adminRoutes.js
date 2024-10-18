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

module.exports = router;
