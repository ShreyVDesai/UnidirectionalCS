"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const Request_1 = __importDefault(require("../models/Request"));
const router = (0, express_1.Router)();
// Type A creates a request
router.post('/', auth_1.default, async (req, res) => {
    console.log('[CREATE REQUEST] Starting request creation');
    const user = req.user;
    console.log('[CREATE REQUEST] User:', user);
    if (!user) {
        console.log('[CREATE REQUEST] No user found - not authenticated');
        return res.status(401).json({ error: 'Not authenticated' });
    }
    if (user.type !== 'A') {
        console.log('[CREATE REQUEST] User type is not A:', user.type);
        return res.status(403).json({ error: 'Only Type A can send requests' });
    }
    try {
        console.log('[CREATE REQUEST] Creating request for user:', user.id);
        const reqDoc = await Request_1.default.create({ from: user.id });
        console.log('[CREATE REQUEST] Request created successfully:', reqDoc);
        return res.status(201).json({ message: 'Request created', request: reqDoc });
    }
    catch (err) {
        console.error('[CREATE REQUEST] Error creating request:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});
// Type B: view pending requests (acceptedBy == null)
router.get('/pending', auth_1.default, async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: 'Not authenticated' });
    if (user.type !== 'B')
        return res.status(403).json({ error: 'Only Type B can view pending' });
    try {
        const pending = await Request_1.default.find({ acceptedBy: null }).populate('from', 'username email');
        return res.json(pending);
    }
    catch (err) {
        console.error('pending error', err);
        return res.status(500).json({ error: 'Server error' });
    }
});
// Type B accepts a request
router.post('/:id/accept', auth_1.default, async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: 'Not authenticated' });
    if (user.type !== 'B')
        return res.status(403).json({ error: 'Only Type B can accept requests' });
    try {
        const reqDoc = await Request_1.default.findById(req.params.id);
        if (!reqDoc)
            return res.status(404).json({ error: 'Request not found' });
        if (reqDoc.acceptedBy)
            return res.status(400).json({ error: 'Request already accepted' });
        reqDoc.acceptedBy = user.id;
        reqDoc.acceptedAt = new Date();
        await reqDoc.save();
        return res.json({ message: 'Request accepted', request: reqDoc });
    }
    catch (err) {
        console.error('accept error', err);
        return res.status(500).json({ error: 'Server error' });
    }
});
// Type A: view sent requests that were accepted (optional helper)
router.get('/sent', auth_1.default, async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: 'Not authenticated' });
    if (user.type !== 'A')
        return res.status(403).json({ error: 'Only Type A can view sent' });
    try {
        const sent = await Request_1.default.find({ from: user.id, acceptedBy: { $ne: null } }).populate('acceptedBy', 'username email');
        return res.json(sent);
    }
    catch (err) {
        console.error('sent error', err);
        return res.status(500).json({ error: 'Server error' });
    }
});
// Type B: view accepted requests (requests they accepted)
router.get('/accepted', auth_1.default, async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: 'Not authenticated' });
    if (user.type !== 'B')
        return res.status(403).json({ error: 'Only Type B can view accepted' });
    try {
        console.log('[ACCEPTED REQUESTS] Fetching accepted requests for user:', user.id);
        const accepted = await Request_1.default.find({ acceptedBy: user.id }).populate('from', 'username email');
        console.log('[ACCEPTED REQUESTS] Found accepted requests:', accepted.length);
        return res.json(accepted);
    }
    catch (err) {
        console.error('[ACCEPTED REQUESTS] Error fetching accepted requests:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
