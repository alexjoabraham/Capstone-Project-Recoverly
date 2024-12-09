const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

console.log('Transporter Object in adminlostitemroutes:', transporter);

transporter.verify((error, success) => {
  if (error) {
    console.error('Error setting up transporter:', error);
  } else {
    console.log('Transporter is ready to send emails in adminlostitemroutes');
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('Fetching lost items...');
    const lostItems = await LostItem.find().select('-user_id -admin_id');
    console.log('Lost items fetched:', lostItems); 
    res.status(200).json(lostItems);
  } catch (error) {
    console.error('Error fetching lost items:', error);
    res.status(500).json({ message: 'Error fetching lost items' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Received request with ID in adminlostitemroutes:', id);
    console.log('Request body in adminlostitemroutes:', req.body);
    const updatedItem = await LostItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) {
      console.log('Item not found for ID in adminlostitemroutes:', id);
      return res.status(404).json({ message: 'Item not found' });
    }

    console.log('Updated item in adminlostitemroutes:', updatedItem);

    if (req.body.found_flag) {
      const user = await User.findOne(updatedItem.user_id);
      console.log('User data in adminlostitemroutes:', user);
      if (!user) {
        console.log('User not found for item in adminlostitemroutes:', updatedItem);
        return res.status(404).json({ message: 'User not found for the lost item' });
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.user_email,
        subject: 'Item Found Notification',
        text: `Dear ${user.user_name},\n\nGood news! Your lost item "${updatedItem.lostitem_name}" has been marked as found. Please contact the admin for further details.\n\nBest regards,\nRecoverly Team`,
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent to user:', user.user_email);
    }

    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item' });
  }
});

module.exports = router;
