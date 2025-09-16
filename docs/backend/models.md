# Database Models

## 📊 **Overview**

The backend uses **MongoDB** with **Mongoose** for data modeling. All models are defined in TypeScript with strict typing and validation.

## 🗄️ **Model Structure**

```
models/
├── User.ts        # User authentication and profile data
├── Request.ts     # Communication requests between users
└── Message.ts     # Messages within accepted requests
```

## 👤 **User Model**

**File**: `src/models/User.ts`

### **Purpose**

Stores user authentication data and profile information. Supports two user types: Type A (Requesters) and Type B (Responders).

### **Schema Definition**

```typescript
interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  type: "A" | "B";
  createdAt: Date;
}
```

### **Schema Configuration**

```typescript
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ["A", "B"], required: true },
  createdAt: { type: Date, default: Date.now },
});
```

### **Key Features**

- **Unique Constraints**: Username and email must be unique
- **Type Validation**: Only 'A' or 'B' types allowed
- **Automatic Timestamps**: CreatedAt field auto-populated
- **Password Hashing**: Handled in route controllers

### **Usage Examples**

```typescript
// Create a new user
const user = new User({
  username: "requester1",
  email: "requester1@test.com",
  password: hashedPassword,
  type: "A",
});

// Find user by email
const user = await User.findOne({ email: "user@example.com" });

// Find users by type
const typeAUsers = await User.find({ type: "A" });
```

### **Common Queries**

- **Authentication**: Find by email for login
- **Registration**: Check for existing username/email
- **User Lookup**: Find by ID for request/message operations

## 📝 **Request Model**

**File**: `src/models/Request.ts`

### **Purpose**

Manages communication requests between Type A and Type B users. Tracks the lifecycle from creation to acceptance.

### **Schema Definition**

```typescript
interface IRequest extends Document {
  from: Types.ObjectId;
  acceptedBy?: Types.ObjectId | null;
  acceptedAt?: Date | null;
  responded: boolean;
  createdAt: Date;
}
```

### **Schema Configuration**

```typescript
const RequestSchema = new Schema<IRequest>({
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  acceptedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  acceptedAt: { type: Date, default: null },
  responded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
```

### **Key Features**

- **User References**: Links to User model via ObjectId
- **Status Tracking**: Tracks acceptance and response status
- **Timestamps**: CreatedAt and acceptedAt for timing logic
- **Population Support**: Can populate user data when querying

### **Usage Examples**

```typescript
// Create a new request
const request = new RequestModel({
  from: userId,
});

// Find pending requests (not accepted)
const pendingRequests = await RequestModel.find({ acceptedBy: null }).populate(
  "from",
  "username email"
);

// Find accepted requests for a user
const acceptedRequests = await RequestModel.find({
  acceptedBy: userId,
}).populate("from", "username email");

// Accept a request
await RequestModel.findByIdAndUpdate(requestId, {
  acceptedBy: userId,
  acceptedAt: new Date(),
});
```

### **Common Queries**

- **Pending Requests**: `{ acceptedBy: null }`
- **Accepted Requests**: `{ acceptedBy: { $ne: null } }`
- **User's Sent Requests**: `{ from: userId }`
- **Expired Requests**: `{ acceptedAt: { $lte: cutoffDate } }`

## 💬 **Message Model**

**File**: `src/models/Message.ts`

### **Purpose**

Stores messages exchanged between users within accepted requests. Includes timing information for automated cleanup.

### **Schema Definition**

```typescript
interface IMessage extends Document {
  requestId: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
  content: string;
  createdAt: Date;
}
```

### **Schema Configuration**

```typescript
const MessageSchema = new Schema<IMessage>({
  requestId: { type: Schema.Types.ObjectId, ref: "Request", required: true },
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
```

### **Key Features**

- **Request Linking**: Every message belongs to a request
- **User References**: Links to both sender and receiver
- **Content Storage**: Stores the actual message content
- **Timestamps**: CreatedAt for cleanup logic

### **Usage Examples**

```typescript
// Create a new message
const message = new MessageModel({
  requestId: requestId,
  from: senderId,
  to: receiverId,
  content: "Hello, how can I help you?",
});

// Get messages for a request
const messages = await MessageModel.find({ requestId: requestId })
  .populate("from", "username")
  .populate("to", "username")
  .sort({ createdAt: 1 });

// Delete expired Type A messages
await MessageModel.deleteMany({
  requestId: requestId,
  from: typeAUserId,
});
```

### **Common Queries**

- **Request Messages**: `{ requestId: requestId }`
- **User Messages**: `{ from: userId }` or `{ to: userId }`
- **Expired Messages**: `{ createdAt: { $lte: cutoffDate } }`
- **Type A Messages**: `{ from: typeAUserId }` (for cleanup)

## 🔗 **Model Relationships**

### **User ↔ Request**

- **One-to-Many**: A user can create multiple requests
- **One-to-Many**: A user can accept multiple requests
- **Population**: Requests can populate user data

### **Request ↔ Message**

- **One-to-Many**: A request can have multiple messages
- **Required**: Every message must belong to a request
- **Population**: Messages can populate request data

### **User ↔ Message**

- **One-to-Many**: A user can send multiple messages
- **One-to-Many**: A user can receive multiple messages
- **Population**: Messages can populate user data

## 🗂️ **Database Indexes**

### **Recommended Indexes**

```javascript
// User collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ type: 1 });

// Request collection
db.requests.createIndex({ from: 1 });
db.requests.createIndex({ acceptedBy: 1 });
db.requests.createIndex({ acceptedAt: 1 });
db.requests.createIndex({ createdAt: 1 });

// Message collection
db.messages.createIndex({ requestId: 1 });
db.messages.createIndex({ from: 1 });
db.messages.createIndex({ to: 1 });
db.messages.createIndex({ createdAt: 1 });
```

## 🧪 **Testing Models**

### **Model Validation**

```typescript
// Test user creation
const user = new User({
  username: "testuser",
  email: "test@example.com",
  password: "hashedpassword",
  type: "A",
});
await user.save();

// Test request creation
const request = new RequestModel({
  from: user._id,
});
await request.save();

// Test message creation
const message = new MessageModel({
  requestId: request._id,
  from: user._id,
  to: anotherUser._id,
  content: "Test message",
});
await message.save();
```

### **Query Testing**

```typescript
// Test population
const requestWithUser = await RequestModel.findById(requestId).populate(
  "from",
  "username email"
);

// Test filtering
const pendingRequests = await RequestModel.find({ acceptedBy: null });
const expiredRequests = await RequestModel.find({
  acceptedAt: { $lte: new Date(Date.now() - 60 * 60 * 1000) },
});
```

## 🚀 **Best Practices**

### **Model Design**

- **Use References**: Link models with ObjectId references
- **Validate Data**: Use Mongoose validation
- **Index Frequently Queried Fields**: Improve query performance
- **Use Population**: Load related data efficiently

### **Query Optimization**

- **Use Projection**: Only select needed fields
- **Limit Results**: Use pagination for large datasets
- **Use Aggregation**: For complex queries
- **Cache Results**: For frequently accessed data

### **Data Integrity**

- **Use Transactions**: For multi-document operations
- **Validate References**: Ensure foreign keys exist
- **Handle Errors**: Graceful error handling
- **Clean Up**: Remove orphaned data

The models provide a solid foundation for the Unidirectional Communication System with proper relationships, validation, and performance optimization!
