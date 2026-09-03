import mongoose, { Schema, models, model } from "mongoose";

export type OrderItem = {
  beerId: string;
  name: string;
  price: number;
  qty: number;
};

export type ShippingInfo = {
  name: string;
  phone: string;
  document: string;
  address: string;
  zipCode: string;
  time: string;
};

export type OrderDocument = {
  userId: mongoose.Types.ObjectId;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shipping: ShippingInfo;
  status: "confirmed";
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
};

const orderItemSchema = new Schema<OrderItem>(
  {
    beerId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
  },
  { _id: false }
);

const shippingSchema = new Schema<ShippingInfo>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    document: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    time: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    total: { type: Number, required: true },
    shipping: { type: shippingSchema, required: true },
    status: { type: String, enum: ["confirmed"], default: "confirmed" },
    paymentId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Order = (models.Order as mongoose.Model<OrderDocument>) ?? model<OrderDocument>("Order", orderSchema);
