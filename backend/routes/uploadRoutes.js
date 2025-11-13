const express = require('express');
const router = express.Router();
const { upload, saveImageToDb } = require('../middleware/uploadToDb');
const { authenticate } = require('../middleware/auth');

router.post('/images', authenticate, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imageIds = [];

    for (const file of req.files) {
      const imageId = await saveImageToDb(
        null,
        file.buffer,
        file.mimetype,
        false
      );
      imageIds.push(imageId);
    }

    res.json({
      message: 'Images uploaded successfully',
      images: imageIds
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;
