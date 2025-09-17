import { Router, Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import RequestModel from "../models/Request";
import { MessageModel } from "../models/Message";
import { Types } from "mongoose";

const router = Router();

/**
 * Send a message (Requester A or Responder B)
 */
router.post("/send/:requestId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const { requestId } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const requestDoc = await RequestModel.findById(requestId);
    if (!requestDoc) {
      return res.status(404).json({ message: "Request not found" });
    }

    let senderType: "A" | "B";
    let expiresAt: Date | undefined;

    if (authReq.user.type === "A") {
      // ✅ Only requester of this request can send
      if (requestDoc.requester.toString() !== authReq.user.id) {
        return res.status(403).json({ message: "Not allowed to send message" });
      }
      senderType = "A";
      expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiry
    } else if (authReq.user.type === "B") {
      // ✅ Responder must have accepted this request
      const isResponder = requestDoc.responders.some(r => r.toString() === authReq.user?.id);
      if (!isResponder) {
        return res.status(403).json({ message: "You must accept the request before replying" });
      }
      senderType = "B";
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const msg = await MessageModel.create({
      requestId: requestDoc._id,
      sender: new Types.ObjectId(authReq.user.id),
      senderType,
      content,
      ...(expiresAt ? { expiresAt } : {}),
    });

    return res.status(201).json(msg);
  } catch (err) {
    console.error("❌ Send message error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get messages for a request (Requester or Responders)
 */
router.get("/:requestId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const requestDoc = await RequestModel.findById(requestId);
    if (!requestDoc) {
      return res.status(404).json({ message: "Request not found" });
    }

    // ✅ Permission check
    const isRequester = authReq.user.type === "A" && requestDoc.requester.toString() === authReq.user.id;
    const isResponder = authReq.user.type === "B" && requestDoc.responders.some(r => r.toString() === authReq.user?.id);

    if (!isRequester && !isResponder) {
      return res.status(403).json({ message: "Not allowed to view messages" });
    }

    const messages = await MessageModel.find({ requestId: new Types.ObjectId(requestId) })
      .sort("createdAt");

    return res.json(messages);
  } catch (err) {
    console.error("❌ Get messages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
