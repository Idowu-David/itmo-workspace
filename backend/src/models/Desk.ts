import mongoose, { Schema, Document } from "mongoose";

export interface IDesk extends Document {
  deskNumber: Number;
  status: "available" | "pending" | "booked";
  currentBookingId: mongoose.Types.ObjectId | null;
  pin: string;
}

const DeskSchema: Schema = new Schema(
  {
    deskNumber: { type: Number, required: true, uniqure: true, min: 1, max: 8 },
    status: {
      type: String,
      enum: ["available", "pending", "occupied"],
    },
    currentBookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    pin: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IDesk>("Desk", DeskSchema);
