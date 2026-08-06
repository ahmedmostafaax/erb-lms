import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, enum: ["card", "wallet", "kiosk"], required: true },
    transactionId: String,
    billReference: String,
    paymentMethod: { type: String, default: "manual_transfer" },
  note: { type: String, default: "" },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    paidAt: Date,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    originalAmount: { type: Number },
    currency: { type: String, default: "EGP" },
    status: { type: String, enum: ["pending", "paid", "failed", "cancelled"], default: "pending" },
    paymobOrderId: String,
    payment: { type: paymentSchema, default: null },
    couponCode: { type: String, default: null },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
