# psa-digital-tracking-system
The following is a project to be submitted for the PSA Digital Birth Certificate Processing and Tracking System proposed for System Integration and Architecture 2 course.

# Setup Instructions

The database is cloud-hosted on Aiven (MySQL), so no local MySQL setup is needed.
The tables and sample data are already loaded. Do NOT run schema.sql or seed.sql again.

## 1. Get the database credentials
Is available in the GC or ask (Jb) for it

## 2. Backend Setup
1. Open a terminal at the root folder of the project (psa-digital-tracking-system) and go to the server folder: `cd server`
2. Install dependencies (including Express, CORS, dotenv, MySQL2, and jsonwebtoken): `npm install`
3. Create a file named `.env` inside the `server` folder (make sure it is not saved as `.env.txt`)

        PORT=5000

        # Aiven cloud MySQL. Get the real password from the group; never commit .env
        DB_HOST=psa-database-psa-digital-tracking-system.h.aivencloud.com
        DB_PORT=10411
        DB_USER=avnadmin
        DB_PASSWORD=
        DB_NAME=defaultdb

4. Start the backend: `node src/server.js` (runs on port 5000)
5. Test it: open http://localhost:5000/api/requests. It should return JSON

## 3. Frontend Setup
1. Open a separate terminal and go to the client folder: `cd client'
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open the link shown in the terminal

## Rules
- Never commit `.env`, passwords, or API keys. `.env` is already in `.gitignore`
- `server/src/config/ca.pem` is a public SSL certificate and is safe to commit. It is required to connect to Aiven

# Frontend: React.js (Vite) + Tailwind CSS

# Backend: Node.js + Express.js

# Database: MySQL mapped to 6 core entities

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
