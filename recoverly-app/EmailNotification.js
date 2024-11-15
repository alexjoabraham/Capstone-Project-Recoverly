const mongoose = require('mongoose');

const emailNotificationSchema = new mongoose.Schema({
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, 
  email: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('EmailNotification', emailNotificationSchema);
