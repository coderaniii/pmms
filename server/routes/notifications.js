const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleWare');
const Notification = require('../models/notification');
const WorkOrder = require('../models/WorkOrder');

// GET /api/notifications
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find().populate('user_id', 'name personal_no');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/notifications
router.post('/', protect, async (req, res) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      user_id: req.user.id
    });

    // Auto-create a work order when notification is created
    await WorkOrder.create({
      notification_id: notification._id,
      assigned_team: 'Unassigned',
      status: 'Open'
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;