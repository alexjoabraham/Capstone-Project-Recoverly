const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const multer = require('multer');
const ClaimItem = require('../models/ClaimItem');
const FoundItem = require('../models/FoundItem');
const jwt = require('jsonwebtoken');
const authenticateUser = require('../middleware/authenticateUser')

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadClaimItem = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'recoverlyawsbucket',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `claim-items/${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extName = fileTypes.test(file.mimetype);
    if (extName) {
      cb(null, true);
    } else {
      cb(new Error('Only images with jpeg, jpg, png, or webp formats are allowed!'));
    }
  },
});

router.post('/claim-item', uploadClaimItem.single('claim_image'), async (req, res) => {
  try {
    const { user_id, founditem_id, userclaim_description } = req.body;
    const imageUrl = req.file ? req.file.location : null;

    const newClaimItem = new ClaimItem({
      user_id,
      founditem_id,
      claim_image: imageUrl,
      userclaim_description,
    });

    await newClaimItem.save();
    res.status(201).json({ message: 'Claim item submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error submitting claim item' });
  }
});

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

    // res.status(200).json({ message: 'User logged in successfully', user });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'User logged in successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/validate-organization', async (req, res) => {
  const { organization_name, organization_securecode } = req.body;

  try {
    const admin = await Admin.findOne({
      organization_name,
      organization_securecode,
    });

    if (admin) {
      return res.status(200).json({ success: true, message: 'Validation successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid organization name or secure code' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/found-items', async (req, res) => {
  try {
    const foundItems = await FoundItem.find();
    res.status(200).json(foundItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching found items' });
  }
});

router.get('/user-details', authenticateUser, async (req, res) => {
  try {
    const user = req.user; // Extracted from middleware
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
