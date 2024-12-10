const mongoose = require('mongoose');

const emailNotificationSchema = new mongoose.Schema({
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true },
  disabled: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('EmailNotification', emailNotificationSchema);
