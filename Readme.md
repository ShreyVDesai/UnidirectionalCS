### Communication System
- Send and accept request for communication.
- Unidirectional chat.

## TechStack
- React
- Express
- MongoDb
- Typescript

## Folder Structure


├── /backend         # Backend folder
│   ├── src          # Source code for APIs
│   ├── .env.example # Use variables listed here.
│   ├── .env         # Create this file and add the variables here.
│   ├── package.json # Backend dependencies and scripts
├── /frontend        # Frontend folder
│   ├── src          # Source code for React application
│   ├── package.json # Frontend dependencies and scripts
├── README.md        # Project documentation


## Setup Instructions

### Backend Setup
- cd backend
- `npm install` to install all the dependencies.
- Follow `.env.example` to create your own `.env` at the root level of /be
- `npm run dev` to start the backend server.
- Backend server runs on https://localhost:5000

### Frontend Setup
- Navigate to cd frontend
- `npm install` to install all the dependencies.
- `npm run dev` to start the frontend server.
- Frontend server runs on https://localhost:5173 (Displayed on the terminal. If the port is busy check for the new port number).

