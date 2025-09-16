"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScheduledTasks = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Request_1 = __importDefault(require("../models/Request"));
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
const email_1 = require("./email");
const REMINDER_EVERY_MINUTES = 5;
const RESPONSE_WINDOW_MINUTES = 60;
// Function to run the scheduled tasks (for testing)
const runScheduledTasks = async () => {
    try {
        console.log('[SCHEDULER] Running scheduled job (reminders & cleanup)');
        const now = new Date();
        console.log('[SCHEDULER] Current time:', now.toISOString());
        // 1) Reminders for accepted requests with no response yet
        console.log('[SCHEDULER] Checking for pending reminders...');
        const pending = await Request_1.default.find({ acceptedBy: { $ne: null }, responded: false });
        console.log('[SCHEDULER] Found', pending.length, 'pending requests');
        for (const req of pending) {
            if (!req.acceptedAt)
                continue;
            const minutes = (now.getTime() - req.acceptedAt.getTime()) / 60000;
            console.log(`[SCHEDULER] Request ${req._id}: ${minutes.toFixed(2)} minutes since acceptance`);
            // send reminders only while within the 1 hour response window
            if (minutes >= 0 && minutes < RESPONSE_WINDOW_MINUTES) {
                const userB = await User_1.default.findById(req.acceptedBy);
                const userA = await User_1.default.findById(req.from);
                if (userB && userB.email) {
                    const subject = 'Reminder: please respond to the accepted request';
                    const body = `Hello ${userB.username || userB.email},

You accepted a request from ${userA?.username || userA?.email} at ${req.acceptedAt?.toISOString()}. Please respond within ${RESPONSE_WINDOW_MINUTES} minutes.

Thanks.`;
                    try {
                        await (0, email_1.sendEmail)(userB.email, subject, body);
                        console.log(`[SCHEDULER] Reminder sent to ${userB.email}`);
                    }
                    catch (err) {
                        console.error('[SCHEDULER] Email send error:', err);
                    }
                }
            }
        }
        // 2) Cleanup: delete Type A messages older than 1 hour
        console.log('[SCHEDULER] Checking for expired messages...');
        const cutoff = new Date(Date.now() - RESPONSE_WINDOW_MINUTES * 60 * 1000);
        console.log('[SCHEDULER] Cutoff time:', cutoff.toISOString());
        // Find requests that were accepted more than 1 hour ago
        const expiredRequests = await Request_1.default.find({
            acceptedAt: { $lte: cutoff },
            acceptedBy: { $ne: null }
        });
        console.log('[SCHEDULER] Found', expiredRequests.length, 'expired requests');
        // Delete messages from Type A users for these expired requests
        let totalDeleted = 0;
        for (const req of expiredRequests) {
            const delRes = await Message_1.default.deleteMany({
                requestId: req._id,
                from: req.from // Only delete messages from Type A (the requester)
            });
            if (delRes.deletedCount && delRes.deletedCount > 0) {
                console.log(`[SCHEDULER] Deleted ${delRes.deletedCount} expired Type A messages for request ${req._id}`);
                totalDeleted += delRes.deletedCount;
            }
        }
        console.log(`[SCHEDULER] Total messages deleted: ${totalDeleted}`);
        console.log('[SCHEDULER] Scheduled job completed successfully');
        return {
            pendingRequests: pending.length,
            expiredRequests: expiredRequests.length,
            messagesDeleted: totalDeleted
        };
    }
    catch (err) {
        console.error('[SCHEDULER] Error in scheduled job:', err);
        throw err;
    }
};
exports.runScheduledTasks = runScheduledTasks;
// Cron: run every 5 minutes
node_cron_1.default.schedule('*/5 * * * *', async () => {
    try {
        await (0, exports.runScheduledTasks)();
    }
    catch (err) {
        console.error('[CRON] Error in scheduled job:', err);
    }
});
