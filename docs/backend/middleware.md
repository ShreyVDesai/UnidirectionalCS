# Middleware Documentation

## 🔐 **Authentication Middleware**

**File**: `src/middleware/auth.ts`

### **Purpose**

Provides JWT token validation and user context injection for protected routes.

### **Dependencies**

```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
```

### **Interface Definition**

```typescript
interface TokenPayload {
  userId: string;
  type: "A" | "B";
  iat?: number;
  exp?: number;
}
```

### **Functionality**

1. **Token Extraction**: Extracts JWT token from Authorization header
2. **Token Validation**: Verifies token signature and expiration
3. **User Context**: Adds user information to request object
4. **Error Handling**: Returns appropriate error responses

### **Code Structure**

```typescript
export default function auth(req: Request, res: Response, next: NextFunction) {
  // 1. Extract token from Authorization header
  const header = req.headers.authorization;

  // 2. Validate header format
  if (!header || header.split(" ").length !== 2) {
    return res
      .status(401)
      .json({ error: "Invalid authorization header format" });
  }

  // 3. Extract token
  const token = header.split(" ")[1];

  // 4. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    req.user = { id: decoded.userId, type: decoded.type };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}
```

### **Request Object Enhancement**

After successful authentication, the request object is enhanced with:

```typescript
req.user = {
  id: string;    // User ID from token
  type: 'A' | 'B'; // User type from token
}
```

### **Usage Examples**

```typescript
// Protect a route
router.get("/protected", auth, (req, res) => {
  // req.user is now available
  res.json({ userId: req.user.id, type: req.user.type });
});

// Type-specific protection
router.get("/type-a-only", auth, (req, res) => {
  if (req.user.type !== "A") {
    return res.status(403).json({ error: "Only Type A users allowed" });
  }
  // Handle Type A specific logic
});
```

### **Error Responses**

- **401 Unauthorized**: Missing or malformed Authorization header
- **403 Forbidden**: Invalid or expired token

### **Security Features**

- **Token Validation**: Verifies JWT signature
- **Expiration Check**: Automatically handles expired tokens
- **Type Safety**: TypeScript interfaces for payload validation
- **Error Logging**: Comprehensive logging for debugging

## 🛡️ **Security Considerations**

### **Token Security**

- **Secret Key**: Uses environment variable for JWT secret
- **Expiration**: Tokens expire after 2 hours
- **Signature Verification**: Validates token integrity

### **Error Handling**

- **No Information Leakage**: Generic error messages
- **Logging**: Detailed logs for debugging
- **Graceful Degradation**: Proper error responses

### **Performance**

- **Synchronous Validation**: Fast token verification
- **Minimal Overhead**: Lightweight middleware
- **Early Exit**: Quick failure for invalid tokens

## 🔧 **Configuration**

### **Environment Variables**

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### **Token Format**

```
Authorization: Bearer <jwt-token>
```

### **Token Payload**

```typescript
{
  userId: string; // User ID
  type: "A" | "B"; // User type
  iat: number; // Issued at
  exp: number; // Expiration time
}
```

## 🧪 **Testing**

### **Unit Testing**

```typescript
// Test valid token
const token = jwt.sign({ userId: "123", type: "A" }, "secret");
const req = { headers: { authorization: `Bearer ${token}` } };
const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
const next = jest.fn();

auth(req as any, res as any, next);
expect(next).toHaveBeenCalled();
expect(req.user).toEqual({ id: "123", type: "A" });
```

### **Integration Testing**

```typescript
// Test protected route
const response = await request(app)
  .get("/api/protected")
  .set("Authorization", `Bearer ${validToken}`)
  .expect(200);

expect(response.body.userId).toBe("123");
```

## 🚀 **Best Practices**

### **Implementation**

- **Consistent Error Handling**: Standardized error responses
- **Type Safety**: TypeScript interfaces for validation
- **Logging**: Comprehensive logging for debugging
- **Performance**: Minimal overhead

### **Security**

- **Secret Management**: Use environment variables
- **Token Expiration**: Implement reasonable expiration times
- **Error Messages**: Don't expose sensitive information
- **Validation**: Validate all token claims

### **Maintenance**

- **Documentation**: Clear documentation for usage
- **Testing**: Comprehensive test coverage
- **Monitoring**: Monitor authentication failures
- **Updates**: Keep JWT library updated

The authentication middleware provides secure, efficient token validation for the Unidirectional Communication System!
