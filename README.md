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
- I'll give you full freedom but essentially base it off of our paper but right now I'm still not final and you'll probably be the most important person for this, I'm unsure if we'll have the program's backend be locally ran or be hosted through a cloud database like a free one, if we do host it via the cloud, testing will be easier and local setup will be therefore removed, the only setup needed now is just practically running the frontend side and starting up the app.

# Godwyne 
- As of right now the thing I made and fucked around with is pretty much a barebones skeleton, you can do the local setup and start testing the functionalities if it works, I didn't fully test it since I have a lot of projects to lead and deal with currently but I did this early so we can start getting things done immediately, do any changes necessary if needed and take the time to get used to using react, it's easier to implement a lot of visual changes and animations with it's js library so it'll be best if we continue using it.

# Katrina
- TBA

# Tristan
- TBA

# Adrian
- TBA

# Joshua
- Double check and verify everything works, oversee everything and get this all done or something.
