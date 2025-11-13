# Complete MySQL-Only Real Estate System

## 🎯 System Overview

এই সিস্টেমে **সব কিছু MySQL database এ থাকবে**। Supabase বা কোনো external cloud storage use করা হয় নি।

### Data Storage:
- ✅ **User Data** → MySQL `users` table
- ✅ **Property Data** → MySQL `properties` table
- ✅ **Property Images** → Backend server `/uploads/properties/` folder
- ✅ **Image URLs** → MySQL `property_images` table

---

## 📁 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Uploads Image                    │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend: FormData → POST /api/upload/images           │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Backend: Multer saves file to disk                      │
│  Location: backend/uploads/properties/property-123.jpg   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Backend returns: /uploads/properties/property-123.jpg   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend: Saves URL to property data                    │
│  POST /api/properties with images array                  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Backend: Saves to MySQL property_images table           │
│  Columns: id, property_id, image_url, is_primary         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Display: http://localhost:5000/uploads/properties/...  │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Structure (MySQL)

### Tables:

#### 1. users
```sql
- id (INT)
- email (VARCHAR)
- password (VARCHAR, hashed)
- full_name (VARCHAR)
- phone (VARCHAR)
- role (ENUM: admin, agent, user)
- profile_image (VARCHAR)
- created_at (TIMESTAMP)
```

#### 2. properties
```sql
- id (INT)
- title (VARCHAR)
- description (TEXT)
- property_type (ENUM)
- listing_type (ENUM)
- price (DECIMAL)
- address, city, state, zip_code (VARCHAR)
- bedrooms, bathrooms (INT)
- area_sqft (INT)
- year_built (INT)
- status (ENUM)
- featured (BOOLEAN)
- agent_id (INT, FK to users)
- created_at, updated_at (TIMESTAMP)
```

#### 3. property_images
```sql
- id (INT)
- property_id (INT, FK to properties)
- image_url (VARCHAR) -- e.g. "/uploads/properties/property-123.jpg"
- is_primary (BOOLEAN)
- created_at (TIMESTAMP)
```

---

## 🔧 Backend Setup

### Files Created/Modified:

#### 1. `backend/middleware/upload.js` (NEW)
Multer configuration for file uploads:
- Saves to `backend/uploads/properties/`
- Generates unique filenames
- Validates file types (jpg, png, gif, webp)
- Max size: 5MB

#### 2. `backend/routes/uploadRoutes.js` (NEW)
Upload endpoint:
```javascript
POST /api/upload/images
- Accepts: multipart/form-data
- Field name: 'images' (array, max 10 files)
- Returns: { images: ["/uploads/properties/file1.jpg", ...] }
```

#### 3. `backend/server.js` (MODIFIED)
Added:
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoutes);
```

#### 4. `backend/package.json` (MODIFIED)
Added dependency:
```json
"multer": "^1.4.5-lts.1"
```

---

## 🎨 Frontend Setup

### Files Created/Modified:

#### 1. `frontend/src/utils/imageHelper.js` (NEW)
Helper functions:
```javascript
getImageUrl(imagePath)
// Input: "/uploads/properties/file.jpg"
// Output: "http://localhost:5000/uploads/properties/file.jpg"

getImageUrls(images)
// Converts array of paths to full URLs
```

#### 2. `frontend/src/context/PropertyContext.jsx` (MODIFIED)

**addProperty function:**
```javascript
// 1. Upload images to backend
const formData = new FormData();
imageFiles.forEach(file => formData.append('images', file));

const uploadResponse = await fetch('http://localhost:5000/api/upload/images', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

// 2. Get image URLs
const uploadData = await uploadResponse.json();
imageUrls = uploadData.images; // ["/uploads/properties/..."]

// 3. Save property with image URLs
await propertyService.createProperty({
  ...propertyData,
  images: imageUrls
});
```

#### 3. Components Updated:
- `PropertyCard.jsx` - Uses `getImageUrl()` helper
- `PropertyDetailPage.jsx` - Uses `getImageUrls()` helper
- `AdminProperties.jsx` - Uses `getImageUrl()` helper

---

## 🚀 How to Run

### 1. Start MySQL Server
```bash
# XAMPP/WAMP এ MySQL start করুন
# অথবা
sudo systemctl start mysql
```

### 2. Create Database
```bash
# PHPMyAdmin এ যান অথবা MySQL console এ:
mysql -u root -p

# backend/database_setup.sql file টা run করুন
# এতে সব tables create হবে
```

### 3. Backend Setup
```bash
cd backend
npm install
npm start

# Server চালু হবে: http://localhost:5000
# Static files serve হবে: http://localhost:5000/uploads/properties/...
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev

# App চালু হবে: http://localhost:5173
```

---

## 📤 Image Upload Flow (Step by Step)

### Example: Adding a Property with 3 Images

#### Step 1: User Selects Images
```javascript
// AddPropertyPage.jsx
<input type="file" multiple onChange={handleImageUpload} />
```

#### Step 2: Upload to Backend
```javascript
// PropertyContext.jsx - addProperty()
const formData = new FormData();
imageFiles.forEach(file => formData.append('images', file));

const response = await fetch('http://localhost:5000/api/upload/images', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer token...' },
  body: formData
});

