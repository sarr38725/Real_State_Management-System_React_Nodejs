# Image Database Migration Guide

This guide explains how to migrate from file-based image storage to database BLOB storage.

## Overview

Your application has been updated to store property images directly in the MySQL database as BLOB data instead of files in the `/uploads` folder. This provides several benefits:

- Centralized data storage
- Easier backups (single database backup includes images)
- Better security and access control
- No file system dependencies

## Migration Steps

### Step 1: Update the Database Schema

Run the migration SQL script to add the required columns to your `property_images` table:

```bash
mysql -u root -p real_estate_db < backend/migrations/update_images_to_blob.sql
```

This adds three new columns:
- `image_data` (LONGBLOB) - Stores the actual image binary data
- `mime_type` (VARCHAR) - Stores the image content type (e.g., image/jpeg)
- `file_size` (INT) - Stores the image size in bytes

### Step 2: Migrate Existing Images

Run the migration script to copy existing images from the file system to the database:

```bash
cd backend
node migrate-images-to-db.js
```

This script will:
- Find all images in the `property_images` table that don't have `image_data`
- Read each image file from the `/uploads/properties` folder
- Store it in the database with the correct MIME type
- Show a summary of successfully migrated images

### Step 3: Verify the Migration

Test the application to ensure images are loading correctly:

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Browse properties and verify images are displaying correctly

### Step 4: Cleanup (Optional)

After confirming everything works correctly, you can:

1. Remove the old image files:
```bash
rm -rf backend/uploads/properties/*
```

2. Remove the old `image_url` column from the database:
```sql
ALTER TABLE property_images DROP COLUMN image_url;
```

## How It Works

### Backend Changes

1. **New Upload Middleware** (`backend/middleware/uploadToDb.js`):
   - Uses `multer.memoryStorage()` to keep images in memory
   - Provides helper functions to save/retrieve/delete images from database

2. **Image Serving Endpoint** (`/api/images/:imageId`):
   - Fetches image binary data from database by ID
   - Sets appropriate content-type header
   - Includes caching headers for performance

3. **Updated Controllers**:
   - `createProperty`: Saves uploaded images to database
   - `updateProperty`: Manages image additions/removals in database
   - `getAllProperties` and `getPropertyById`: Return image IDs instead of URLs

### Frontend Changes

1. **Updated imageHelper.js**:
   - `getImageUrl()` now converts image IDs to API endpoint URLs
   - Format: `/api/images/{imageId}`

## API Changes

### Property Response Format

**Before:**
```json
{
  "property": {
    "id": 1,
    "title": "Modern House",
    "images": ["/uploads/properties/property-123.jpg"]
  }
}
```

**After:**
```json
{
  "property": {
    "id": 1,
    "title": "Modern House",
    "images": [45, 46, 47]
  }
}
```

Images are now referenced by their database IDs and fetched via `/api/images/{id}`.

## Troubleshooting

### Images not displaying

1. Check browser console for 404 errors
2. Verify the migration script completed successfully
3. Check that the image route is registered in `server.js`

### Upload errors

1. Verify `multer` is installed: `npm list multer`
2. Check backend logs for error messages
3. Ensure database connection is working

### Performance issues

1. The images endpoint includes cache headers
2. Consider adding database indexes if needed:
```sql
CREATE INDEX idx_property_images_lookup ON property_images(id, property_id);
```

## Rollback

If you need to rollback to file-based storage:

1. Restore the original files:
   - `backend/middleware/upload.js`
   - `backend/controllers/propertyController.js`
   - `backend/routes/propertyRoutes.js`
   - `frontend/src/utils/imageHelper.js`

2. Remove the new files:
   - `backend/middleware/uploadToDb.js`
   - `backend/routes/imageRoutes.js`

3. Revert server.js changes

4. Keep your uploaded files in `/uploads/properties`
