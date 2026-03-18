const express = require('express');
const router = express.Router();
const Banner = require('../models/banner');
const multer = require('multer');
const path = require('path');

// Configure Multer for Banners
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/banners/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// GET all active banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ active: true });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST or UPDATE a banner based on slot/type
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, link, type, slot } = req.body;
    let imageUrl = req.body.image; // Fallback for case where no new file is uploaded but URL is provided

    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/banners/${req.file.filename}`;
    }

    // Find and update if exists, otherwise create
    const banner = await Banner.findOneAndUpdate(
      { type, slot },
      { title, subtitle, link, image: imageUrl, active: true },
      { new: true, upsert: true }
    );

    res.status(200).json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a banner
router.delete('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    
    await banner.deleteOne();
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
