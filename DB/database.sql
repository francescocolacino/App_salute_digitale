CREATE DATABASE IF NOT EXISTS app_salute_digitale;
USE app_salute_digitale;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    tax_code VARCHAR(16) NOT NULL UNIQUE,
    birth_date DATE NULL
);

CREATE TABLE IF NOT EXISTS observations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    observation_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_observations_patient
        FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS encounters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    encounter_date DATE NOT NULL,
    department VARCHAR(120) NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_encounters_patient
        FOREIGN KEY (patient_id) REFERENCES patients(id)
);

INSERT INTO patients (full_name, tax_code, birth_date)
VALUES
    ('Mario Rossi', 'RSSMRA80A01H501U', '1980-01-01'),
    ('Giulia Bianchi', 'BNCGLI85B41F205Z', '1985-02-01'),
    ('Luca Verdi', 'VRDLCU90C12F839K', '1990-03-12')
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    birth_date = VALUES(birth_date);

INSERT INTO observations (patient_id, observation_text)
SELECT p.id, 'Pressione arteriosa nella norma.'
FROM patients p
WHERE p.tax_code = 'RSSMRA80A01H501U'
  AND NOT EXISTS (
      SELECT 1
      FROM observations o
      WHERE o.patient_id = p.id
        AND o.observation_text = 'Pressione arteriosa nella norma.'
  );

INSERT INTO observations (patient_id, observation_text)
SELECT p.id, 'Controllo glicemia consigliato entro 30 giorni.'
FROM patients p
WHERE p.tax_code = 'BNCGLI85B41F205Z'
  AND NOT EXISTS (
      SELECT 1
      FROM observations o
      WHERE o.patient_id = p.id
        AND o.observation_text = 'Controllo glicemia consigliato entro 30 giorni.'
  );

INSERT INTO encounters (patient_id, encounter_date, department, notes)
SELECT p.id, '2026-05-10', 'Cardiologia', 'Visita di follow-up annuale.'
FROM patients p
WHERE p.tax_code = 'RSSMRA80A01H501U'
  AND NOT EXISTS (
      SELECT 1
      FROM encounters e
      WHERE e.patient_id = p.id
        AND e.department = 'Cardiologia'
        AND e.encounter_date = '2026-05-10'
  );

INSERT INTO encounters (patient_id, encounter_date, department, notes)
SELECT p.id, '2026-06-05', 'Diabetologia', 'Piano alimentare aggiornato.'
FROM patients p
WHERE p.tax_code = 'BNCGLI85B41F205Z'
  AND NOT EXISTS (
      SELECT 1
      FROM encounters e
      WHERE e.patient_id = p.id
        AND e.department = 'Diabetologia'
        AND e.encounter_date = '2026-06-05'
  );
