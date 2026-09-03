import mongoose, { Schema, models, model } from "mongoose";

export type ReviewDocument = {
  beerId: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

const reviewSchema = new Schema<ReviewDocument>(
  {
    beerId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

reviewSchema.index({ beerId: 1, userId: 1 }, { unique: true });

export const Review = (models.Review as mongoose.Model<ReviewDocument>) ?? model<ReviewDocument>("Review", reviewSchema);
