import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    console.log("NO REQ USER")
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Admin access only",
    });
  }

  next();
};
