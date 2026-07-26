import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect } from "../../middleware/auth.js";
import { uploadImage, uploadDocument } from "../../middleware/uploadMiddleware.js";
import { updateProfileSchema, userIdSchema } from "./profile.validation.js";

import getDashboard from "./profileModules/GetDashboard.modules.js";
import updateProfile from "./profileModules/UpdateProfile.modules.js";
import getPublicProfile from "./profileModules/GetPublicProfile.modules.js";
import updateAvatar from "./profileModules/UpdateAvatar.modules.js";
import updateCv from "./profileModules/UpdateCv.modules.js";

router.get("/:id", validation(userIdSchema), getPublicProfile); // متاح لأي حد

router.use(protect);
router.get("/me/dashboard", getDashboard);
router.put("/me", validation(updateProfileSchema), updateProfile);
router.patch("/me/avatar", uploadImage.single("avatar"), updateAvatar);
router.patch("/me/cv", uploadDocument.single("cv"), updateCv);

export default router;