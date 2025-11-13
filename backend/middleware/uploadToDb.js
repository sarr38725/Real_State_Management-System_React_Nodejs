const multer = require('multer');
const db = require('../config/database');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

const saveImageToDb = async (propertyId, imageBuffer, mimeType, isPrimary = false) => {
  try {
    const [result] = await db.query(
      'INSERT INTO property_images (property_id, image_data, mime_type, file_size, is_primary) VALUES (?, ?, ?, ?, ?)',
      [propertyId, imageBuffer, mimeType, imageBuffer.length, isPrimary]
    );
    return result.insertId;
  } catch (error) {
    throw new Error(`Failed to save image to database: ${error.message}`);
  }
};

const getImageFromDb = async (imageId) => {
  try {
    const [images] = await db.query(
      'SELECT image_data, mime_type FROM property_images WHERE id = ?',
      [imageId]
    );

    if (images.length === 0) {
      return null;
    }

    return images[0];
  } catch (error) {
    throw new Error(`Failed to retrieve image from database: ${error.message}`);
  }
};

const deleteImageFromDb = async (imageId) => {
  try {
    await db.query('DELETE FROM property_images WHERE id = ?', [imageId]);
  } catch (error) {
    throw new Error(`Failed to delete image from database: ${error.message}`);
  }
};

module.exports = {
  upload,
  saveImageToDb,
  getImageFromDb,
  deleteImageFromDb
};
