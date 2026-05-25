import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "student" | "admin";
    };

    req.user = decoded;

    next();
  } catch (error) {
    console.error(`Internal server error: ${error}`);
    res.status(401).json({
      status: "error",
      message: "Not authorized, invalid token",
    });
  }
};
