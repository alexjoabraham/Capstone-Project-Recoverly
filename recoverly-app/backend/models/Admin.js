const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  admin_name: { type: String, required: true },
  admin_phone: { type: String, required: true },
  organization_name: { type: String, required: true },
  organization_address: { type: String, required: true },
  organization_securecode: { type: String, required: true },
  admin_password: { type: String, required: true }, 
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);
