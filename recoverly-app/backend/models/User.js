const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  user_email: { type: String, required: true, unique: true },
  user_phone: { type: String, required: true },
  user_password: { type: String, required: true }, 
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
