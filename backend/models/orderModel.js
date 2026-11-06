import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  estimatedDelivery: { type: String, default: "25-30 mins" },
  driver: { type: Object, default: {} }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
