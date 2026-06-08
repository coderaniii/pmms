const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  notification_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true },
  assigned_team: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Completed'], default: 'Open' },
  start_datetime: { type: Date },
  end_datetime: { type: Date },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('WorkOrder', workOrderSchema);