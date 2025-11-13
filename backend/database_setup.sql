-- Real Estate Management System Database Setup
-- Run these commands in PHPMyAdmin or MySQL console

-- Create Database
CREATE DATABASE IF NOT EXISTS real_estate_db;
USE real_estate_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'agent', 'user') DEFAULT 'user',
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    property_type ENUM('house', 'apartment', 'condo', 'land', 'commercial') NOT NULL,
    listing_type ENUM('sale', 'rent') NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'USA',
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    area_sqft INT NOT NULL,
    year_built INT,
    status ENUM('available', 'pending', 'sold', 'rented') DEFAULT 'available',
    featured BOOLEAN DEFAULT FALSE,
    agent_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_agent (agent_id),
    INDEX idx_status (status),
    INDEX idx_featured (featured),
    INDEX idx_listing_type (listing_type),
    INDEX idx_city (city)
);

-- Property Images Table
CREATE TABLE IF NOT EXISTS property_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_property (property_id)
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, property_id),
    INDEX idx_user (user_id),
    INDEX idx_property (property_id)
);

-- Schedules/Appointments Table
CREATE TABLE IF NOT EXISTS schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    user_id INT NOT NULL,
    agent_id INT NOT NULL,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    message TEXT,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_property (property_id),
    INDEX idx_user (user_id),
    INDEX idx_agent (agent_id),
    INDEX idx_status (status),
    INDEX idx_visit_date (visit_date)
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_property (property_id),
    INDEX idx_status (status)
);

-- Insert Default Admin User
-- Email: admin@realestate.com
-- Password: admin123
INSERT INTO users (email, password, full_name, role) VALUES
('admin@realestate.com', '$2b$10$BvziCl9TKHkILiqtJvcAG./bXKJGyT4JD11btGfbBTpgMGDdmxfzK', 'Admin User', 'admin');

-- Sample Data (Optional)
-- Uncomment below to add sample properties

/*
INSERT INTO properties (title, description, property_type, listing_type, price, address, city, state, zip_code, bedrooms, bathrooms, area_sqft, year_built, agent_id, featured) VALUES
('Modern Downtown Apartment', 'Luxurious apartment in the heart of downtown with stunning city views', 'apartment', 'rent', 2500.00, '123 Main St', 'New York', 'NY', '10001', 2, 2, 1200, 2020, 1, TRUE),
('Spacious Family Home', 'Beautiful 4 bedroom home with large backyard and modern amenities', 'house', 'sale', 450000.00, '456 Oak Avenue', 'Los Angeles', 'CA', '90001', 4, 3, 2500, 2018, 1, TRUE),
('Cozy Studio', 'Perfect for young professionals, close to public transport', 'apartment', 'rent', 1500.00, '789 Elm Street', 'Chicago', 'IL', '60601', 1, 1, 600, 2019, 1, FALSE);
*/
