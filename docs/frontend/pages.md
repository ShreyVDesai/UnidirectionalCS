# Frontend Pages Documentation

## 📄 **Overview**

The frontend consists of several pages that handle different aspects of the application. Each page is a React component with specific functionality and routing.

## 📁 **Page Structure**

```
pages/
├── Home.tsx           # Main dashboard router
├── Login.tsx          # User authentication
├── Register.tsx       # User registration
├── DashboardA.tsx     # Type A user dashboard
├── DashboardB.tsx     # Type B user dashboard
└── Messaging.tsx      # Message exchange interface
```

## 🏠 **Home Page**

**File**: `src/pages/Home.tsx`

### **Purpose**

Acts as a router that displays the appropriate dashboard based on the user's type.

### **Dependencies**

```typescript
import React from "react";
import { useAuth } from "../context/AuthContext";
import DashboardA from "./DashboardA";
import DashboardB from "./DashboardB";
```

### **Functionality**

- **User Type Detection**: Checks the user's type from AuthContext
- **Dashboard Routing**: Renders appropriate dashboard component
- **Fallback**: Shows default message if type is not determined

### **Code Structure**

```typescript
const Home: React.FC = () => {
  const { type } = useAuth();

  if (type === "A") return <DashboardA />;
  if (type === "B") return <DashboardB />;

  return <div>Select a dashboard</div>;
};
```

### **Usage**

- **Route**: `/` (protected route)
- **Access**: Authenticated users only
- **Navigation**: Automatic based on user type

## 🔐 **Login Page**

**File**: `src/pages/Login.tsx`

### **Purpose**

Handles user authentication with email and password.

### **Dependencies**

```typescript
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import api from "../api";
import { useAuth } from "../context/AuthContext";
```

### **State Management**

```typescript
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
```

### **Key Features**

- **Form Validation**: Required field validation
- **Error Handling**: Displays authentication errors
- **Navigation**: Redirects to dashboard on success
- **Link to Register**: Navigation to registration page

### **Form Structure**

```typescript
<form onSubmit={handleLogin}>
  <TextField
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <TextField
    label="Password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <Button type="submit" variant="contained">
    Login
  </Button>
</form>
```

### **Authentication Flow**

1. **Form Submission**: Validates input
2. **API Call**: Sends credentials to backend
3. **Token Storage**: Stores JWT token in localStorage
4. **Context Update**: Updates AuthContext with user data
5. **Navigation**: Redirects to dashboard

## 📝 **Register Page**

**File**: `src/pages/Register.tsx`

### **Purpose**

Handles user registration with type selection (A or B).

### **Dependencies**

```typescript
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import api from "../api";
import { useAuth } from "../context/AuthContext";
```

### **State Management**

```typescript
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [type, setType] = useState<"A" | "B">("A");
const [error, setError] = useState("");
```

### **Key Features**

- **User Type Selection**: Dropdown for A/B selection
- **Form Validation**: All fields required
- **Auto-login**: Automatically logs in after registration
- **Error Handling**: Displays registration errors

### **Form Structure**

```typescript
<form onSubmit={handleRegister}>
  <TextField
    label="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    required
  />
  <TextField
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <TextField
    label="Password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <FormControl>
    <InputLabel>Type</InputLabel>
    <Select value={type} onChange={(e) => setType(e.target.value as "A" | "B")}>
      <MenuItem value="A">Type A (Requester)</MenuItem>
      <MenuItem value="B">Type B (Responder)</MenuItem>
    </Select>
  </FormControl>
  <Button type="submit" variant="contained">
    Register
  </Button>
</form>
```

### **Registration Flow**

1. **Form Submission**: Validates all fields
2. **API Call**: Sends registration data to backend
3. **Auto-login**: Automatically logs in user
4. **Token Storage**: Stores JWT token
5. **Navigation**: Redirects to dashboard

## 📊 **Dashboard A (Type A Users)**

**File**: `src/pages/DashboardA.tsx`

### **Purpose**

Dashboard for Type A users (Requesters) to create requests and manage sent requests.

### **Dependencies**

```typescript
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import api from "../api";
import { Request } from "../types";
import Messaging from "./Messaging";
import LogoutButton from "../components/LogoutButton";
```

### **State Management**

```typescript
const [requests, setRequests] = useState<Request[]>([]);
const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
const [isCreating, setIsCreating] = useState(false);
```

### **Key Features**

- **Request Creation**: Create new communication requests
- **Request Management**: View sent requests
- **Messaging Access**: Enter messaging for accepted requests
- **Testing Tools**: Test backend and scheduler functionality

### **Main Functions**

```typescript
const fetchRequests = async () => {
  const res = await api.get("/requests/sent");
  setRequests(res.data);
};

const createRequest = async () => {
  setIsCreating(true);
  try {
    await api.post("/requests");
    await fetchRequests();
    alert("Request created successfully!");
  } catch (err) {
    alert("Failed to create request");
  } finally {
    setIsCreating(false);
  }
};
```

