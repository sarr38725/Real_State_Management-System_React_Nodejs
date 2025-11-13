const fs = require('fs');
const path = require('path');
const db = require('./config/database');

async function migrateImagesToDb() {
  console.log('Starting image migration to database...');

  try {
    const [images] = await db.query(
      'SELECT id, property_id, image_url, is_primary FROM property_images WHERE image_data IS NULL'
    );

    console.log(`Found ${images.length} images to migrate`);

    let successCount = 0;
    let failCount = 0;

    for (const image of images) {
      try {
        const imagePath = path.join(__dirname, image.image_url);

        if (!fs.existsSync(imagePath)) {
          console.log(`⚠️  File not found: ${imagePath}`);
          failCount++;
          continue;
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const ext = path.extname(imagePath).toLowerCase();

        const mimeTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp'
        };

        const mimeType = mimeTypes[ext] || 'image/jpeg';

        await db.query(
          'UPDATE property_images SET image_data = ?, mime_type = ?, file_size = ? WHERE id = ?',
          [imageBuffer, mimeType, imageBuffer.length, image.id]
        );

        console.log(`✅ Migrated image ID ${image.id} (${path.basename(imagePath)})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to migrate image ID ${image.id}:`, error.message);
        failCount++;
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total images: ${images.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed: ${failCount}`);

    if (successCount > 0) {
      console.log('\n⚠️  IMPORTANT: After verifying the migration, you can:');
      console.log('1. Remove the /uploads/properties folder to free up disk space');
      console.log('2. Run this query to remove the old image_url column:');
      console.log('   ALTER TABLE property_images DROP COLUMN image_url;');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateImagesToDb();
