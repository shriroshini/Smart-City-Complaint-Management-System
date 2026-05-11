const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/auth');
const upload = require('../config/multer');

// Create complaint
router.post('/', protect, upload.single('beforeImage'), (req, res) => {
  try {
    const { title, description, category, priority, latitude, longitude, address } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const complaint = Complaint.create({
      userId: req.user.id,
      title,
      description,
      category,
      priority,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address,
      beforeImage: req.file.filename
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Complaint creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's complaints
router.get('/my-complaints', protect, (req, res) => {
  try {
    const complaints = Complaint.findByUserId(req.user.id);
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single complaint
router.get('/:id', protect, (req, res) => {
  try {
    const complaint = Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
