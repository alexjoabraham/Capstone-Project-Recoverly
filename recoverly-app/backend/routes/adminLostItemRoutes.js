const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authenticateAdmin = require('../middleware/authenticateAdmin');
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

router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    console.log('Admin ID making the update:', req.adminId); 
    console.log('Update payload received:', updatedData);
    
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      console.log('Admin not found for ID:', req.adminId);
      return res.status(404).json({ message: 'Admin not found' });
    }
    console.log('Admin details:', admin);
    const updatedItem = await LostItem.findByIdAndUpdate(id, updatedData, { new: true });
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
        subject: 'Important: Update on Your Lost Item Status',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0056b3;">Good News!</h2>
            <p>Dear <strong>${user.user_name}</strong>,</p>
            <p>We are pleased to inform you that your lost item, <strong>${updatedItem.lostitem_name}</strong>, has been successfully marked as found.</p>
            <p><strong>Details:</strong></p>
            <ul>
              <li><strong>Organization Name:</strong> ${admin.organization_name}</li>
              <li><strong>Address:</strong> ${admin.organization_address}</li>
            </ul>
            <p>To retrieve your item or for further assistance, please contact the admin using the details below:</p>
            <ul>
              <li><strong>Admin Name:</strong> ${admin.admin_name}</li>
              <li><strong>Admin Email:</strong> <a href="mailto:${admin.admin_email}">${admin.admin_email}</a></li>
            </ul>
            <p>Thank you for using <strong>Recoverly</strong>. We’re here to assist you every step of the way.</p>
            <p style="color: #777;">Best regards,<br/>The Recoverly Team</p>
          </div>
        `,
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
