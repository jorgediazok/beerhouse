import mongoose, { Schema, models, model } from "mongoose";

export const DEFAULT_STOCK = 100;

export type StockDocument = {
  beerId: string;
  quantity: number;
};

const stockSchema = new Schema<StockDocument>({
  beerId: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: DEFAULT_STOCK },
});

export const Stock = (models.Stock as mongoose.Model<StockDocument>) ?? model<StockDocument>("Stock", stockSchema);
