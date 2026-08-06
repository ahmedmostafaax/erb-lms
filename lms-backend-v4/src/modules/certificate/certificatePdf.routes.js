import express from "express";
import Certificate from "../../../database/models/certificate.model.js";
import { protect } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";
import AppError from "../../utils/AppError.js";
import buildCertificatePdf from "../../utils/buildCertificatePdf.js";

const router = express.Router();

router.get(
  "/:id/pdf",
  protect,
  catchError(async (req, res, next) => {
    const cert = await Certificate.findById(req.params.id)
      .populate("user", "name")
      .populate("course", "title");
    if (!cert) return next(new AppError("الشهادة غير موجودة", 404));
    if (cert.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(new AppError("غير مصرح", 403));
    }
    const buf = buildCertificatePdf({
      studentName: cert.user.name,
      courseTitle: cert.course.title,
      dateStr: new Date(cert.issuedAt || Date.now()).toISOString().slice(0, 10),
      certId: cert._id.toString().slice(-8).toUpperCase(),
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="certificate-${cert._id}.pdf"`
    );
    res.send(buf);
  })
);

export default router;
