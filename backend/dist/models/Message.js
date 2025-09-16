"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    requestId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Request', required: true },
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.default = (0, mongoose_1.model)('Message', MessageSchema);
