import express from "express";
import Coupon from "../../../database/models/coupon.model.js";
import { protect, allowedTo } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";
import AppError from "../../utils/AppError.js";

const router = express.Router();

router.post(
  "/validate",
  protect,
  catchError(async (req, res, next) => {
    const code = (req.body.code || "").toString().trim().toUpperCase();
    if (!code) return next(new AppError("أدخل كود الخصم", 400));
    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) return next(new AppError("كوبون غير صالح", 404));
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return next(new AppError("انتهت صلاحية الكوبون", 400));
    }
    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
      return next(new AppError("تم استنفاد الكوبون", 400));
    }
    res.json({
      status: "success",
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
      },
    });
  })
);

router.get(
  "/",
  protect,
  allowedTo("admin"),
  catchError(async (req, res) => {
    const coupons = await Coupon.find().sort("-createdAt");
    res.json({ status: "success", data: coupons });
  })
);

router.post(
  "/",
  protect,
  allowedTo("admin"),
  catchError(async (req, res, next) => {
    const { code, discountType, value, maxUses, expiresAt } = req.body;
    if (!code || !discountType || value == null) {
      return next(new AppError("بيانات ناقصة", 400));
    }
    const coupon = await Coupon.create({
      code: code.toString().trim().toUpperCase(),
      discountType,
      value: Number(value),
      maxUses: maxUses != null ? Number(maxUses) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });
    res.status(201).json({ status: "success", data: coupon });
  })
);

router.delete(
  "/:id",
  protect,
  allowedTo("admin"),
  catchError(async (req, res, next) => {
    const c = await Coupon.findByIdAndDelete(req.params.id);
    if (!c) return next(new AppError("غير موجود", 404));
    res.json({ status: "success", message: "تم الحذف" });
  })
);

export default router;
