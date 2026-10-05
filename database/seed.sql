-- Registry Offices
INSERT INTO REGISTRY_OFFICE (OfficeName, OfficeType, Region, ContactEmail) VALUES
('Manila LCRO', 'LCRO', 'NCR', 'manila.lcro@psahelpline.ph'),
('Makati LCRO', 'LCRO', 'NCR', 'makati.lcro@psahelpline.ph'),
('Quezon City LCRO', 'LCRO', 'NCR', 'qc.lcro@psahelpline.ph'),
('PSA NCR Regional Office', 'Regional PSA', 'NCR', 'ncr.regional@psa.gov.ph');

-- PSA Staff (Using SHA256 to hash 'demo123')
INSERT INTO PSA_STAFF (OfficeCode, EmployeeID, Role, FirstName, LastName, PasswordHash) VALUES
(4, 'PSA-2025-0042', 'admin', 'Juan', 'Dela Cruz', SHA2('demo123', 256)),
(1, 'PSA-2025-0043', 'lcro', 'Maria', 'Santos', SHA2('demo123', 256));

-- Citizens (Using SHA256 to hash 'demo123')
INSERT INTO CITIZEN (PhilSysID, FirstName, LastName, Email, PasswordHash) VALUES
('1234-5678-9012', 'Maria Cruz', 'Santos', 'maria.santos@email.com', SHA2('demo123', 256)),
('2234-5678-9012', 'Jose', 'Reyes', 'jose.reyes@email.com', SHA2('demo123', 256)),
('3234-5678-9012', 'Ana', 'Cruz', 'ana.cruz@email.com', SHA2('demo123', 256));

-- Document Requests (FIXED: Status changed to 'Pending LCRO Validation' for Maria Cruz Santos)
INSERT INTO DOCUMENT_REQUEST (CitizenID, OfficeCode, DocumentType, RequestStatus, DateFiled) VALUES
(1, 2, 'Birth Certificate (SECPA)', 'Pending LCRO Validation', '2026-09-08'),
(2, 1, 'CTC', 'Under Review', '2026-09-08'),
(3, 3, 'Birth Certificate (SECPA)', 'Approved', '2026-09-07');

-- Notification Log
INSERT INTO NOTIFICATION_LOG (RequestID, Channel, NotificationType, Message) VALUES
(3, 'Email', 'Document Approved', 'Your birth certificate request has been approved and is being generated.');

-- LCRO Sync Log
INSERT INTO LCRO_SYNC_LOG (RequestID, OfficeCode, SyncStatus, SyncDetails) VALUES
(1, 2, 'Success', 'Record matched against PhilCRIS.'),
(2, 1, 'Success', 'Record matched against PhilCRIS.');
