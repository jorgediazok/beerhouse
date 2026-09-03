import mongoose, { Schema, models, model } from "mongoose";

export type UserDocument = {
  email: string;
  password: string;
  resetTokenHash: string | null;
  resetTokenExpiresAt: Date | null;
};

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    resetTokenHash: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User = (models.User as mongoose.Model<UserDocument>) ?? model<UserDocument>("User", userSchema);
