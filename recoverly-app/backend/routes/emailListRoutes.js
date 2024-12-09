const express = require('express');
const router = express.Router();
const EmailNotification = require('../models/EmailNotification');
const authenticateAdmin = require('../middleware/authenticateAdmin'); // Import the middleware

router.use(authenticateAdmin);

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

module.exports = router;
