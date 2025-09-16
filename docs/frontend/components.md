# Frontend Components Documentation

## 🧩 **Component Overview**

The frontend uses reusable React components built with Material-UI for consistent UI design and functionality.

## 📁 **Component Structure**

```
components/
├── LogoutButton.tsx      # User logout functionality
├── PrivateRoute.tsx      # Route protection component
├── RequestItem.tsx       # Individual request display
└── RequestList.tsx       # List of requests
```

## 🚪 **Logout Button Component**

**File**: `src/components/LogoutButton.tsx`

### **Purpose**

Provides a consistent logout button across all authenticated pages.

### **Dependencies**

```typescript
import React from "react";
import { Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
```

### **Functionality**

- **Logout Action**: Calls the logout function from AuthContext
- **Navigation**: Redirects to login page after logout
- **Consistent Styling**: Material-UI Button component
- **Error Handling**: Graceful error handling

### **Code Structure**

```typescript
const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={handleLogout}
      sx={{ mt: 2 }}
    >
      Logout
    </Button>
  );
};
```

### **Usage**

```typescript
// In any page component
import LogoutButton from "../components/LogoutButton";

const MyPage = () => {
  return (
    <Container>
      <Typography variant="h4">My Page</Typography>
      {/* Page content */}
      <LogoutButton />
    </Container>
  );
};
```

### **Features**

- **Consistent Placement**: Positioned at bottom of pages
- **Error Styling**: Red color to indicate logout action
- **Navigation**: Automatic redirect to login page
- **Context Integration**: Uses AuthContext for logout

## 🔒 **Private Route Component**

**File**: `src/components/PrivateRoute.tsx`

### **Purpose**

Protects routes that require authentication, redirecting unauthenticated users to login.

### **Dependencies**

```typescript
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
```

### **Functionality**

- **Authentication Check**: Verifies user is logged in
- **Automatic Redirect**: Redirects to login if not authenticated
- **Route Protection**: Wraps protected routes
- **Context Integration**: Uses AuthContext for authentication state

### **Code Structure**

```typescript
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

### **Usage**

```typescript
// In App.tsx
<Route element={<PrivateRoute />}>
  <Route path="/" element={<Home />} />
</Route>
```

### **Features**

- **Automatic Protection**: Protects all child routes
- **Seamless Redirect**: Smooth redirect to login
- **Token Validation**: Checks for valid authentication token
- **Replace Navigation**: Uses replace to prevent back button issues

## 📝 **Request Item Component**

**File**: `src/components/RequestItem.tsx`

### **Purpose**

Displays individual request information in a consistent format.

### **Dependencies**

```typescript
import React from "react";
import { ListItem, ListItemText, ListItemButton } from "@mui/material";
import { Request } from "../types";
```

### **Props Interface**

```typescript
interface RequestItemProps {
  request: Request;
  onClick: () => void;
  showAcceptButton?: boolean;
  onAccept?: () => void;
}
```

### **Functionality**

- **Request Display**: Shows request information
- **Click Handling**: Handles request selection
- **Accept Button**: Optional accept button for Type B users
- **Status Display**: Shows request status

### **Code Structure**

```typescript
const RequestItem: React.FC<RequestItemProps> = ({
  request,
  onClick,
  showAcceptButton = false,
  onAccept,
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemText
          primary={`Request from ${
            typeof request.from === "string"
              ? request.from
              : request.from.username || request.from.email
          }`}
          secondary={
            request.acceptedBy
              ? request.responded
                ? "Responded"
                : "Accepted - Please respond"
              : "Pending"
          }
        />
        {showAcceptButton && !request.acceptedBy && (
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onAccept?.();
            }}
            sx={{ ml: 2 }}
          >
            Accept
          </Button>
        )}
      </ListItemButton>
    </ListItem>
  );
};
```

### **Usage**

```typescript
// In DashboardB.tsx
<RequestItem
  request={request}
  onClick={() => setSelectedRequest(request)}
  showAcceptButton={true}
  onAccept={() => acceptRequest(request._id)}
