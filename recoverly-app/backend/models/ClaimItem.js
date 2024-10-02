const mongoose = require('mongoose');

const claimItemSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  founditem_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundItem', required: true },
  claim_image: { type: String },
  userclaim_description: { type: String, required: true },
  claimapproved: { type: Boolean, default: false },
  reason: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('ClaimItem', claimItemSchema);
