# psa-digital-tracking-system
The following is a project to be submitted for the PSA Digital Birth Certificate Processing and Tracking System proposed for System Integration and Architecture 2 course.

# Setup Instructions

The database is cloud-hosted on Aiven (MySQL), so no local MySQL setup is needed[cite: 17].
The tables and sample data are already loaded. Do NOT run schema.sql or seed.sql again[cite: 17].

## 1. Get the database credentials
Is available in the GC or ask me (Jb) for it[cite: 17]

## 2. Backend Setup
1. Open a terminal and go to the server folder: `cd server`[cite: 17]
2. Install dependencies (including Express, CORS, dotenv, MySQL2, and jsonwebtoken): `npm install`[cite: 17]
3. Create a file named `.env` inside the `server` folder (make sure it is not saved as `.env.txt`) with:[cite: 17]

        PORT=5000

        # Aiven cloud MySQL. Get the real password from the group; never commit .env
        DB_HOST=psa-database-psa-digital-tracking-system.h.aivencloud.com
        DB_PORT=10411
        DB_USER=avnadmin
        DB_PASSWORD=
        DB_NAME=defaultdb

4. Start the backend: `node src/server.js` (runs on port 5000)[cite: 17]
5. Test it: open http://localhost:5000/api/requests. It should return JSON[cite: 17].

## 3. Frontend Setup
1. Open a separate terminal and go to the client folder: `cd client`[cite: 17]
2. Install dependencies: `npm install`[cite: 17]
3. Start the dev server: `npm run dev`[cite: 17]
4. Open the link shown in the terminal[cite: 17].

## Rules
- Never commit `.env`, passwords, or API keys. `.env` is already in `.gitignore`[cite: 17].
- `server/src/config/ca.pem` is a public SSL certificate and is safe to commit. It is required to connect to Aiven[cite: 17].

# Frontend: React.js (Vite) + Tailwind CSS[cite: 17]

# Backend: Node.js + Express.js[cite: 17]

# Database: MySQL mapped to 6 core entities[cite: 17]

---

## Testing Credentials (Live Database Seeding)

*   **Citizen Portal (Jose Reyes):** `jose.reyes@email.com` / `demo123`
*   **Citizen Portal (Maria Santos):** `maria.santos@email.com` / `demo123`
*   **LCRO Validation Officer:** `PSA-2025-0043` / `demo123`
*   **PSA Final Approval Admin:** `PSA-2025-0042` / `demo123`

---

Contributors:

# Jeybi - Database Designer

# Godwyne - UI/UX Designer

# Katrina - Technical Lead

# Tristan - Business Analyst

# Adrian - Solutions Architect

# Joshua - Project Manager
