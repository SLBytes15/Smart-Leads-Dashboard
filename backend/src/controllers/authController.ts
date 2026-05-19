import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { sendSuccess, sendError } from "../utils/apiResponse";

// ─── REGISTER ───────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, "User already exists with this email", 400);
      return;
    }

    // Hash the password (never store plain text passwords!)
    // 10 = salt rounds, higher = more secure but slower
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "sales", // default to sales if not provided
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // payload (stored inside token)
      process.env.JWT_SECRET as string, // secret key
      { expiresIn: "7d" }, // token expires in 7 days
    );

    sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "User registered successfully",
      201,
    );
  } catch (error) {
    sendError(res, "Registration failed", 500);
  }
};

// ─── LOGIN ──────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful",
    );
  } catch (error) {
    sendError(res, "Login failed", 500);
  }
};
