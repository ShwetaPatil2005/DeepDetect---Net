import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err: any) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a 1-hour JWT token for reset
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const resetLink = `http://localhost:8080/reset-password?token=${token}`;

    // Nodemailer transporter with Gmail App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password
      },
    });

    await transporter.sendMail({
      from: `"DeepDetect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    });

    res.json({ message: "Password reset link sent to email" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to send password reset email" });
  }
});

// Reset Password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token) return res.status(400).json({ message: "Token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err: any) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

export default router;
