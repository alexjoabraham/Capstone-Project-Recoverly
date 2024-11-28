const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');

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
    const updatedItem = await LostItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item' });
  }
});

module.exports = router;
