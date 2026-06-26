import mongoose, { Schema, Document } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "student" | "admin";
  googleId?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);
