const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  lostitem_name: { type: String, required: true },
  lostitem_date: { type: Date },
  lostitem_location: { type: String, required: true },
  lostitem_category: { type: String, required: true },
  lostitem_description: { type: String, required: true },
  lostitem_image: { type: String }, 
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, 
  found_flag: { type: Boolean, default: false },
  notfound_flag: { type: Boolean, default: false },
  notify_flag: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('LostItem', lostItemSchema);