### **UI Components**

- **Create Request Button**: Creates new requests
- **Test Backend Button**: Tests backend connectivity
- **Test Scheduler Button**: Tests automated tasks
- **Request List**: Shows sent requests
- **Messaging Interface**: Opens when request is selected

## 📋 **Dashboard B (Type B Users)**

**File**: `src/pages/DashboardB.tsx`

### **Purpose**

Dashboard for Type B users (Responders) to view and accept requests, then manage accepted requests.

### **Dependencies**

```typescript
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import api from "../api";
import { Request } from "../types";
import Messaging from "./Messaging";
import LogoutButton from "../components/LogoutButton";
```

### **State Management**

```typescript
const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
const [acceptedRequests, setAcceptedRequests] = useState<Request[]>([]);
const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
const [activeTab, setActiveTab] = useState(0);
```

### **Key Features**

- **Tabbed Interface**: Separate tabs for pending and accepted requests
- **Request Acceptance**: Accept pending requests
- **Request Management**: View accepted requests
- **Messaging Access**: Enter messaging for accepted requests

### **Tab Structure**

```typescript
<Tabs value={activeTab} onChange={handleTabChange}>
  <Tab label={`Pending Requests (${pendingRequests.length})`} />
  <Tab label={`Accepted Requests (${acceptedRequests.length})`} />
</Tabs>
```

### **Main Functions**

```typescript
const fetchPendingRequests = async () => {
  const res = await api.get("/requests/pending");
  setPendingRequests(res.data);
};

const fetchAcceptedRequests = async () => {
  const res = await api.get("/requests/accepted");
  setAcceptedRequests(res.data);
};

const acceptRequest = async (id: string) => {
  await api.post(`/requests/${id}/accept`);
  fetchAllRequests(); // Refresh both lists
};
```

### **UI Components**

- **Pending Requests Tab**: Shows unaccepted requests with Accept buttons
- **Accepted Requests Tab**: Shows accepted requests for messaging
- **Request List**: Displays request information
- **Accept Buttons**: Accept pending requests
- **Messaging Interface**: Opens when request is selected

## 💬 **Messaging Page**

**File**: `src/pages/Messaging.tsx`

### **Purpose**

Handles message exchange between users within accepted requests.

### **Dependencies**

```typescript
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import api from "../api";
import { Request, Message } from "../types";
```

### **Props Interface**

```typescript
interface MessagingProps {
  request: Request;
  onBack: () => void;
}
```

### **State Management**

```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [text, setText] = useState("");
```

### **Key Features**

- **Message Display**: Shows conversation history
- **Message Sending**: Send new messages
- **Real-time Updates**: Refreshes after sending
- **User Identification**: Shows sender information
- **Timestamps**: Displays message creation time

### **Main Functions**

```typescript
const fetchMessages = async () => {
  const res = await api.get(`/messages/${request._id}`);
  setMessages(res.data);
};

const sendMessage = async () => {
  if (!text) return;
  try {
    await api.post("/messages", { requestId: request._id, content: text });
    setText("");
    fetchMessages();
  } catch (err) {
    console.error("Error sending message:", err);
  }
};
```

### **UI Components**

- **Back Button**: Returns to dashboard
- **Message List**: Chronological message display
- **Message Input**: Text field for new messages
- **Send Button**: Sends the message

### **Message Display**

```typescript
<List>
  {messages.map((msg) => (
    <ListItem key={msg._id}>
      <ListItemText
        primary={`${msg.from.username}: ${msg.content}`}
        secondary={new Date(msg.createdAt).toLocaleString()}
      />
    </ListItem>
  ))}
</List>
```

## 🔄 **Page Navigation Flow**

### **Authentication Flow**

```
Login/Register → Home → Dashboard (A or B)
```

### **Dashboard Flow**

```
Dashboard → Messaging → Back to Dashboard
```

### **Request Flow**

```
Type A: Create Request → View Sent Requests → Enter Messaging
Type B: View Pending → Accept Request → View Accepted → Enter Messaging
```

## 🎯 **Best Practices**

### **Component Design**

- **Single Responsibility**: Each page has a clear purpose
- **State Management**: Appropriate use of local and global state
- **Error Handling**: Comprehensive error handling
- **Loading States**: User feedback during operations

### **User Experience**

- **Consistent UI**: Material-UI components throughout
- **Responsive Design**: Mobile-friendly layouts
- **Clear Navigation**: Intuitive navigation flow
- **Feedback**: Success/error messages for user actions

### **Performance**

- **Efficient Rendering**: Minimize unnecessary re-renders
- **API Optimization**: Efficient data fetching
- **State Updates**: Optimized state updates
- **Memory Management**: Proper cleanup of effects

The pages provide a complete user interface for the Unidirectional Communication System with clear navigation and functionality!
