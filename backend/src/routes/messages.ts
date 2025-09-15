import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import RequestModel from '../models/Request';
import MessageModel from '../models/Message';

const router = Router();

// Send message (Type A or B)
router.post('/', auth, async (req: Request, res: Response) => {
  const user = req.user;
  const { requestId, content } = req.body;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  if (!requestId || !content) return res.status(400).json({ error: 'requestId and content required' });

  try {
    const reqDoc = await RequestModel.findById(requestId);
    if (!reqDoc) return res.status(404).json({ error: 'Request not found' });

    let to: any;
    if (user.type === 'A') {
      // Only originator A can send after acceptance
      if (reqDoc.from.toString() !== user.id) return res.status(403).json({ error: 'Not your request' });
      if (!reqDoc.acceptedBy) return res.status(400).json({ error: 'Request not accepted yet' });
      to = reqDoc.acceptedBy;
    } else {
      // Type B can respond only if they are the accepter
      if (!reqDoc.acceptedBy || reqDoc.acceptedBy.toString() !== user.id) return res.status(403).json({ error: 'Not your accepted request' });
      to = reqDoc.from;
      // Mark responded so reminders stop
      if (!reqDoc.responded) {
        reqDoc.responded = true;
        await reqDoc.save();
      }
    }

    const message = await MessageModel.create({ requestId, from: user.id, to, content });
    return res.status(201).json({ message: 'Message sent', data: message });
  } catch (err) {
    console.error('send message error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get messages for a request (only allowed participants)
router.get('/:requestId', auth, async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const reqDoc = await RequestModel.findById(req.params.requestId);
    if (!reqDoc) return res.status(404).json({ error: 'Request not found' });

    // ensure requester or accepter only
    if (user.type === 'A' && reqDoc.from.toString() !== user.id) return res.status(403).json({ error: 'Not your request' });
    if (user.type === 'B' && (!reqDoc.acceptedBy || reqDoc.acceptedBy.toString() !== user.id)) return res.status(403).json({ error: 'Not your request' });

    const messages = await MessageModel.find({ requestId: req.params.requestId }).sort({ createdAt: 1 });
    return res.json(messages);
  } catch (err) {
    console.error('get messages error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
