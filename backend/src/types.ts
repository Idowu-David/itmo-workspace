import { Request } from "express";

export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "checked-in"
  | "expired";

export type DeskStatus = "available" | "pending" | "booked";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "student" | "admin";
  };
}

export interface IDesk {
  _id: string;
  deskNumber: number;
}
