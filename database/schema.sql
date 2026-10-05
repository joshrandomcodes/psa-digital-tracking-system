-- 1. Registry Office
CREATE TABLE REGISTRY_OFFICE (
    OfficeCode      INT PRIMARY KEY AUTO_INCREMENT,
    OfficeName      VARCHAR(100) NOT NULL,
    OfficeType      VARCHAR(30)  NOT NULL,
    Region          VARCHAR(50)  NOT NULL,
    ContactEmail    VARCHAR(100) NOT NULL
);

-- 2. Citizen / Applicant
CREATE TABLE CITIZEN (
    CitizenID       INT PRIMARY KEY AUTO_INCREMENT,
    PhilSysID       VARCHAR(25) UNIQUE NOT NULL,
    FirstName       VARCHAR(50) NOT NULL,
    LastName        VARCHAR(50) NOT NULL,
    Email           VARCHAR(100) NOT NULL,
    PasswordHash    VARCHAR(255) NOT NULL
);

-- 3. PSA Staff / Admin
CREATE TABLE PSA_STAFF (
    StaffID         INT PRIMARY KEY AUTO_INCREMENT,
    OfficeCode      INT NOT NULL,
    EmployeeID      VARCHAR(20) UNIQUE,
    Role            VARCHAR(50) NOT NULL,
    FirstName       VARCHAR(50) NOT NULL,
    LastName        VARCHAR(50) NOT NULL,
    PasswordHash    VARCHAR(255) NOT NULL,
    FOREIGN KEY (OfficeCode) REFERENCES REGISTRY_OFFICE(OfficeCode)
);

-- 4. Document Request (D1 Request Database)
CREATE TABLE DOCUMENT_REQUEST (
    RequestID           INT PRIMARY KEY AUTO_INCREMENT,
    CitizenID           INT NOT NULL,
    OfficeCode          INT NOT NULL,
    DocumentType        VARCHAR(40) NOT NULL DEFAULT 'Birth Certificate (SECPA)',
    RequestStatus       VARCHAR(50) NOT NULL DEFAULT 'Pending',
    DateFiled            DATE NOT NULL,
    ReviewedByStaffID    INT NULL,
    DecisionAt            DATETIME NULL,
    FOREIGN KEY (CitizenID) REFERENCES CITIZEN(CitizenID),
    FOREIGN KEY (OfficeCode) REFERENCES REGISTRY_OFFICE(OfficeCode),
    FOREIGN KEY (ReviewedByStaffID) REFERENCES PSA_STAFF(StaffID),
    INDEX idx_status (RequestStatus),
    INDEX idx_citizen (CitizenID)
);

-- 5. Notification Log (Notify Service)
CREATE TABLE NOTIFICATION_LOG (
    LogID               INT PRIMARY KEY AUTO_INCREMENT,
    RequestID           INT NOT NULL,
    Channel             VARCHAR(10) NOT NULL DEFAULT 'Email',
    NotificationType    VARCHAR(50) NOT NULL,
    Message             TEXT,
    SentAt               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RequestID) REFERENCES DOCUMENT_REQUEST(RequestID)
);

-- 6. LCRO Sync Log (LCRO Sync Service)
CREATE TABLE LCRO_SYNC_LOG (
    SyncID          INT PRIMARY KEY AUTO_INCREMENT,
    RequestID       INT NOT NULL,
    OfficeCode      INT NOT NULL,
    SyncStatus      VARCHAR(20) NOT NULL,
    SyncDetails     TEXT,
    SyncedAt        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RequestID) REFERENCES DOCUMENT_REQUEST(RequestID),
    FOREIGN KEY (OfficeCode) REFERENCES REGISTRY_OFFICE(OfficeCode)
);
