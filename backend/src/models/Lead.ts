import mongoose, { Document, Schema } from "mongoose";
import { LeadStatus, LeadSource } from "../types";

// Interface — describes what a Lead document looks like
export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: mongoose.Types.ObjectId; // which user created this lead
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Lead email is required"],
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Lost"],
      default: "New",
    },
    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral"],
      required: [true, "Lead source is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // links to the User model
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ILead>("Lead", LeadSchema);