/>
```

### **Features**

- **Flexible Display**: Handles different request states
- **User Information**: Shows requester information
- **Status Indication**: Clear status display
- **Action Buttons**: Optional accept functionality

## 📋 **Request List Component**

**File**: `src/components/RequestList.tsx`

### **Purpose**

Displays a list of requests with consistent formatting and functionality.

### **Dependencies**

```typescript
import React from "react";
import { List } from "@mui/material";
import RequestItem from "./RequestItem";
import { Request } from "../types";
```

### **Props Interface**

```typescript
interface RequestListProps {
  requests: Request[];
  onRequestClick: (request: Request) => void;
  showAcceptButtons?: boolean;
  onAcceptRequest?: (requestId: string) => void;
}
```

### **Functionality**

- **List Rendering**: Renders list of requests
- **Consistent Styling**: Material-UI List component
- **Event Handling**: Handles request selection and acceptance
- **Empty State**: Handles empty request lists

### **Code Structure**

```typescript
const RequestList: React.FC<RequestListProps> = ({
  requests,
  onRequestClick,
  showAcceptButtons = false,
  onAcceptRequest,
}) => {
  if (requests.length === 0) {
    return (
      <Typography color="text.secondary" mt={2}>
        No requests found
      </Typography>
    );
  }

  return (
    <List sx={{ mt: 2 }}>
      {requests.map((request) => (
        <RequestItem
          key={request._id}
          request={request}
          onClick={() => onRequestClick(request)}
          showAcceptButton={showAcceptButtons}
          onAccept={() => onAcceptRequest?.(request._id)}
        />
      ))}
    </List>
  );
};
```

### **Usage**

```typescript
// In DashboardB.tsx
<RequestList
  requests={pendingRequests}
  onRequestClick={setSelectedRequest}
  showAcceptButtons={true}
  onAcceptRequest={acceptRequest}
/>
```

### **Features**

- **Empty State Handling**: Shows message when no requests
- **Consistent Rendering**: Uniform request display
- **Event Propagation**: Proper event handling
- **Flexible Configuration**: Configurable accept buttons

## 🎨 **Component Styling**

### **Material-UI Integration**

All components use Material-UI components for consistent styling:

```typescript
// Button styling
<Button
  variant="contained"
  color="primary"
  sx={{ mt: 2, mr: 2 }}
>
  Action
</Button>

// List styling
<List sx={{ mt: 2 }}>
  {/* List items */}
</List>

// Typography styling
<Typography color="text.secondary" mt={2}>
  Message
</Typography>
```

### **Theme Integration**

Components automatically use the application theme:

```typescript
// Theme configuration in index.tsx
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});
```

## 🔄 **Component Lifecycle**

### **State Management**

Components use React hooks for state management:

```typescript
// Local state
const [isLoading, setIsLoading] = useState(false);

// Context state
const { token, type } = useAuth();

// Effect hooks
useEffect(() => {
  fetchData();
}, []);
```

### **Event Handling**

Components handle user interactions:

```typescript
// Click handlers
const handleClick = () => {
  // Handle click
};

// Form handlers
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Handle form submission
};
```

## 🧪 **Component Testing**

### **Unit Testing**

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";

test("logout button calls logout function", () => {
  const mockLogout = jest.fn();

  render(
    <AuthProvider value={{ logout: mockLogout }}>
      <LogoutButton />
    </AuthProvider>
  );

  fireEvent.click(screen.getByText("Logout"));
  expect(mockLogout).toHaveBeenCalled();
});
```

### **Integration Testing**

```typescript
test("private route redirects when not authenticated", () => {
  render(
    <MemoryRouter>
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    </MemoryRouter>
  );

  expect(screen.getByText("Protected Content")).not.toBeInTheDocument();
});
```

## 🚀 **Best Practices**

### **Component Design**

- **Single Responsibility**: Each component has one clear purpose
- **Reusability**: Components are designed for reuse
- **Props Interface**: Clear TypeScript interfaces for props
- **Default Props**: Sensible default values

### **Performance**

- **Memoization**: Use React.memo for expensive components
- **Event Handling**: Efficient event handling
- **State Updates**: Optimized state updates
- **Rendering**: Minimize unnecessary re-renders

### **Accessibility**

- **Semantic HTML**: Use appropriate HTML elements
- **ARIA Labels**: Provide accessibility labels
- **Keyboard Navigation**: Support keyboard navigation
- **Screen Readers**: Compatible with screen readers

The components provide a solid foundation for the Unidirectional Communication System's user interface!
