import mongoose, { Schema, Document } from "mongoose";

// base fields shared between both
export interface IBookingInput {
  deskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  purpose: string;
  phoneNumber: string;
  proofOfWork: string;
}

export interface IBooking extends IBookingInput, Document {
  status: "pending" | "approved" | "rejected" | "checked-in" | "expired" | "cancelled";
  approvedAt?: Date;
}

const BookingSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deskId: { type: Schema.Types.ObjectId, ref: "Desk", required: true },
    name: { type: String, required: true },
    purpose: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    proofOfWork: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "checked-in", "expired", "cancelled"],
      default: "pending",
    },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<IBooking>("Booking", BookingSchema);