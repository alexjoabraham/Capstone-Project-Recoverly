const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  founditem_name: { type: String, required: true },
  founditem_category: { type: String, required: true },
  founditem_date: { type: Date, required: true },
  founditem_location: { type: String, required: true },
  founditem_description: { type: String, required: true },
  founditem_image: { type: String }, 
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('FoundItem', foundItemSchema);
