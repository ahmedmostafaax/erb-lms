import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, enum: ["card", "wallet", "kiosk"], required: true },
    transactionId: String,
    billReference: String, // كود فوري (لو الطريقة kiosk)
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
    currency: { type: String, default: "EGP" },
    status: { type: String, enum: ["pending", "paid", "failed", "cancelled"], default: "pending" },
    paymobOrderId: String, // بنخزنه عشان نربط الـ webhook بالطلب الصح
    payment: { type: paymentSchema, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
