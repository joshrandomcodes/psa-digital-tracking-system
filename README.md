# psa-digital-tracking-system
The following is a project to be submitted for the PSA Digital Birth Certificate Processing and Tracking System proposed for System Integration and Architecture 2 course.

# Setup Instructions

The database is cloud-hosted on Aiven (MySQL), so no local MySQL setup is needed.
The tables and sample data are already loaded. Do NOT run schema.sql or seed.sql again.

## 1. Get the database credentials
Is available in the GC or ask me (Jb) for it

## 2. Backend Setup
1. Open a terminal and go to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a file named `.env` inside the `server` folder (make sure it is not saved as `.env.txt`) with:

        PORT=5000

        # Aiven cloud MySQL. Get the real password from the group; never commit .env
        DB_HOST=psa-database-psa-digital-tracking-system.h.aivencloud.com
        DB_PORT=10411
        DB_USER=avnadmin
        DB_PASSWORD=
        DB_NAME=defaultdb

4. Start the backend: `node src/server.js` (runs on port 5000)
5. Test it: open http://localhost:5000/api/requests. It should return JSON.

## 3. Frontend Setup
1. Open a separate terminal and go to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open the link shown in the terminal.

## Rules
- Never commit `.env`, passwords, or API keys. `.env` is already in `.gitignore`.
- `server/src/config/ca.pem` is a public SSL certificate and is safe to commit. It is required to connect to Aiven.

# Frontend: React.js (Vite) + Tailwind CSS

# Backend: Node.js + Express.js

# Database: MySQL mapped to 6 core entities

TO-DO List:

# Jeybi 
- Conduct QA testing on the backend systems and the Aiven cloud database. Implement performance improvements for database queries and overall backend speed.

# Godwyne 
- Develop the React frontend. Build the real-time citizen status tracker and connect it seamlessly to the backend. Develop the staff processing dashboard. Integrate a simple light/dark mode based on modern PSA design principles.

# Katrina
- Develop the Node.js backend. Program the request verification logic and PhilSys identity checks strictly based on our system requirements and paper diagrams.

# Tristan
- Perform daily QA testing. Verify that the system routing strictly follows the Activity Diagram workflows we conceptualized. Report any bugs or necessary improvements immediately in the group chat.

# Adrian
- Review the system architecture and integration of cloud, ensure the integration and reviewing of such matches and aligns with the level 0 and level 1 data flow diagrams.

# Joshua
- Reviewing of system tracker system and polishing of every addition made during this week by the weekends.
