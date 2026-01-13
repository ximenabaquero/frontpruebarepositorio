-- Coldesthetic - Patients table
-- MySQL 8+

CREATE TABLE IF NOT EXISTS `patients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,
  `remitente` VARCHAR(255) NULL,
  `age` INT NOT NULL,
  `biological_sex` ENUM('Female','Male','Other') NOT NULL,
  `weight_kg` DECIMAL(6,2) NOT NULL,
  `height_m` DECIMAL(4,2) NOT NULL,
  `bmi` DECIMAL(6,2) NOT NULL,
  `treatment_area` VARCHAR(255) NOT NULL,
  `contraindications_text` TEXT NULL,
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

-- Procedures performed for a given patient (1:N)
CREATE TABLE IF NOT EXISTS `patient_procedures` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `patient_id` INT NOT NULL,
  `procedure_id` VARCHAR(64) NOT NULL,
  `procedure_label` VARCHAR(255) NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `details_json` JSON NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_patient_procedures_patient_id` (`patient_id`),
  CONSTRAINT `fk_patient_procedures_patient`
    FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional denormalized total for quick reporting
ALTER TABLE `patients`
  ADD COLUMN IF NOT EXISTS `procedures_total` DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Optional additional metadata
ALTER TABLE `patients`
  ADD COLUMN IF NOT EXISTS `remitente` VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `contraindications_text` TEXT NULL;
