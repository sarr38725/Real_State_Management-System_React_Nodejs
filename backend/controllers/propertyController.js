const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const { saveImageToDb } = require('../middleware/uploadToDb');

/** ---------- helpers ---------- */

function toBool(v) {
  if (typeof v === 'boolean') return v;
  if (v === 'true') return true;
  if (v === '1') return true;
  return false;
}

function ensureArray(v) {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  // If it looks like JSON array/stringified object
  try {
    const parsed = JSON.parse(v);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  // Comma-separated string fallback
  if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}

// Try to delete a local file (best-effort; ignore errors)
function tryDeleteLocalByUrl(url) {
  try {
    // Expecting URLs like: /uploads/properties/<filename>
    const rel = url.startsWith('/') ? url : `/${url}`;
    const abs = path.join(process.cwd(), rel);
    if (abs.includes(path.join('..', ''))) return; // safety
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (e) {
    // swallow errors, log only
    console.warn('File delete failed:', url, e.message);
  }
}

/** ---------- controllers ---------- */

const getAllProperties = async (req, res) => {
  try {
    const { city, property_type, listing_type, min_price, max_price, bedrooms, status, featured } = req.query;

    let query = `
      SELECT p.*, u.full_name as agent_name, u.email as agent_email, u.phone as agent_phone
      FROM properties p
      LEFT JOIN users u ON p.agent_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (city) {
      query += ' AND p.city LIKE ?';
      params.push(`%${city}%`);
    }
    if (property_type) {
      query += ' AND p.property_type = ?';
      params.push(property_type);
    }
    if (listing_type) {
      query += ' AND p.listing_type = ?';
      params.push(listing_type);
    }
    if (min_price) {
      query += ' AND p.price >= ?';
      params.push(min_price);
    }
    if (max_price) {
      query += ' AND p.price <= ?';
      params.push(max_price);
    }
    if (bedrooms) {
      query += ' AND p.bedrooms >= ?';
      params.push(bedrooms);
    }
    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }
    if (featured === 'true') {
      query += ' AND p.featured = 1 AND p.status = ?';
      params.push('available');
    }

    query += ' ORDER BY p.featured DESC, p.created_at DESC';

    const [properties] = await db.query(query, params);

    const propertiesWithImages = await Promise.all(
      properties.map(async (property) => {
        const [images] = await db.query(
          'SELECT id FROM property_images WHERE property_id = ? ORDER BY is_primary DESC, id ASC',
          [property.id]
        );
        return {
          ...property,
          images: images && images.length > 0 ? images.map(img => img.id) : []
        };
      })
    );

    res.json({ properties: propertiesWithImages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const [properties] = await db.query(
      `SELECT p.*, u.full_name as agent_name, u.email as agent_email, u.phone as agent_phone
       FROM properties p
       LEFT JOIN users u ON p.agent_id = u.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (properties.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const [images] = await db.query(
      'SELECT id FROM property_images WHERE property_id = ? ORDER BY is_primary DESC, id ASC',
      [req.params.id]
    );

    res.json({
      property: {
        ...properties[0],
        images: images && images.length > 0 ? images.map(img => img.id) : []
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createProperty = async (req, res) => {
  try {
    // Support both JSON and multipart (propertyData blob)
    const raw = req.body.propertyData || null;
    let body = req.body;
    if (raw) {
      try { body = JSON.parse(raw); } catch {
        return res.status(400).json({ message: 'propertyData invalid JSON' });
      }
    }

    const {
      title, description, property_type, listing_type, price, address,
      city, state, zip_code, country, bedrooms, bathrooms, area_sqft,
      year_built, featured, images
    } = body;

    const [result] = await db.query(
      `INSERT INTO properties (title, description, property_type, listing_type, price,
       address, city, state, zip_code, country, bedrooms, bathrooms, area_sqft,
       year_built, featured, agent_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, property_type, listing_type, price, address, city, state,
        zip_code, country || 'USA', bedrooms || 0, bathrooms || 0, area_sqft,
        year_built || null, !!featured, req.user.id
      ]
    );

    const propertyId = result.insertId;

    // Save uploaded images to database
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        await saveImageToDb(
          propertyId,
          req.files[i].buffer,
          req.files[i].mimetype,
          i === 0
        );
      }
    }

    res.status(201).json({ message: 'Property created successfully', propertyId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Accept both JSON and multipart (propertyData)
    const raw = req.body.propertyData || null;
    let body;
    if (raw) {
      try { body = JSON.parse(raw); } catch {
        return res.status(400).json({ message: 'propertyData invalid JSON' });
      }
    } else {
      body = req.body;
    }

    // Extract fields (and normalize)
    const {
      title, description, property_type, listing_type, price, address,
      city, state, zip_code, country, bedrooms, bathrooms, area_sqft,
      year_built, status, featured,
      images,               // existing images still kept (from client state)
      imagesToRemove,       // images user deleted on UI
      replaceImages         // boolean
    } = body;

    const [properties] = await db.query('SELECT agent_id FROM properties WHERE id = ?', [propertyId]);
    if (properties.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (properties[0].agent_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db.query(
      `UPDATE properties SET title = ?, description = ?, property_type = ?, listing_type = ?,
       price = ?, address = ?, city = ?, state = ?, zip_code = ?, country = ?, bedrooms = ?,
       bathrooms = ?, area_sqft = ?, year_built = ?, status = ?, featured = ? WHERE id = ?`,
      [
        title, description, property_type, listing_type, price, address, city, state, zip_code,
        country, bedrooms, bathrooms, area_sqft, year_built, status, !!featured, propertyId
      ]
    );

    /** ---------- images update logic ---------- */

    // Normalize arrays
    const existingImages = ensureArray(images);         // image IDs still kept
    const toRemove = ensureArray(imagesToRemove);       // image IDs to remove
    const doReplace = toBool(replaceImages);

    if (doReplace) {
      // Delete ALL images for this property
      await db.query('DELETE FROM property_images WHERE property_id = ?', [propertyId]);

      // Insert only the newly uploaded files
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          await saveImageToDb(
            propertyId,
            req.files[i].buffer,
            req.files[i].mimetype,
            i === 0
          );
        }
      }
    } else {
      // Selective remove
      if (toRemove.length > 0) {
        await db.query(
          `DELETE FROM property_images WHERE property_id = ? AND id IN (${toRemove.map(() => '?').join(',')})`,
          [propertyId, ...toRemove]
        );
      }

      // Insert newly uploaded files
      if (req.files && req.files.length > 0) {
        const [afterRows] = await db.query(
          'SELECT COUNT(*) as cnt FROM property_images WHERE property_id = ?',
          [propertyId]
        );
        const countBefore = Number(afterRows[0].cnt) || 0;

        for (let i = 0; i < req.files.length; i++) {
          await saveImageToDb(
            propertyId,
            req.files[i].buffer,
            req.files[i].mimetype,
            countBefore === 0 && i === 0
          );
        }
      }
    }

    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    console.error('updateProperty error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;

    const [properties] = await db.query('SELECT agent_id FROM properties WHERE id = ?', [propertyId]);
    if (properties.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (properties[0].agent_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // delete all images for this property
    await db.query('DELETE FROM property_images WHERE property_id = ?', [propertyId]);

    await db.query('DELETE FROM properties WHERE id = ?', [propertyId]);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
};