// Response:
{
  "images": [
    "/uploads/properties/property-1730478123456-123456789.jpg",
    "/uploads/properties/property-1730478123457-987654321.jpg",
    "/uploads/properties/property-1730478123458-456789123.jpg"
  ]
}
```

#### Step 3: Files Saved on Disk
```
backend/
  uploads/
    properties/
      property-1730478123456-123456789.jpg  ← Actual file
      property-1730478123457-987654321.jpg
      property-1730478123458-456789123.jpg
```

#### Step 4: Create Property
```javascript
await propertyService.createProperty({
  title: "Beautiful House",
  price: 450000,
  images: [
    "/uploads/properties/property-1730478123456-123456789.jpg",
    "/uploads/properties/property-1730478123457-987654321.jpg",
    "/uploads/properties/property-1730478123458-456789123.jpg"
  ],
  // ... other data
});
```

#### Step 5: Backend Saves to MySQL
```sql
-- properties table
INSERT INTO properties (...) VALUES (...);
-- Returns property_id = 5

-- property_images table
INSERT INTO property_images (property_id, image_url, is_primary)
VALUES
  (5, '/uploads/properties/property-1730478123456-123456789.jpg', true),
  (5, '/uploads/properties/property-1730478123457-987654321.jpg', false),
  (5, '/uploads/properties/property-1730478123458-456789123.jpg', false);
```

#### Step 6: Display Images
```javascript
// PropertyCard.jsx
<img src="http://localhost:5000/uploads/properties/property-1730478123456-123456789.jpg" />
```

---

## 🔐 Security Features

### 1. File Upload Security
- ✅ Only authenticated users can upload
- ✅ File type validation (only images)
- ✅ File size limit (5MB)
- ✅ Unique filenames (prevents overwrite)

### 2. Database Security
- ✅ Passwords hashed with bcryptjs
- ✅ JWT authentication
- ✅ Foreign key constraints
- ✅ Proper indexes

### 3. API Security
- ✅ CORS enabled
- ✅ Protected routes with middleware
- ✅ Role-based access control

---

## 📊 API Endpoints

### Upload
```
POST /api/upload/images
Headers: Authorization: Bearer <token>
Body: multipart/form-data (field: 'images')
Response: { images: [...urls] }
```

### Properties
```
GET    /api/properties           - All properties
GET    /api/properties/:id       - Single property
POST   /api/properties           - Create (requires auth)
PUT    /api/properties/:id       - Update (requires auth)
DELETE /api/properties/:id       - Delete (requires auth)
```

### Static Files
```
GET /uploads/properties/:filename - Serve uploaded images
```

---

## 🎨 Frontend Image Display

### Helper Usage:
```javascript
import { getImageUrl, getImageUrls } from '../utils/imageHelper';

// Single image
const imageUrl = getImageUrl("/uploads/properties/file.jpg");
// Result: "http://localhost:5000/uploads/properties/file.jpg"

// Multiple images
const imageUrls = getImageUrls([
  "/uploads/properties/file1.jpg",
  "/uploads/properties/file2.jpg"
]);
// Result: [
//   "http://localhost:5000/uploads/properties/file1.jpg",
//   "http://localhost:5000/uploads/properties/file2.jpg"
// ]
```

---

## 🐛 Troubleshooting

### Images not showing?
1. Check backend server is running
2. Verify files exist in `backend/uploads/properties/`
3. Check browser console for 404 errors
4. Ensure image URLs start with `/uploads/`

### Upload failing?
1. Check user is authenticated
2. Verify file size < 5MB
3. Check file type is image
4. Check backend logs for errors

### Database connection error?
1. Ensure MySQL is running
2. Verify credentials in `backend/.env`
3. Check database exists: `real_estate_db`

---

## ✅ Summary

### What's Different from Supabase Version:

| Feature | Supabase Version | MySQL-Only Version |
|---------|------------------|-------------------|
| Database | Supabase PostgreSQL | MySQL (local) |
| Image Storage | Supabase Storage | Local disk |
| Image URLs | Supabase public URLs | Server static URLs |
| Auth | Supabase Auth | Custom JWT |
| Hosting | Cloud | Local |

### Advantages:
- ✅ No external dependencies
- ✅ Complete control over data
- ✅ No internet required
- ✅ No monthly costs
- ✅ Faster for local development

### Considerations:
- ⚠️ Need to backup `uploads/` folder manually
- ⚠️ Images stored on server disk
- ⚠️ For production, consider CDN for images
- ⚠️ Need proper server for deployment

---

## 🚀 Next Steps

1. **Test the system:**
   - Create property with images
   - Edit property and update images
   - View properties on all pages
   - Check admin dashboard

2. **Backup:**
   - Backup MySQL database regularly
   - Backup `backend/uploads/` folder

3. **Production:**
   - Use environment variables for production
   - Set up proper file permissions
   - Consider image optimization
   - Use CDN for better performance

---

**সব কিছু MySQL এ working! 🎉**
