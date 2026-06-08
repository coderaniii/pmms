const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const WorkOrder = require('../models/WorkOrder');

// GET /api/workorders
router.get('/', protect, async (req, res) => {
  try {
    const workOrders = await WorkOrder.find()
      .populate({
        path: 'notification_id',
        select: 'description priority equipment'
      });
    res.json(workOrders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/workorders/:id/status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status, completed } = req.body;
    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      { status, completed, end_datetime: completed ? new Date() : null },
      { new: true }
    );
    res.json(workOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;