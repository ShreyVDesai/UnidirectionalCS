# Frontend Documentation

## 📁 **Frontend Structure**

The frontend is built with **React**, **TypeScript**, and **Material-UI**. It follows a component-based architecture with clear separation of concerns.

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React context for state management
│   ├── pages/             # Application pages and routing
│   ├── api.ts             # API client configuration
│   ├── types.ts           # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   └── index.tsx          # Application entry point
├── public/                # Static assets
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🚀 **Getting Started**

### **Installation**

```bash
cd frontend
npm install
```

### **Development**

```bash
npm start
```

### **Production Build**

```bash
npm run build
```

### **Testing**

```bash
npm test
```

## 📋 **Dependencies**

### **Core Dependencies**

- **react**: React library
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing
- **axios**: HTTP client for API calls
- **@mui/material**: Material-UI component library
- **@mui/icons-material**: Material-UI icons
- **@emotion/react**: CSS-in-JS styling
- **@emotion/styled**: Styled components

### **Development Dependencies**

- **typescript**: TypeScript compiler
- **@types/react**: React TypeScript definitions
- **@types/react-dom**: React DOM TypeScript definitions
- **react-scripts**: Create React App scripts

## 🎨 **UI Framework**

### **Material-UI (MUI)**

The application uses Material-UI for consistent, modern UI components:

- **Typography**: Consistent text styling
- **Buttons**: Various button styles and colors
- **Forms**: TextField, Select, FormControl components
- **Layout**: Container, Box, Grid for layout
- **Navigation**: Tabs for dashboard navigation
- **Feedback**: Alert, Snackbar for user feedback

### **Theme Configuration**

```typescript
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});
```

## 🔄 **State Management**

### **React Context**

The application uses React Context for global state management:

- **AuthContext**: User authentication state
- **Token Management**: JWT token storage and retrieval
- **User Type**: Type A/B user type tracking
- **Login/Logout**: Authentication state changes

### **Local State**

Individual components manage their own local state:

- **Form Data**: Input field values
- **Loading States**: Button loading indicators
- **Error States**: Error message display
- **Data Fetching**: API response data

## 🛣️ **Routing**

### **Route Structure**

```
/ (Home) - Protected route
├── /login - Public route
├── /register - Public route
└── / (Dashboard) - Protected route
    ├── Dashboard A (Type A users)
    └── Dashboard B (Type B users)
```

### **Route Protection**

- **PrivateRoute**: Protects authenticated routes
- **Authentication Check**: Redirects to login if not authenticated
- **Role-based Access**: Different dashboards for different user types

## 📱 **Responsive Design**

### **Mobile-First Approach**

- **Container**: Responsive container with max-width
- **Grid System**: Material-UI Grid for responsive layouts
- **Typography**: Responsive text sizing
- **Touch-Friendly**: Appropriate touch targets for mobile

### **Breakpoints**

- **xs**: Extra small devices (phones)
- **sm**: Small devices (tablets)
- **md**: Medium devices (desktops)
- **lg**: Large devices (large desktops)

## 🔌 **API Integration**

### **Axios Configuration**

```typescript
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});
```

### **Request Interceptors**

- **Authentication**: Automatically adds JWT token to requests
- **Logging**: Comprehensive request/response logging
- **Error Handling**: Centralized error handling

### **Response Interceptors**

- **Success Logging**: Log successful responses
- **Error Logging**: Log and handle errors
- **Token Refresh**: Handle token expiration

## 🧪 **Testing**

### **Test Setup**

- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **User Event**: User interaction testing

### **Test Files**

- **Component Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **API Tests**: Mock API response testing

## 📚 **File Documentation**

- [Components](components.md) - Reusable UI components
- [Pages](pages.md) - Application pages and routing
- [Context](context.md) - React context and state management
- [API Integration](api.md) - API client and data fetching

## 🎯 **Key Features**

### **Authentication Flow**

1. **Login/Register**: User authentication
2. **Token Storage**: JWT token in localStorage
3. **Route Protection**: Automatic redirects
4. **Context Updates**: Global state updates

### **Dashboard Functionality**

- **Type A Dashboard**: Request creation and management
- **Type B Dashboard**: Request acceptance and messaging
- **Tabbed Interface**: Organized request management
- **Real-time Updates**: Automatic data refresh

### **Messaging System**

- **Real-time Chat**: Message exchange interface
- **Message History**: Chronological message display
- **User Identification**: Clear sender identification
- **Responsive Design**: Mobile-friendly messaging

## 🚀 **Performance Optimization**

### **Code Splitting**

- **Route-based Splitting**: Lazy load route components
- **Component Splitting**: Split large components
- **Bundle Optimization**: Minimize bundle size

### **State Optimization**

- **Context Optimization**: Minimize context re-renders
- **Local State**: Use local state when appropriate
- **Memoization**: Use React.memo for expensive components

### **API Optimization**

- **Request Caching**: Cache API responses
- **Debouncing**: Debounce user input
- **Loading States**: Show loading indicators

## 🐛 **Debugging**

### **Development Tools**

- **React DevTools**: Component inspection
- **Redux DevTools**: State inspection (if using Redux)
- **Network Tab**: API call monitoring
- **Console Logging**: Comprehensive logging

### **Error Handling**

- **Error Boundaries**: Catch React errors
- **API Error Handling**: Graceful API error handling
- **User Feedback**: Clear error messages
- **Fallback UI**: Error state components

## 🚀 **Deployment**

### **Production Build**

```bash
npm run build
```

### **Build Output**

- **Static Files**: HTML, CSS, JS files
- **Asset Optimization**: Minified and optimized
- **Source Maps**: For debugging (optional)

### **Deployment Options**

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFront, CloudFlare
- **Server**: Nginx, Apache

The frontend provides a modern, responsive, and user-friendly interface for the Unidirectional Communication System!
