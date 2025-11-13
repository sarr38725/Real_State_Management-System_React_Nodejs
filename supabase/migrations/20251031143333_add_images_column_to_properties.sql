/*
  # Add images column to properties table

  1. Changes
    - Add `images` column to `properties` table as JSONB array to store multiple image URLs
    - Set default empty array for existing properties
  
  2. Purpose
    - Allow properties to have multiple images
    - Store image URLs uploaded by users
    - Fallback to random images only when no images are uploaded
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'images'
  ) THEN
    ALTER TABLE properties ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;