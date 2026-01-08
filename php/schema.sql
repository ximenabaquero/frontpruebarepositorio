-- Coldesthetic - Patients table
-- MySQL 8+

CREATE TABLE IF NOT EXISTS `patients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,
  `age` INT NOT NULL,
  `biological_sex` ENUM('Female','Male','Other') NOT NULL,
  `weight_kg` DECIMAL(6,2) NOT NULL,
  `height_m` DECIMAL(4,2) NOT NULL,
  `bmi` DECIMAL(6,2) NOT NULL,
  `treatment_area` VARCHAR(255) NOT NULL,
  `diabetes` BOOLEAN NOT NULL DEFAULT FALSE,
  `hypertension` BOOLEAN NOT NULL DEFAULT FALSE,
  `pregnancy` BOOLEAN NOT NULL DEFAULT FALSE,
  `lactation` BOOLEAN NOT NULL DEFAULT FALSE,
  `implanted_device` BOOLEAN NOT NULL DEFAULT FALSE,
  `eligible` BOOLEAN NOT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
