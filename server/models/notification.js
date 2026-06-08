const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' },
  damage_code: { type: String },
  functional_location: { type: String },
  equipment: { type: String },
  start_date: { type: Date },
  end_date: { type: Date },
  persons_required: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);