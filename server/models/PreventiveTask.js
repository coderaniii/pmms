const mongoose = require('mongoose');

const preventiveTaskSchema = new mongoose.Schema({
  task_name: { type: String, required: true },
  frequency_days: { type: Number, required: true },
  last_completed: { type: Date },
  next_due: { type: Date },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('PreventiveTask', preventiveTaskSchema);