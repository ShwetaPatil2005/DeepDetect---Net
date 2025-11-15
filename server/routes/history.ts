import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import History from "../models/History.js";

const router = express.Router();

// Save AI analysis history
// Save AI analysis history
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      imageName,
      result,
      imageUrl,
      analysisDetails,
      isAI,
      confidence,
      timestamp,
    } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const history = new History({
      userId: decoded.id,
      imageName,
      result,
      imageUrl,
      analysisDetails,
      // NEW structured fields:
      isAI: typeof isAI === "boolean" ? isAI : result === "AI-Generated",
      confidence: typeof confidence === "number" ? confidence : 0,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    await history.save();

    res.status(201).json({ message: "History saved successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});



// Get user's history
router.get("/", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const history = await History.find({ userId: decoded.id }).sort({
      date: -1,
    });
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

// Delete a history item by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const history = await History.findOneAndDelete({ _id: req.params.id, userId: decoded.id });

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    res.json({ message: "History deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});
