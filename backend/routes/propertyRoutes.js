const express = require('express');
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload'); // <-- Multer middleware

const router = express.Router();

// Public
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Create (accept JSON or multipart with images[])
router.post(
  '/',
  authenticate,
  authorize('admin', 'agent'),
  upload.array('images', 20),     // <-- IMPORTANT: field name must be 'images'
  createProperty
);

// Update (accept JSON or multipart with images[])
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'agent'),
  upload.array('images', 20),     // <-- IMPORTANT for editing images
  updateProperty
);

// Delete
router.delete('/:id', authenticate, authorize('admin', 'agent'), deleteProperty);

module.exports = router;
