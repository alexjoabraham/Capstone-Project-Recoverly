const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const EmailNotification = require('../models/EmailNotification');
const Admin = require('../models/Admin')
const authenticateAdmin = require('../middleware/authenticateAdmin'); 
require('dotenv').config();
router.use(authenticateAdmin);

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

console.log('Token in email list route', process.env.JWT_SECRET)
console.log('Transporter Object:', transporter);

transporter.verify((error, success) => {
  if (error) {
    console.error('Error setting up transporter:', error);
  } else {
    console.log('Transporter is ready to send emails');
  }
});

router.get('/', async (req, res) => {
    try {
      const { search } = req.query;
  
      const query = { admin_id: req.admin._id };
      if (search) {
        query.email = { $regex: search, $options: 'i' };
      }
  
      const emailList = await EmailNotification.find(query);
      res.status(200).json(emailList);
    } catch (error) {
      console.error('Error fetching email list:', error);
      res.status(500).json({ message: 'Error fetching email list', error: error.message });
    }
  });  

router.post('/add', async (req, res) => {
    try {
      const { email, name } = req.body;
  
      if (!email || !name) {
        return res.status(400).json({ message: 'Both name and email are required' });
      }
  
      const newEmail = new EmailNotification({ 
        admin_id: req.admin._id,
        email, 
        name 
      });
      await newEmail.save();
  
      res.status(201).json({ message: 'Email added successfully', email: newEmail });
    } catch (error) {
      console.error('Error adding email:', error);
      res.status(500).json({ message: 'Error adding email', error: error.message });
    }
  });
  

router.put('/:id/update', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Updated email is required' });
    }

    const updatedEmail = await EmailNotification.findByIdAndUpdate(
      req.params.id,
      { email },
      { new: true }
    );

    if (!updatedEmail) {
      return res.status(404).json({ message: 'Email not found' });
    }

    res.status(200).json({ message: 'Email updated successfully', email: updatedEmail });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ message: 'Error updating email', error: error.message });
  }
});

router.put("/:emailId/disable", async (req, res) => {
  const { emailId } = req.params;

  try {
    const email = await EmailNotification.findById(emailId);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    email.disabled = true;
    await email.save();

    res.status(200).json({ message: "Email disabled successfully" });
  } catch (error) {
    console.error("Error disabling email:", error);
    res.status(500).json({ message: "Failed to disable email", error });
  }
});

router.put("/:emailId/enable", async (req, res) => {
  const { emailId } = req.params;

  try {
    const email = await EmailNotification.findById(emailId);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    email.disabled = false;
    await email.save();

    res.status(200).json({ message: "Email enabled successfully" });
  } catch (error) {
    console.error("Error enabling email:", error);
    res.status(500).json({ message: "Failed to enable email", error });
  }
});

router.delete('/:id/delete', async (req, res) => {
  try {
    const deletedEmail = await EmailNotification.findByIdAndDelete(req.params.id);

    if (!deletedEmail) {
      return res.status(404).json({ message: 'Email not found' });
    }

    res.status(200).json({ message: 'Email deleted successfully', email: deletedEmail });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ message: 'Error deleting email', error: error.message });
  }
});

router.post('/notify', async (req, res) => {
  try {
    console.log('Received req.body:', req.body);

    const { adminId, secureCode } = req.body;

    const adminDetails = await Admin.findById(adminId);

    if (!adminDetails) {
      console.error('Admin not found with provided adminId');
      return res.status(404).json({ message: 'Admin not found' });
    }

    const organizationName = adminDetails.organization_name;

    const subject = "Secure Code Notification";
    const textMessage = `
Dear User,

Greetings from ${organizationName}!

We are pleased to inform you that your secure code has been generated. This secure code will assist you in managing your Lost and Found requests through Recoverly.

Details:
- **Secure Code**: ${secureCode}

Thank you for choosing Recoverly for your Lost and Found needs. We are here to simplify the process for you.

Best regards,  
The Recoverly Team  
${organizationName}
    `;

    const htmlMessage = `
      <p>Dear User,</p>
      <p>Greetings from <strong>${organizationName}</strong>!</p>
      <p>We are pleased to inform you that your secure code has been generated. This secure code will assist you in managing your Lost and Found requests through <strong>Recoverly</strong>.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li><strong>Secure Code:</strong> ${secureCode}</li>
      </ul>
      <p>Thank you for choosing <strong>Recoverly</strong> for your Lost and Found needs. We are here to simplify the process for you.</p>
      <p>Best regards,<br/>The Recoverly Team<br/><strong>${organizationName}</strong></p>
    `;

    const emailList = await EmailNotification.find({ admin_id: adminId, disabled: false });

    if (!emailList.length) {
      console.error('No email addresses to notify');
      return res.status(404).json({ message: 'No email addresses to notify' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailList.map(email => email.email).join(','), 
      subject,
      text: textMessage,
      html: htmlMessage,
    };

    console.log('Mail options:', mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email', error });
      }

      console.log('Email sent successfully:', info);
      res.status(200).json({ message: 'Emails sent successfully', info });
    });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: 'Error sending emails', error: error.message });
  }
});

module.exports = router;
