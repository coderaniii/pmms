const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  personal_no: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'operator' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);