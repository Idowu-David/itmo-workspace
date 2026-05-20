import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  deskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: String;
  purpose: String;
  phone: String;
  proofOfWork: string;
  status: "pending" | "approved" | "rejected" | "checked-in" | "expired";
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
      enum: ["pending", "approved", "rejected", "checked-in", "expired"],
      default: "pending",
    },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<IBooking>("Booking", BookingSchema);