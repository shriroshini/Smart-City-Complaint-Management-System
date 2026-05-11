const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../config/multer');

// Get all complaints (Admin)
router.get('/complaints', protect, adminOnly, (req, res) => {
  try {
    const { status, priority } = req.query;
    const complaints = Complaint.findAll({ status, priority });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update complaint status
router.patch('/complaints/:id/status', protect, adminOnly, (req, res) => {
  try {
    const { status } = req.body;
    const complaint = Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const updated = Complaint.updateStatus(req.params.id, status);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload after image
router.patch('/complaints/:id/after-image', protect, adminOnly, upload.single('afterImage'), (req, res) => {
  try {
    const complaint = Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const updated = Complaint.updateAfterImage(req.params.id, req.file ? req.file.filename : null);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get analytics
router.get('/analytics', protect, adminOnly, (req, res) => {
  try {
    const total = Complaint.count();
    const pending = Complaint.count({ status: 'pending' });
    const inProgress = Complaint.count({ status: 'in-progress' });
    const resolved = Complaint.count({ status: 'resolved' });
    const highPriority = Complaint.count({ priority: 'high' });

    res.json({ total, pending, inProgress, resolved, highPriority });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
