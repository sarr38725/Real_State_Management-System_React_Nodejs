-- Migration: Update property_images table to store images as BLOB
-- Run this migration to change from file path storage to database BLOB storage

USE real_estate_db;

-- Add columns for BLOB storage
ALTER TABLE property_images
ADD COLUMN image_data LONGBLOB AFTER image_url,
ADD COLUMN mime_type VARCHAR(50) AFTER image_data,
ADD COLUMN file_size INT AFTER mime_type;

-- The image_url column is kept for backward compatibility during migration
-- After all images are migrated, you can optionally drop it with:
-- ALTER TABLE property_images DROP COLUMN image_url;
