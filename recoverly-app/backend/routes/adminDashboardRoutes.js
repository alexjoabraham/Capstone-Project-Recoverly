const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const multer = require('multer');
const FoundItem = require('../models/FoundItem');
const express = require('express');
const router = express.Router();

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
  .post((req, res, next) => {
    upload.single('founditem_image')(req, res, (err) => {
      if (err) {
        console.error('Multer upload error:', err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  }, async (req, res) => {
    try {
      const { founditem_name, founditem_location, founditem_description, founditem_category, founditem_date, admin_id } = req.body;
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
  .get(async (req, res) => {
    try {
      const foundItems = await FoundItem.find();
      res.status(200).json(foundItems);
    } catch (error) {
      console.error('Error fetching found items:', error);
      res.status(500).json({ message: error.message || 'Error fetching found items' });
    }
  });

module.exports = router;
