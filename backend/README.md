# Real Estate Management System - Backend

## Setup Instructions

### 1. Database Setup
1. Open PHPMyAdmin or MySQL console
2. Import the `database_setup.sql` file or run the SQL commands manually
3. The script will create the database and all necessary tables

### 2. Environment Configuration
1. Copy `.env.example` to `.env`
2. Update the database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=real_estate_db
   ```
3. Change the JWT_SECRET to a secure random string

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
npm start
```

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (protected)

### Properties
- GET `/api/properties` - Get all properties (with filters)
- GET `/api/properties/:id` - Get property by ID
- POST `/api/properties` - Create property (admin/agent only)
- PUT `/api/properties/:id` - Update property (admin/agent only)
- DELETE `/api/properties/:id` - Delete property (admin/agent only)

## Default Admin Credentials
- Email: admin@realestate.com
- Password: admin123
