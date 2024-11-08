const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const multer = require('multer');
const LostItem = require('../models/LostItem');
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
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `lost-items/${Date.now()}-${file.originalname}`);
    },
  }),
});

router.post('/report-lost-item', upload.single('lostitem_image'), async (req, res) => {
  try {
    const { lostitem_name, lostitem_location, lostitem_description, lostitem_category, lostitem_date } = req.body;
    const imageUrl = req.file ? req.file.location : null;

    const newLostItem = new LostItem({
      lostitem_name,
      lostitem_location,
      lostitem_description,
      lostitem_category,
      lostitem_date,
      lostitem_image: imageUrl, 
    });

    await newLostItem.save();
    res.status(201).json({ message: 'Lost item reported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error reporting lost item', error: error.message });
  }
});

module.exports = router;
