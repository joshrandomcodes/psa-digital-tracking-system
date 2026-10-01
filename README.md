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
- Quality Assurance testing of backend systems and make possible improvements you see fit to be made for the backend system's performance too.

# Godwyne 
- Development of the react frontend. Citizen tracker status should be built on the frontend and also make a connection to it on the backend for seamless integration as our system has to be real-time as part of the requirement. Alongside frontend development for the staff processing dashboard. Also in terms of color schemes and customization, perhaps integrate a simple light and dark mode for the time being, for design references base it off of the PSA's design and modern design principles, whichever works best for you.

# Katrina
- Develop the node.js backend for the project, specifically the logic for request verification based on our system requirements (heavily based on our paper outlining the system and diagrams) alongside PhilSys identity checks.

# Tristan
- Perform quality assurance testing daily and verify the system workflow follows the activity diagram workflows we've worked on in previous papers conceptualizing and designing the framework for this project. Report any bugs or improvements to be made immediately in the group chat.

# Adrian
- Review the system architecture and integration of cloud, ensure the integration and reviewing of such matches and aligns with the level 0 and level 1 data flow diagrams.

# Joshua
- Reviewing of system tracker system and polishing of every addition made during this week by the weekends.
