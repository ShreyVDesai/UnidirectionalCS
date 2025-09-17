import dotenv from "dotenv";
dotenv.config();  

import app from "./app";
import mongoose from "mongoose";

// ✅ import reminder cron job AFTER dotenv is loaded
import "./jobs/reminderJob";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/commlink";

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  }
})();
