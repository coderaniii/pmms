const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Notification = require('../models/notification');
const WorkOrder = require('../models/WorkOrder');
const PreventiveTask = require('../models/PreventiveTask');

// GET /api/dashboard
router.get('/', protect, async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const openWorkOrders = await WorkOrder.countDocuments({ status: 'Open' });
    const completedWorkOrders = await WorkOrder.countDocuments({ status: 'Completed' });
    const pendingPreventiveTasks = await PreventiveTask.countDocuments({ status: 'Pending' });

    res.json({
      totalNotifications,
      openWorkOrders,
      completedWorkOrders,
      pendingPreventiveTasks
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;