# Unidirectional Communication System

A web-based system where users register as Type A (Requesters) or Type B (Responders) and engage in controlled unidirectional communication.

## Features

- **User Registration**: Users select Type A (Requester) or Type B (Responder) during registration
- **Request System**: Type A users send requests visible to all Type B users
- **Acceptance System**: Type B users can selectively accept communication requests
- **Unidirectional Messaging**: Once accepted, Type A can send messages, Type B must respond within 1 hour
- **Reminder System**: Automated email reminders every 5 minutes if Type B doesn't respond
- **Message Cleanup**: Type A messages are automatically deleted after 1 hour

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Frontend**: React, TypeScript, Material-UI
- **Email**: AWS SES
- **Deployment**: AWS

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup environment variables:

   ```bash
   npm run setup
   ```

   This will create a `.env` file with default values. You can modify it as needed.

4. **Email Setup (Optional)**:

   - **For Gmail**: Add your Gmail credentials to `.env` (see `EMAIL_SETUP_GUIDE.md`)
   - **For AWS SES**: Configure AWS credentials for production
   - **For testing**: Leave email fields empty - emails will be logged to console

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Troubleshooting

If you encounter issues with the "Create Request" button or other functionality:

1. **Check the logs**: The application now has comprehensive logging. Look for logs prefixed with `[AUTH]`, `[CREATE REQUEST]`, `[DASHBOARD A]`, etc.

2. **Test backend connection**: Use the "Test Backend" button in Dashboard A to verify the backend is working.

3. **Follow the debugging guide**: See `DEBUGGING_GUIDE.md` for detailed troubleshooting steps.

4. **Verify environment**: Make sure MongoDB is running and the `.env` file is properly configured.

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## Usage

1. Register users with Type A (Requester) or Type B (Responder)
2. Type A users can create requests
3. Type B users can view pending requests in the "Pending Requests" tab
4. Type B users can accept requests (they move to "Accepted Requests" tab)
5. Once accepted, both users can access messaging by clicking on the request
6. Type A can send messages, Type B must respond within 1 hour
7. If Type B doesn't respond, they receive reminder emails every 5 minutes
8. Type A messages are automatically deleted after 1 hour

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Requests

- `POST /api/requests` - Create a request (Type A only)
- `GET /api/requests/pending` - Get pending requests (Type B only)
- `GET /api/requests/accepted` - Get accepted requests (Type B only)
- `GET /api/requests/sent` - Get sent requests (Type A only)
- `POST /api/requests/:id/accept` - Accept a request (Type B only)

### Messages

- `POST /api/messages` - Send a message
- `GET /api/messages/:requestId` - Get messages for a request
