const express = require('express');
const router = express.Router();
const { getImageFromDb } = require('../middleware/uploadToDb');

router.get('/:imageId', async (req, res) => {
  try {
    const imageId = req.params.imageId;

    const image = await getImageFromDb(imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.setHeader('Content-Type', image.mime_type);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(image.image_data);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ message: 'Failed to retrieve image', error: error.message });
  }
});

module.exports = router;
