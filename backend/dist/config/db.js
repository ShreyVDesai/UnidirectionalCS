"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    console.log('[DB] Attempting to connect to MongoDB...');
    console.log('[DB] MONGO_URI:', uri ? 'configured' : 'not configured');
    if (!uri) {
        console.error('[DB] MONGO_URI is not defined in environment');
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(uri);
        console.log('[DB] MongoDB connected successfully');
        console.log('[DB] Database name:', mongoose_1.default.connection.db?.databaseName);
    }
    catch (err) {
        console.error('[DB] Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};
exports.default = connectDB;
