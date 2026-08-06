import express from "express";
import Activity from "../../../database/models/activity.model.js";
import { protect } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";

const router = express.Router();
router.use(protect);

router.get(
  "/me",
  catchError(async (req, res) => {
    const items = await Activity.find({ user: req.user._id })
      .sort("-createdAt")
      .limit(50);
    res.json({ status: "success", data: items });
  })
);

export default router;

export async function logActivity(userId, type, message, meta = {}) {
  try {
    await Activity.create({ user: userId, type, message, meta });
  } catch {
    /* ignore */
  }
}
