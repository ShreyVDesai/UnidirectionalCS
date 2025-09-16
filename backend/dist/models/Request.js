"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RequestSchema = new mongoose_1.Schema({
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    acceptedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    acceptedAt: { type: Date, default: null },
    responded: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
exports.default = (0, mongoose_1.model)('Request', RequestSchema);
