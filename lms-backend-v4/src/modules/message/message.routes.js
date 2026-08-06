import express from "express";
import Message from "../../../database/models/message.model.js";
import { protect } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";
import AppError from "../../utils/AppError.js";

const router = express.Router();
router.use(protect);

router.get(
  "/",
  catchError(async (req, res) => {
    const messages = await Message.find({
      $or: [{ from: req.user._id }, { to: req.user._id }],
    })
      .populate("from", "name")
      .populate("to", "name")
      .sort("-createdAt")
      .limit(100);
    res.json({ status: "success", data: messages });
  })
);

router.post(
  "/",
  catchError(async (req, res, next) => {
    const { to, body } = req.body;
    if (!to || !body?.trim()) return next(new AppError("بيانات ناقصة", 400));
    const msg = await Message.create({ from: req.user._id, to, body: body.trim() });
    res.status(201).json({ status: "success", data: msg });
  })
);

router.patch(
  "/:id/read",
  catchError(async (req, res, next) => {
    const msg = await Message.findOneAndUpdate(
      { _id: req.params.id, to: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!msg) return next(new AppError("غير موجودة", 404));
    res.json({ status: "success", data: msg });
  })
);

export default router;
