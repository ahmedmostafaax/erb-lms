import express from "express";
const router = express.Router();

import getCertificate from "./certificateModules/GetCertificate.modules.js";

router.get("/:id", getCertificate); // متاح لأي حد، من غير تسجيل دخول (للتحقق من صحة الشهادة)

export default router;
