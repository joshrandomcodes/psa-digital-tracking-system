-- sample seed data for local testing.

-- run after the schema:  mysql -u root -p psa_database < database/seed.sql
-- ---------------------------------------------------------------------------------
USE psa_database;

-- Registry Offices
INSERT INTO REGISTRY_OFFICE (OfficeName, OfficeType, Region, ContactEmail) VALUES
('Manila LCRO', 'LCRO', 'NCR', 'manila.lcro@psahelpline.ph'),
('Makati LCRO', 'LCRO', 'NCR', 'makati.lcro@psahelpline.ph'),
('Quezon City LCRO', 'LCRO', 'NCR', 'qc.lcro@psahelpline.ph'),
('PSA NCR Regional Office', 'Regional PSA', 'NCR', 'ncr.regional@psa.gov.ph');

-- PSA Staff
INSERT INTO PSA_STAFF (OfficeCode, EmployeeID, Role, FirstName, LastName, PasswordHash) VALUES
(4, 'PSA-2025-0042', 'Records Officer', 'Juan', 'Dela Cruz', 'PLACEHOLDER_HASH'),
(1, 'PSA-2025-0043', 'LCRO Officer', 'Maria', 'Santos', 'PLACEHOLDER_HASH');

-- Citizens
INSERT INTO CITIZEN (PhilSysID, FirstName, LastName, Email, PasswordHash) VALUES
('1234-5678-9012', 'Maria Cruz', 'Santos', 'maria.santos@email.com', 'PLACEHOLDER_HASH'),
('2234-5678-9012', 'Jose', 'Reyes', 'jose.reyes@email.com', 'PLACEHOLDER_HASH'),
('3234-5678-9012', 'Ana', 'Cruz', 'ana.cruz@email.com', 'PLACEHOLDER_HASH');

-- Document Requests
INSERT INTO DOCUMENT_REQUEST (CitizenID, OfficeCode, DocumentType, RequestStatus, DateFiled) VALUES
(1, 2, 'Birth Certificate (SECPA)', 'Pending', '2026-09-08'),
(2, 1, 'CTC', 'Under Review', '2026-09-08'),
(3, 3, 'Birth Certificate (SECPA)', 'Approved', '2026-09-07');

-- Notification Log
INSERT INTO NOTIFICATION_LOG (RequestID, Channel, NotificationType, Message) VALUES
(3, 'Email', 'Document Approved', 'Your birth certificate request has been approved and is being generated.');

-- LCRO Sync Log
INSERT INTO LCRO_SYNC_LOG (RequestID, OfficeCode, SyncStatus, SyncDetails) VALUES
(1, 2, 'Success', 'Record matched against PhilCRIS.'),
(2, 1, 'Success', 'Record matched against PhilCRIS.');
