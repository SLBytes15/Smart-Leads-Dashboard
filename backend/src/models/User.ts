import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "../types";

// Interface — describes what a User document looks like
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

// Schema — tells MongoDB how to store the data
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "sales"],
      default: "sales", // new users are sales by default
    },
  },
  {
    timestamps: true, // auto-adds createdAt and updatedAt
  },
);

export default mongoose.model<IUser>("User", UserSchema);
