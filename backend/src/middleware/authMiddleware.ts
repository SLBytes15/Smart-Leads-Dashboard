import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse";
import { UserRole } from "../types";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      sendError(res, "No token provided, access denied", 401);
      return;
    }
    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: UserRole;
    };

    req.user = decode;
    next();
  } catch (error) {
    sendError(res, "Invalid or expired token", 400);
  }
};

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "admin") {
    sendError(res, "Access denied. Admins only.", 403);
    return;
  }
  next();
};