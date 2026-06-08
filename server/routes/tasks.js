const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const PreventiveTask = require('../models/PreventiveTask');

// GET /api/tasks
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await PreventiveTask.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks
router.post('/', protect, async (req, res) => {
  try {
    const task = await PreventiveTask.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/tasks/:id/complete
router.patch('/:id/complete', protect, async (req, res) => {
  try {
    const task = await PreventiveTask.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const today = new Date();
    const nextDue = new Date(today);
    nextDue.setDate(today.getDate() + task.frequency_days);

    const updated = await PreventiveTask.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Completed',
        last_completed: today,
        next_due: nextDue
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;