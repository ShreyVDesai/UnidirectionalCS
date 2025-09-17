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
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes); // ✅ keep this

export default app;
