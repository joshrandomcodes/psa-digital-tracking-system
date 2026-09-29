# psa-digital-tracking-system
The following is a project to be submitted for the PSA Digital Birth Certificate Processing and Tracking System proposed for System Integration and Architecture 2 course.

# Local Setup Instructions
1️. Database Setup
I. Open your local MySQL environment.
II. Create a new database named psa_database.
III. Execute the database/schema.sql script to generate the required tables.   
2️. Backend Setup
I. Open a terminal and navigate to the server directory: cd server
II. Install dependencies: npm install
III. Rename .env.example to .env and input your local MySQL credentials (DB_USER, DB_PASSWORD).
IV. Start the backend: node src/server.js (Runs on port 5000).
3️. Frontend Setup
I. Open a separate terminal and navigate to the client directory: cd client
II. Install dependencies: npm install
III. Start the development server: npm run dev
IV. Access the application in your browser through the link or such you'll see in your terminal

The following files and such currently are just a basic skeleton and structure subject to change alongside these here are key notes to take note for the system's architectural blueprint:

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
