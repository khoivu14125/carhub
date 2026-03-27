CREATE DATABASE IF NOT EXISTS carhub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE carhub_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS ViewingRequests;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Cars;
DROP TABLE IF EXISTS Users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('buyer', 'seller', 'admin') NOT NULL DEFAULT 'buyer',
  phone VARCHAR(30) NULL,
  avatar TEXT NULL,
  reset_password_token VARCHAR(255) NULL,
  reset_password_expire BIGINT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand VARCHAR(120) NOT NULL,
  model_name VARCHAR(120) NOT NULL,
  year INT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  specs TEXT NULL,
  description TEXT NULL,
  images LONGTEXT NULL,
  seller_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'sold') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cars_seller
    FOREIGN KEY (seller_id) REFERENCES Users(id)
    ON DELETE CASCADE
);

CREATE TABLE Orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  buyer_id INT NOT NULL,
  car_id INT NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  address VARCHAR(255) NOT NULL,
  paymentMethod VARCHAR(50) NOT NULL,
  paymentStatus ENUM('unpaid', 'paid', 'failed') NOT NULL DEFAULT 'unpaid',
  transactionId VARCHAR(120) NULL,
  paymentDate DATETIME NULL,
  order_status ENUM('processing', 'confirmed', 'cancelled') NOT NULL DEFAULT 'processing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_buyer
    FOREIGN KEY (buyer_id) REFERENCES Users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_orders_car
    FOREIGN KEY (car_id) REFERENCES Cars(id)
    ON DELETE CASCADE
);

CREATE TABLE ViewingRequests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  seller_id INT NOT NULL,
  buyer_id INT NULL,
  full_name VARCHAR(120) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  preferred_time DATETIME NOT NULL,
  message TEXT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_viewing_car
    FOREIGN KEY (car_id) REFERENCES Cars(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_viewing_seller
    FOREIGN KEY (seller_id) REFERENCES Users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_viewing_buyer
    FOREIGN KEY (buyer_id) REFERENCES Users(id)
    ON DELETE SET NULL
);

-- Mật khẩu cho tất cả tài khoản seed: 123456
INSERT INTO Users (name, email, password, role, phone) VALUES
('Admin CarHub', 'admin@carhub.com', '$2b$10$cH1dRsEDLejMD8K9IpqWauaotJT5hxBMwvCQPPRtGPBxkqJKx/n7W', 'admin', '0900000001'),
('Seller Demo', 'seller@carhub.com', '$2b$10$cH1dRsEDLejMD8K9IpqWauaotJT5hxBMwvCQPPRtGPBxkqJKx/n7W', 'seller', '0900000002'),
('Buyer Demo', 'buyer@carhub.com', '$2b$10$cH1dRsEDLejMD8K9IpqWauaotJT5hxBMwvCQPPRtGPBxkqJKx/n7W', 'buyer', '0900000003');

INSERT INTO Cars (brand, model_name, year, price, specs, description, images, seller_id, status) VALUES
('Toyota', 'Corolla Cross', 2023, 860000000, '1.8 Hybrid, AT', 'Xe gia đình tiết kiệm nhiên liệu, bản đẹp.', '["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"]', 2, 'approved'),
('Mazda', 'CX-5 Premium', 2022, 910000000, '2.0 AT, Full option', 'Nội thất đẹp, lịch sử bảo dưỡng đầy đủ.', '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d"]', 2, 'approved'),
('Honda', 'Civic RS', 2021, 740000000, '1.5 Turbo, CVT', 'Đã kiểm định, máy móc nguyên bản.', '["https://images.unsplash.com/photo-1542362567-b07e54358753"]', 2, 'pending');

INSERT INTO Orders (buyer_id, car_id, total_amount, full_name, phone_number, address, paymentMethod, paymentStatus, transactionId, paymentDate, order_status) VALUES
(3, 1, 860000000, 'Buyer Demo', '0900000003', 'Thu Duc, HCM', 'cod', 'paid', 'TXN-DEMO-0001', NOW(), 'confirmed');

INSERT INTO ViewingRequests (car_id, seller_id, buyer_id, full_name, phone_number, preferred_time, message, status) VALUES
(2, 2, 3, 'Buyer Demo', '0900000003', DATE_ADD(NOW(), INTERVAL 1 DAY), 'Muốn xem xe buổi sáng', 'pending');
