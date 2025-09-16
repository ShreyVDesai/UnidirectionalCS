# React Context Documentation

## 🔄 **Context Overview**

The frontend uses React Context for global state management, specifically for authentication state and user information.

## 📁 **Context Structure**

```
context/
└── AuthContext.tsx    # Authentication context provider
```

## 🔐 **Authentication Context**

**File**: `src/context/AuthContext.tsx`

### **Purpose**

Manages global authentication state including user tokens, user type, and authentication actions.

### **Dependencies**

```typescript
import React, { createContext, useContext, useState, ReactNode } from "react";
```

### **Context Interface**

```typescript
export type AuthContextType = {
  token: string | null;
  type: "A" | "B" | null;
  setAuth: (token: string, type: "A" | "B") => void;
  logout: () => void;
};
```

### **Context Creation**

```typescript
const AuthContext = createContext<AuthContextType>({
  token: null,
  type: null,
  setAuth: () => {},
  logout: () => {},
});
```

### **Provider Component**

```typescript
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [type, setType] = useState<"A" | "B" | null>(
    (localStorage.getItem("type") as "A" | "B") || null
  );

  console.log(
    "[AUTH CONTEXT] Initialized with token:",
    token ? "present" : "missing"
  );
  console.log("[AUTH CONTEXT] Initialized with type:", type);

  const setAuth = (newToken: string, newType: "A" | "B") => {
    console.log(
      "[AUTH CONTEXT] Setting auth - token:",
      newToken ? "present" : "missing",
      "type:",
      newType
    );
    setToken(newToken);
    setType(newType);
    localStorage.setItem("token", newToken);
    localStorage.setItem("type", newType);
  };

  const logout = () => {
    console.log("[AUTH CONTEXT] Logging out");
    setToken(null);
    setType(null);
    localStorage.removeItem("token");
    localStorage.removeItem("type");
  };

  return (
    <AuthContext.Provider value={{ token, type, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### **Custom Hook**

```typescript
export const useAuth = () => useContext(AuthContext);
```

## 🔧 **Context Features**

### **State Management**

- **Token Storage**: JWT token for API authentication
- **User Type**: Type A or Type B user designation
- **Persistent Storage**: Uses localStorage for persistence
- **State Synchronization**: Keeps state and localStorage in sync

### **Authentication Actions**

- **setAuth**: Sets authentication state and stores in localStorage
- **logout**: Clears authentication state and localStorage
- **Automatic Initialization**: Loads state from localStorage on app start

### **Logging**

- **Initialization Logging**: Logs context initialization
- **Action Logging**: Logs authentication actions
- **Debug Information**: Comprehensive logging for debugging

## 🎯 **Usage Examples**

### **Basic Usage**

```typescript
import { useAuth } from "../context/AuthContext";

const MyComponent = () => {
  const { token, type, setAuth, logout } = useAuth();

  // Check authentication status
  if (!token) {
    return <div>Please log in</div>;
  }

  // Use user type
  if (type === "A") {
    return <div>Type A Dashboard</div>;
  }

  return <div>Type B Dashboard</div>;
};
```

### **Login Flow**

```typescript
const LoginPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, type } = response.data;

      // Set authentication state
      setAuth(token, type);

      // Navigate to dashboard
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // Login form
  );
};
```

### **Logout Flow**

```typescript
const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};
```

### **Route Protection**

```typescript
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

## 🔄 **State Flow**

### **Authentication Flow**

```
1. User logs in
2. API returns token and type
3. setAuth() called with token and type
4. State updated in context
5. localStorage updated
6. Components re-render with new state
```

### **Logout Flow**

```
1. User clicks logout
2. logout() called
3. State cleared in context
4. localStorage cleared
5. Components re-render with cleared state
6. Redirect to login page
```

### **App Initialization**

```
1. App starts
2. AuthProvider initializes
3. State loaded from localStorage
4. Components render with initial state
5. User sees appropriate dashboard
```

## 🧪 **Testing**

### **Context Testing**

```typescript
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";

test("provides authentication context", () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  expect(screen.getByText("Authenticated")).toBeInTheDocument();
});
```

### **Hook Testing**

```typescript
import { renderHook } from "@testing-library/react";
import { useAuth } from "../context/AuthContext";

test("useAuth hook returns context values", () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });

  expect(result.current.token).toBeNull();
  expect(result.current.type).toBeNull();
});
```

## 🔒 **Security Considerations**

### **Token Storage**

- **localStorage**: Tokens stored in browser localStorage
- **Automatic Cleanup**: Tokens cleared on logout
- **Expiration**: JWT tokens have expiration time
- **HTTPS**: Use HTTPS in production for secure transmission

### **State Management**

- **Immutable Updates**: State updates are immutable
- **Type Safety**: TypeScript ensures type safety
- **Validation**: Token validation handled by backend
- **Error Handling**: Graceful error handling

## 🚀 **Best Practices**

### **Context Design**

- **Single Responsibility**: Context handles only authentication
- **Clear Interface**: Well-defined TypeScript interface
- **Default Values**: Sensible default values
- **Error Boundaries**: Wrap context in error boundaries

### **Performance**

- **Minimal Re-renders**: Optimize context updates
- **Memoization**: Use React.memo for expensive components
- **State Structure**: Keep state structure simple
- **Update Frequency**: Minimize unnecessary updates

### **Maintenance**

- **Logging**: Comprehensive logging for debugging
- **Documentation**: Clear documentation for usage
- **Testing**: Comprehensive test coverage
- **Type Safety**: Strong TypeScript typing

## 🔧 **Configuration**

### **localStorage Keys**

```typescript
const STORAGE_KEYS = {
  TOKEN: "token",
  TYPE: "type",
};
```

### **Default Values**

```typescript
const DEFAULT_STATE = {
  token: null,
  type: null,
};
```

### **Logging Configuration**

```typescript
const LOG_PREFIX = "[AUTH CONTEXT]";
```

## 📊 **State Structure**

### **Context State**

```typescript
interface AuthState {
  token: string | null; // JWT token
  type: "A" | "B" | null; // User type
}
```

### **Context Actions**

```typescript
interface AuthActions {
  setAuth: (token: string, type: "A" | "B") => void;
  logout: () => void;
}
```

### **Context Value**

```typescript
type AuthContextType = AuthState & AuthActions;
```

## 🐛 **Debugging**

### **Console Logging**

The context provides comprehensive logging:

```typescript
// Initialization logging
[AUTH CONTEXT] Initialized with token: present/missing
[AUTH CONTEXT] Initialized with type: A/B/null

// Action logging
[AUTH CONTEXT] Setting auth - token: present/missing, type: A/B
[AUTH CONTEXT] Logging out
```

### **State Inspection**

```typescript
// Check current state
const { token, type } = useAuth();
console.log("Current auth state:", { token, type });

// Check localStorage
console.log("localStorage token:", localStorage.getItem("token"));
console.log("localStorage type:", localStorage.getItem("type"));
```

The AuthContext provides a robust foundation for authentication state management in the Unidirectional Communication System!
