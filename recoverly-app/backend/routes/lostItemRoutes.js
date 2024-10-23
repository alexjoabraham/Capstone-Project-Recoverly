const express = require('express');
const multer = require('multer');
const LostItem = require('../models/LostItem'); 

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({ storage: storage });

router.post('/report-lost-item', upload.single('lostitem_image'), async (req, res) => {
  try {
    const { lostitem_name, lostitem_location, lostitem_description, lostitem_category, lostitem_date } = req.body;
    const image = req.file ? req.file.filename : null; 

    const newLostItem = new LostItem({
      lostitem_name,
      lostitem_location,
      lostitem_description,
      lostitem_category,
      lostitem_date,
      lostitem_image: image, 
    });

    await newLostItem.save();
    res.status(201).json({ message: 'Lost item reported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error reporting lost item', error: error.message });
  }
});

module.exports = router;
