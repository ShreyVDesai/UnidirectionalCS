import { Router, Response } from "express";
import RequestModel from "../models/Request";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

/**
 * Create Request (Requester A)
 */
router.post("/", authMiddleware, async (req, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) return res.status(401).json({ message: "Unauthorized" });

    const newReq = await RequestModel.create({
      requester: authReq.user.id,
      description: req.body.description,
    });

    res.json(newReq);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Get Pending Requests (Responders see this)
 */
router.get("/pending", authMiddleware, async (req, res: Response) => {
  try {
    const requests = await RequestModel.find({ status: "pending" }).populate(
      "requester",
      "name email"
    );
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Accept Request (Responder accepts)
 */
router.post("/:id/accept", authMiddleware, async (req, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) return res.status(401).json({ message: "Unauthorized" });

    const request = await RequestModel.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const userId = authReq.user.id;

    if (!request.responders.some(r => r.toString() === userId)) {
      request.responders.push(userId as any);
      request.status = "active";
      await request.save();
    }

    res.json(request);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Get My Requests (Requester dashboard)
 */
router.get("/my", authMiddleware, async (req, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) return res.status(401).json({ message: "Unauthorized" });

    const requests = await RequestModel.find({ requester: authReq.user.id }).populate(
      "responders",
      "name email"
    );
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Get Active Conversations (Requester)
 */
router.get("/active", authMiddleware, async (req, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) return res.status(401).json({ message: "Unauthorized" });

    const active = await RequestModel.find({
      requester: authReq.user.id,
      status: "active",
    })
      .populate("responders", "name email")
      .populate("requester", "name email");

    res.json(active);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Get Accepted Requests (Responder dashboard)
 */
router.get("/accepted", authMiddleware, async (req, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) return res.status(401).json({ message: "Unauthorized" });

    const accepted = await RequestModel.find({
      responders: authReq.user.id,
    })
      .populate("requester", "name email")
      .populate("responders", "name email");

    res.json(accepted);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
