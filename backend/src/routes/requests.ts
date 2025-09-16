import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import RequestModel from '../models/Request';
import User from '../models/User';

const router = Router();

// Type A creates a request
router.post('/', auth, async (req: Request, res: Response) => {
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
    const reqDoc = await RequestModel.create({ from: user.id });
    console.log('[CREATE REQUEST] Request created successfully:', reqDoc);
    return res.status(201).json({ message: 'Request created', request: reqDoc });
  } catch (err) {
    console.error('[CREATE REQUEST] Error creating request:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Type B: view pending requests (acceptedBy == null)
router.get('/pending', auth, async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  if (user.type !== 'B') return res.status(403).json({ error: 'Only Type B can view pending' });

  try {
    const pending = await RequestModel.find({ acceptedBy: null }).populate('from', 'username email');
    return res.json(pending);
  } catch (err) {
    console.error('pending error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Type B accepts a request
router.post('/:id/accept', auth, async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  if (user.type !== 'B') return res.status(403).json({ error: 'Only Type B can accept requests' });

  try {
    const reqDoc = await RequestModel.findById(req.params.id);
    if (!reqDoc) return res.status(404).json({ error: 'Request not found' });
    if (reqDoc.acceptedBy) return res.status(400).json({ error: 'Request already accepted' });

    reqDoc.acceptedBy = user.id as any;
    reqDoc.acceptedAt = new Date();
    await reqDoc.save();
    return res.json({ message: 'Request accepted', request: reqDoc });
  } catch (err) {
    console.error('accept error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Type A: view sent requests that were accepted (optional helper)
router.get('/sent', auth, async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  if (user.type !== 'A') return res.status(403).json({ error: 'Only Type A can view sent' });

  try {
    const sent = await RequestModel.find({ from: user.id, acceptedBy: { $ne: null } }).populate('acceptedBy', 'username email');
    return res.json(sent);
  } catch (err) {
    console.error('sent error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Type B: view accepted requests (requests they accepted)
router.get('/accepted', auth, async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  if (user.type !== 'B') return res.status(403).json({ error: 'Only Type B can view accepted' });

  try {
    console.log('[ACCEPTED REQUESTS] Fetching accepted requests for user:', user.id);
    const accepted = await RequestModel.find({ acceptedBy: user.id }).populate('from', 'username email');
    console.log('[ACCEPTED REQUESTS] Found accepted requests:', accepted.length);
    return res.json(accepted);
  } catch (err) {
    console.error('[ACCEPTED REQUESTS] Error fetching accepted requests:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
