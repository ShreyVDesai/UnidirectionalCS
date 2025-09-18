import express, { Application } from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import requestRoutes from "./routes/request";
import messageRoutes from "./routes/message"; // ✅ keep this (your real message system)

const app: Application = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Routes =====
// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "CommLink Backend API is running!", 
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes); // ✅ keep this

export default app;
