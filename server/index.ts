// server/index.ts
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Routes
import predictRouter from "./routes/predict.js";
import authRouter from "./routes/auth.js";
import historyRouter from "./routes/history.js";

dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });

// ✅ Connect MongoDB once
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use("/api/predict", predictRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/history", historyRouter);

  app.get("/api/ping", (_req, res) => res.json({ message: "pong 🏓" }));

  return app;
}
