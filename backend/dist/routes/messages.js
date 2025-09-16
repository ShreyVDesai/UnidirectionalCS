"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const Request_1 = __importDefault(require("../models/Request"));
const Message_1 = __importDefault(require("../models/Message"));
const router = (0, express_1.Router)();
// Send message (Type A or B)
router.post('/', auth_1.default, async (req, res) => {
    const user = req.user;
    const { requestId, content } = req.body;
    if (!user)
        return res.status(401).json({ error: 'Not authenticated' });
    if (!requestId || !content)
        return res.status(400).json({ error: 'requestId and content required' });
    try {
        const reqDoc = await Request_1.default.findById(requestId);
        if (!reqDoc)
            return res.status(404).json({ error: 'Request not found' });
        let to;
        if (user.type === 'A') {
            // Only originator A can send after acceptance
            if (reqDoc.from.toString() !== user.id)
                return res.status(403).json({ error: 'Not your request' });
            if (!reqDoc.acceptedBy)
                return res.status(400).json({ error: 'Request not accepted yet' });
            to = reqDoc.acceptedBy;
        }
        else {
            // Type B can respond only if they are the accepter
            if (!reqDoc.acceptedBy || reqDoc.acceptedBy.toString() !== user.id)
                return res.status(403).json({ error: 'Not your accepted request' });
            to = reqDoc.from;
            // Mark responded so reminders stop
            if (!reqDoc.responded) {
                reqDoc.responded = true;
                await reqDoc.save();
            }
        }
        const message = await Message_1.default.create({ requestId, from: user.id, to, content });
        return res.status(201).json({ message: 'Message sent', data: message });
    }
    catch (err) {
        console.error('send message error', err);
        return res.status(500).json({ error: 'Server error' });
    }
});
// Get messages for a request (only allowed participants)
router.get('/:requestId', auth_1.default, async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: 'Not authenticated' });
    try {
        const reqDoc = await Request_1.default.findById(req.params.requestId);
        if (!reqDoc)
            return res.status(404).json({ error: 'Request not found' });
        // ensure requester or accepter only
        if (user.type === 'A' && reqDoc.from.toString() !== user.id)
            return res.status(403).json({ error: 'Not your request' });
        if (user.type === 'B' && (!reqDoc.acceptedBy || reqDoc.acceptedBy.toString() !== user.id))
            return res.status(403).json({ error: 'Not your request' });
        const messages = await Message_1.default.find({ requestId: req.params.requestId }).sort({ createdAt: 1 });
        return res.json(messages);
    }
    catch (err) {
        console.error('get messages error', err);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
