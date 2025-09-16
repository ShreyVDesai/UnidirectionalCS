# API Integration Documentation

## 🔌 **API Client Overview**

The frontend uses Axios as the HTTP client for API communication with comprehensive request/response handling and authentication.

## 📁 **API Structure**

```
api.ts          # Axios client configuration and interceptors
```

## 🌐 **API Client Configuration**

**File**: `src/api.ts`

### **Purpose**

Provides a configured Axios instance with automatic JWT token attachment and comprehensive logging.

### **Dependencies**

```typescript
import axios from "axios";
```

### **Client Configuration**

```typescript
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Backend URL
});
```

### **Request Interceptor**

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("[API REQUEST]", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });

  return config;
});
```

### **Response Interceptor**

```typescript
api.interceptors.response.use(
  (response) => {
    console.log("[API RESPONSE]", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("[API ERROR]", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);
```

## 🔐 **Authentication Integration**

### **Automatic Token Attachment**

The API client automatically attaches JWT tokens to requests:

```typescript
// Token is automatically added to headers
const response = await api.get("/protected-endpoint");
// Headers: { Authorization: 'Bearer <token>' }
```

### **Token Management**

```typescript
// Get token from localStorage
const token = localStorage.getItem("token");

// Add to request headers
if (token && config.headers) {
  config.headers["Authorization"] = `Bearer ${token}`;
}
```

## 📡 **API Endpoints**

### **Authentication Endpoints**

#### **User Registration**

```typescript
const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
  type: "A" | "B";
}) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};
```

#### **User Login**

```typescript
const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post("/auth/login", credentials);
  return response.data; // { token, type }
};
```

### **Request Endpoints**

#### **Create Request (Type A)**

```typescript
const createRequest = async () => {
  const response = await api.post("/requests");
  return response.data;
};
```

#### **Get Pending Requests (Type B)**

```typescript
const getPendingRequests = async () => {
  const response = await api.get("/requests/pending");
  return response.data;
};
```

#### **Get Accepted Requests (Type B)**

```typescript
const getAcceptedRequests = async () => {
  const response = await api.get("/requests/accepted");
  return response.data;
};
```

#### **Get Sent Requests (Type A)**

```typescript
const getSentRequests = async () => {
  const response = await api.get("/requests/sent");
  return response.data;
};
```

#### **Accept Request (Type B)**

```typescript
const acceptRequest = async (requestId: string) => {
  const response = await api.post(`/requests/${requestId}/accept`);
  return response.data;
};
```

### **Message Endpoints**

#### **Send Message**

```typescript
const sendMessage = async (messageData: {
  requestId: string;
  content: string;
}) => {
  const response = await api.post("/messages", messageData);
  return response.data;
};
```

#### **Get Messages**

```typescript
const getMessages = async (requestId: string) => {
  const response = await api.get(`/messages/${requestId}`);
  return response.data;
};
```

### **Test Endpoints**

#### **Test Backend**

```typescript
const testBackend = async () => {
  const response = await api.get("/test");
  return response.data;
};
```

#### **Test Scheduler**

```typescript
const testScheduler = async () => {
  const response = await api.get("/test-scheduler");
  return response.data;
};
```

## 🔄 **API Usage Patterns**

### **Error Handling**

```typescript
const apiCall = async () => {
  try {
    const response = await api.get("/endpoint");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Handle authentication error
      logout();
      navigate("/login");
    } else if (error.response?.status === 403) {
      // Handle authorization error
      alert("You do not have permission to perform this action");
    } else {
      // Handle other errors
      console.error("API Error:", error);
      alert("An error occurred. Please try again.");
    }
  }
};
```

### **Loading States**

```typescript
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const data = await api.get("/endpoint");
    setData(data.data);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsLoading(false);
  }
};
```

### **Form Submission**

```typescript
const handleSubmit = async (formData: FormData) => {
  try {
    const response = await api.post("/endpoint", formData);
    alert("Success!");
    // Handle success
  } catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    alert(`Error: ${errorMessage}`);
  }
};
```

## 📊 **Response Data Types**

### **Authentication Responses**

```typescript
interface LoginResponse {
  token: string;
  type: "A" | "B";
}

interface RegisterResponse {
  message: string;
}
```

### **Request Responses**

```typescript
interface Request {
  _id: string;
  from: User | string;
  acceptedBy?: User | string | null;
  acceptedAt?: string | null;
  responded: boolean;
  createdAt: string;
}

interface CreateRequestResponse {
  message: string;
  request: Request;
}
```

### **Message Responses**

```typescript
interface Message {
  _id: string;
  requestId: string;
  from: User | string;
  to: User | string;
  content: string;
  createdAt: string;
}

interface SendMessageResponse {
  message: string;
  data: Message;
}
```

### **Error Responses**

```typescript
interface ErrorResponse {
  error: string;
  details?: string;
}
```

## 🧪 **API Testing**

### **Mock API Calls**

```typescript
// Mock axios for testing
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("API call returns data", async () => {
  const mockData = { message: "Success" };
  mockedAxios.get.mockResolvedValue({ data: mockData });

  const result = await api.get("/test");
  expect(result.data).toEqual(mockData);
});
```

### **Integration Testing**

```typescript
test("API client configuration", () => {
  expect(api.defaults.baseURL).toBe("http://localhost:3000/api");
  expect(api.defaults.timeout).toBeUndefined();
});
```

## 🔧 **Configuration**

### **Base URL Configuration**

```typescript
// Development
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Production
const api = axios.create({
  baseURL: "https://your-domain.com/api",
});
```

### **Environment-based Configuration**

```typescript
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://your-domain.com/api"
    : "http://localhost:3000/api";

const api = axios.create({ baseURL });
```

## 🚀 **Best Practices**

### **API Design**

- **Consistent URLs**: Use RESTful URL patterns
- **Error Handling**: Comprehensive error handling
- **Type Safety**: TypeScript interfaces for all responses
- **Logging**: Detailed request/response logging

### **Performance**

- **Request Optimization**: Minimize unnecessary requests
- **Caching**: Implement response caching where appropriate
- **Debouncing**: Debounce user input for search/filter
- **Loading States**: Show loading indicators

### **Security**

- **Token Management**: Secure token storage and transmission
- **HTTPS**: Use HTTPS in production
- **Input Validation**: Validate all user inputs
- **Error Messages**: Don't expose sensitive information

## 🐛 **Debugging**

### **Request Logging**

The API client provides comprehensive logging:

```typescript
// Request logging
[API REQUEST] {
  url: '/requests',
  method: 'post',
  headers: { Authorization: 'Bearer <token>' },
  data: { requestId: '123', content: 'Hello' }
}

// Response logging
[API RESPONSE] {
  url: '/requests',
  status: 201,
  data: { message: 'Request created', request: {...} }
}

// Error logging
[API ERROR] {
  url: '/requests',
  status: 400,
  data: { error: 'Invalid request data' }
}
```

### **Network Tab**

Use browser DevTools Network tab to monitor:

- Request/response headers
- Request/response bodies
- Response times
- Error status codes

The API integration provides a robust foundation for frontend-backend communication in the Unidirectional Communication System!
