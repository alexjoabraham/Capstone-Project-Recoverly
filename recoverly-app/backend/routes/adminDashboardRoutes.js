const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const multer = require('multer');
const FoundItem = require('../models/FoundItem');
const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/authenticateAdmin')

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'recoverlyawsbucket',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `found-items/${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extName = fileTypes.test(file.mimetype);
    if (extName) {
      cb(null, true);
    } else {
      cb(new Error('Only images with jpeg, jpg, png, or webp formats are allowed!'));
    }
  },
});

router.route('/')
  .post(authenticateAdmin, (req, res, next) => {
    console.log('POST /admin-dashboard - Admin Authenticated:', req.adminId);
    upload.single('founditem_image')(req, res, (err) => {
      if (err) {
        console.error('Multer upload error:', err);
        return res.status(400).json({ message: err.message });
      }
      console.log('Multer Upload Success - File:', req.file);
      next();
    });
  }, async (req, res) => {
    try {
      console.log('POST /admin-dashboard - Request Body:', req.body);
      const admin_id = req.adminId;
      console.log('Received admin_id:', admin_id);
      if (!admin_id) {
        return res.status(403).json({ message: 'Admin not authenticated' });
      }

      const { founditem_name, founditem_location, founditem_description, founditem_category, founditem_date } = req.body;
      const imageUrl = req.file ? req.file.location : null;

      const newFoundItem = new FoundItem({
        founditem_name,
        founditem_location,
        founditem_description,
        founditem_category,
        founditem_date,
        founditem_image: imageUrl,
        admin_id,
      });

      await newFoundItem.save();
      const foundItems = await FoundItem.find();
      res.status(201).json({ message: 'Found item added successfully', foundItems });
    } catch (error) {
      console.error('Error saving found item:', error);
      res.status(400).json({ message: error.message || 'Error adding found item' });
    }
  })
  .get(authenticateAdmin, async (req, res) => {
    try {
      const foundItems = await FoundItem.find();
      res.status(200).json(foundItems);
    } catch (error) {
      console.error('Error fetching found items:', error);
      res.status(500).json({ message: error.message || 'Error fetching found items' });
    }
  });

router.put('/:id', (req, res, next) => {
  upload.single('founditem_image')(req, res, (err) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { founditem_name, founditem_location, founditem_description, founditem_category, founditem_date } = req.body;
    const updateData = {
      founditem_name,
      founditem_location,
      founditem_description,
      founditem_category,
      founditem_date,
    };
    if (req.file) {
      updateData.founditem_image = req.file.location;
    }

    const updatedItem = await FoundItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const foundItems = await FoundItem.find();
    res.status(200).json({ message: 'Found item updated successfully', foundItems });
  } catch (error) {
    console.error('Error updating found item:', error);
    res.status(400).json({ message: error.message || 'Error updating found item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    const deletedItem = await FoundItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const foundItems = await FoundItem.find();
    res.status(200).json({ message: 'Found item deleted successfully', foundItems });
  } catch (error) {
    console.error('Error deleting found item:', error);
    res.status(400).json({ message: error.message || 'Error deleting found item' });
  }
});

module.exports = router;
